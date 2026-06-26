import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Sector keywords to dynamically discover mining companies from SUNAT
const DISCOVERY_KEYWORDS = [
  "minera", 
  "minas", 
  "consorcio minero", 
  "exploration", 
  "cobre", 
  "gold", 
  "andes", 
  "mining"
];

serve(async (req) => {
  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const latinfoApiKey = Deno.env.get("LATINFO_API_KEY");
    if (!latinfoApiKey) {
      throw new Error("LATINFO_API_KEY no está configurado en los secretos de Supabase.");
    }

    // 2. Pick a random keyword to search for in this execution cycle
    const randomKeyword = DISCOVERY_KEYWORDS[Math.floor(Math.random() * DISCOVERY_KEYWORDS.length)];
    console.log(`[Discovery] Querying latinfo.dev for keyword: "${randomKeyword}"`);

    const searchResponse = await fetch(`https://api.latinfo.dev/pe/search?q=${encodeURIComponent(randomKeyword)}`, {
      headers: { "Authorization": `Bearer ${latinfoApiKey}` }
    });

    if (!searchResponse.ok) {
      throw new Error(`Búsqueda en latinfo falló: ${searchResponse.statusText}`);
    }

    const searchData = await searchResponse.json();
    const discoveredCompanies = searchData.data || [];

    console.log(`[Discovery] Found ${discoveredCompanies.length} companies matching "${randomKeyword}".`);

    const results = [];

    // 3. Process discovered companies (Cap at 5 per execution to prevent timeouts and API limits)
    for (const comp of discoveredCompanies.slice(0, 5)) {
      try {
        const ruc = comp.ruc;
        const razonSocial = comp.razon_social || comp.razonSocial;
        const region = comp.region || "No especificada";
        const province = comp.provincia || comp.province || null;
        const district = comp.distrito || comp.district || null;

        // A. Insert the newly discovered company in the 'companies' table
        const { error: companyError } = await supabase
          .from("companies")
          .upsert({
            ruc: ruc,
            razon_social: razonSocial,
            region: region,
            province: province,
            district: district
          }, { onConflict: "ruc" });

        if (companyError) throw companyError;

        // B. Fetch the full KYB profile (includes OSCE, OEFA, SUNAT debt)
        console.log(`[KYB Sync] Fetching profile for ${razonSocial} (RUC: ${ruc})`);
        const kybResponse = await fetch(`https://api.latinfo.dev/pe/kyb/${ruc}`, {
          headers: { "Authorization": `Bearer ${latinfoApiKey}` }
        });

        if (kybResponse.ok) {
          const kybPayload = await kybResponse.json();

          // C. Upsert the detailed payload into 'latinfo_cache'
          const { error: cacheError } = await supabase
            .from("latinfo_cache")
            .upsert({
              ruc: ruc,
              payload: kybPayload,
              fetched_at: new Date().toISOString(),
              source_status: "SUCCESS"
            }, { onConflict: "ruc" });

          if (cacheError) throw cacheError;
          results.push({ ruc, status: "SUCCESS" });
        } else {
          results.push({ ruc, status: "KYB_FETCH_FAILED", statusCode: kybResponse.status });
        }

      } catch (innerError: any) {
        results.push({ ruc: comp.ruc, status: "ERROR", error: innerError.message });
      }
    }

    return new Response(JSON.stringify({ 
      message: "Proceso de descubrimiento y sincronización completado", 
      keywordUsed: randomKeyword,
      processed: results 
    }), {
      headers: { "Content-Type": "application/json" },
      status: 200
    });

  } catch (err: any) {
    console.error(`[Error] Execution aborted: ${err.message}`);
    return new Response(JSON.stringify({ error: err.message }), {
      headers: { "Content-Type": "application/json" },
      status: 500
    });
  }
});

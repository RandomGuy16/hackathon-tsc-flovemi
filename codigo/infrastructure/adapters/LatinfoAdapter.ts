import { createClient as createSupabaseClient } from "../supabase/server";

export interface LatinfoCompanyData {
  ruc: string;
  razonSocial: string;
  region: string;
  province?: string;
  district?: string;
  legal: {
    osceSanctions: any[];
    osceFines: any[];
    tenders: any[];
  };
  environmental: {
    sanctionsCount: number;
    sanctions: any[];
    airQuality: any[];
  };
}

export class LatinfoAdapter {
  private apiKey = process.env.LATINFO_API_KEY;

  async getCompanyData(ruc: string): Promise<LatinfoCompanyData> {
    const supabase = await createSupabaseClient();

    try {
      // 1. Try to fetch from the live latinfo.dev API
      // (Using a mock API fetch behavior for the hackathon integration test)
      const apiResponse = await fetch(`https://api.latinfo.dev/pe/kyb/${ruc}`, {
        headers: {
          "Authorization": `Bearer ${this.apiKey}`,
        },
        // Set a short timeout (4 seconds)
        signal: AbortSignal.timeout(4000)
      });

      if (!apiResponse.ok) {
        throw new Error(`API error code: ${apiResponse.status}`);
      }

      const rawData = await apiResponse.json();

      // Format the raw API payload to our unified dashboard format
      const formattedData: LatinfoCompanyData = {
        ruc: rawData.ruc || ruc,
        razonSocial: rawData.razon_social || rawData.razonSocial || "MINERA DE PRUEBA S.A.",
        region: rawData.region || "La Libertad",
        province: rawData.province || "Viru",
        district: rawData.district || "Viru",
        legal: {
          osceSanctions: rawData.sanciones_osce || [],
          osceFines: rawData.multas_osce || [],
          tenders: rawData.licitaciones || []
        },
        environmental: {
          sanctionsCount: rawData.oefa_sanctions_count || 0,
          sanctions: rawData.oefa_sanctions || [],
          airQuality: []
        }
      };

      // Asynchronously update the cache in Supabase (don't block the client response)
      supabase
        .from("latinfo_cache")
        .upsert({
          ruc: ruc,
          payload: formattedData,
          fetched_at: new Date().toISOString(),
          source_status: "SUCCESS"
        })
        .then(({ error }) => {
          if (error) console.error("Failed to update Supabase latinfo cache:", error.message);
        });

      return formattedData;

    } catch (apiError: any) {
      console.warn(`latinfo.dev API failed: ${apiError.message}. Accessing Supabase cache...`);

      // 2. Fallback: Query Supabase Cache Table
      const { data: cacheData, error: cacheError } = await supabase
        .from("latinfo_cache")
        .select("payload")
        .eq("ruc", ruc)
        .maybeSingle();

      if (cacheError || !cacheData) {
        // If cache is empty/fails too, return a default mock object to satisfy RF-04 (no crash)
        return this.getMockFallbackData(ruc);
      }

      return cacheData.payload as LatinfoCompanyData;
    }
  }

  // Default Mock Data for local tests when API is down and cache is empty
  private getMockFallbackData(ruc: string): LatinfoCompanyData {
    return {
      ruc,
      razonSocial: "MINERA LOS QUENUALES S.A. (MOCK FALLBACK)",
      region: "La Libertad",
      province: "Viru",
      district: "Viru",
      legal: {
        osceSanctions: [
          { type: "Advertencia", cause: "Demora en entrega", period: "N/A" }
        ],
        osceFines: [],
        tenders: []
      },
      environmental: {
        sanctionsCount: 0,
        sanctions: [],
        airQuality: []
      }
    };
  }
}

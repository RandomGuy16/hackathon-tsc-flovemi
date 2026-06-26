/**
 * Script to seed Supabase with Company profiles and populate their latinfo.dev cache.
 * 
 * Execution:
 * 1. Make sure env variables are configured in codigo/.env.local:
 *    - NEXT_PUBLIC_SUPABASE_URL
 *    - SUPABASE_SERVICE_ROLE_KEY
 *    - LATINFO_API_KEY
 * 
 * 2. Run: npx ts-node --project tsconfig.json scripts/seed-latinfo.ts
 */

import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";
import * as path from "path";

// Manual parsing of .env.local to avoid requiring 'dotenv' as a dependency
try {
  const envPath = path.resolve(__dirname, "../.env.local");
  if (fs.existsSync(envPath)) {
    const envFile = fs.readFileSync(envPath, "utf-8");
    envFile.split("\n").forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) return;
      const index = trimmed.indexOf("=");
      if (index !== -1) {
        const key = trimmed.substring(0, index).trim();
        const value = trimmed.substring(index + 1).trim().replace(/^['"]|['"]$/g, "");
        process.env[key] = value;
      }
    });
  }
} catch (envError: any) {
  console.warn("Could not parse .env.local file:", envError.message);
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const latinfoApiKey = process.env.LATINFO_API_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Error: Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in env variables.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
  },
});

// List of real mining companies in Peru to seed
const testCompanies = [
  {
    ruc: "20100047218",
    razon_social: "MINERA LOS QUENUALES S.A.",
    region: "La Libertad",
    province: "Viru",
    district: "Viru",
    latitude: -8.641,
    longitude: -78.748
  },
  {
    ruc: "20340596821",
    razon_social: "COMPAÑIA MINERA BARRICK MISQUICHILCA S.A.",
    region: "Ancash",
    province: "Huaraz",
    district: "Janghas",
    latitude: -9.531,
    longitude: -77.528
  },
  {
    ruc: "20100030595",
    razon_social: "SOUTHERN PERU COPPER CORPORATION",
    region: "Moquegua",
    province: "Ilo",
    district: "Pacocha",
    latitude: -17.643,
    longitude: -71.341
  },
  {
    ruc: "20552265531",
    razon_social: "MINERA LAS BAMBAS S.A.",
    region: "Apurimac",
    province: "Cotabambas",
    district: "Challhuahuacho",
    latitude: -14.043,
    longitude: -72.718
  },
  {
    ruc: "20100079411",
    razon_social: "COMPAÑIA DE MINAS BUENAVENTURA S.A.A.",
    region: "Huancavelica",
    province: "Castrovirreyna",
    district: "Castrovirreyna",
    latitude: -13.279,
    longitude: -75.319
  }
];

async function seedCompanies() {
  console.log("=== 1. Seeding Companies into Supabase ===");
  
  const { data, error } = await supabase
    .from("companies")
    .upsert(testCompanies, { onConflict: "ruc" })
    .select();

  if (error) {
    console.error("❌ Error seeding companies:", error.message);
    process.exit(1);
  }

  console.log(`✅ Seeded ${data?.length} companies successfully.`);
}

async function populateLatinfoCache() {
  console.log("\n=== 2. Fetching from latinfo.dev & Seeding Cache ===");
  
  if (!latinfoApiKey) {
    console.warn("⚠️ Warning: LATINFO_API_KEY is not defined. Cache populating skipped.");
    return;
  }

  for (const company of testCompanies) {
    console.log(`Fetching latinfo.dev data for ${company.razon_social} (RUC: ${company.ruc})...`);
    
    try {
      const response = await fetch(`https://api.latinfo.dev/pe/ruc/${company.ruc}`, {
        headers: {
          "Authorization": `Bearer ${latinfoApiKey}`
        }
      });

      if (!response.ok) {
        console.warn(`⚠️ Failed to fetch RUC ${company.ruc} from API. Status: ${response.status}`);
        continue;
      }

      const rawData = await response.json();

      // Format the cache payload matching our schema expectations
      const formattedCache = {
        ruc: company.ruc,
        razonSocial: rawData.razon_social || company.razon_social,
        region: company.region,
        province: company.province,
        district: company.district,
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

      // Save to Supabase
      const { error: upsertError } = await supabase
        .from("latinfo_cache")
        .upsert({
          ruc: company.ruc,
          payload: formattedCache,
          fetched_at: new Date().toISOString(),
          source_status: "SUCCESS"
        }, { onConflict: "ruc" });

      if (upsertError) {
        console.error(`❌ Error inserting cache for RUC ${company.ruc}:`, upsertError.message);
      } else {
        console.log(`✅ Cache updated in Supabase for ${company.razon_social}.`);
      }

    } catch (fetchError: any) {
      console.error(`❌ Network error while calling latinfo.dev for RUC ${company.ruc}:`, fetchError.message);
    }
  }
  
  console.log("\n=== Seeding Process Finished! ===");
}

async function run() {
  await seedCompanies();
  await populateLatinfoCache();
}

run().catch((err) => {
  console.error("Execution failed:", err);
  process.exit(1);
});

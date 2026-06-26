const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Parse .env.local manually
try {
  const envPath = path.join(__dirname, '../.env.local');
  if (!fs.existsSync(envPath)) {
    console.error(".env.local file not found at:", envPath);
    process.exit(1);
  }
  const dotenvContent = fs.readFileSync(envPath, 'utf8');
  const env = {};
  dotenvContent.split('\n').forEach(line => {
    const cleanLine = line.trim();
    if (!cleanLine || cleanLine.startsWith('#')) return;
    const idx = cleanLine.indexOf('=');
    if (idx !== -1) {
      const key = cleanLine.substring(0, idx).trim();
      const val = cleanLine.substring(idx + 1).trim();
      env[key] = val;
    }
  });

  const url = env.NEXT_PUBLIC_SUPABASE_URL;
  const key = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  console.log("Supabase URL:", url);
  console.log("Supabase Key length:", key ? key.length : 0);

  if (!url || !key) {
    console.error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local");
    process.exit(1);
  }

  const supabase = createClient(url, key);

  async function test() {
    console.log("Querying 'companies' table...");
    const { data, error } = await supabase.from('companies').select('*').limit(3);
    if (error) {
      console.error("Error querying 'companies':", error);
    } else {
      console.log("SUCCESS! Connection established. Data:", data);
    }

    console.log("Querying 'latinfo_cache' table...");
    const { data: cacheData, error: cacheError } = await supabase.from('latinfo_cache').select('ruc, fetched_at').limit(3);
    if (cacheError) {
      console.error("Error querying 'latinfo_cache':", cacheError);
    } else {
      console.log("SUCCESS! latinfo_cache query returned:", cacheData);
    }
  }

  test();
} catch (e) {
  console.error("Script execution failed:", e);
}

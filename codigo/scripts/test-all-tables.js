const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

try {
  const envPath = path.join(__dirname, '../.env.local');
  if (!fs.existsSync(envPath)) {
    console.error(".env.local file not found");
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

  if (!url || !key) {
    console.error("Missing environment variables");
    process.exit(1);
  }

  const supabase = createClient(url, key);

  const tables = [
    'companies',
    'latinfo_cache',
    'safety_records',
    'social_conflicts',
    'public_projects',
    'air_quality',
    'mining_projects',
    'illegal_mining'
  ];

  async function check() {
    console.log("Checking all project tables in Supabase...");
    for (const table of tables) {
      const { data, error } = await supabase.from(table).select('count').limit(1);
      if (error) {
        console.log(`❌ Table [${table}] - Error/Not Found:`, error.message);
      } else {
        // Query exact row count if table exists
        const { count, error: countErr } = await supabase.from(table).select('*', { count: 'exact', head: true });
        if (countErr) {
          console.log(`✅ Table [${table}] - Exists, but failed counting rows:`, countErr.message);
        } else {
          console.log(`✅ Table [${table}] - Exists, Row Count: ${count}`);
        }
      }
    }
  }

  check();
} catch (e) {
  console.error("Script execution failed:", e);
}

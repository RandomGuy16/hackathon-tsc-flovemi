const fs = require('fs');
const path = require('path');

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

  const apiKey = env.LATINFO_API_KEY;
  const baseUrl = env.LATINFO_BASE_URL ?? 'https://api.latinfo.dev';
  const ruc = '20505686064'; // Google Peru

  const endpoints = [
    `/pe/sunat/padron/${ruc}`,
    `/pe/sunat/ruc/${ruc}`,
    `/pe/kyb/${ruc}`,
    `/pe/sunat/padron/search?q=GOOGLE`
  ];

  async function test() {
    for (const ep of endpoints) {
      console.log(`\n---------------------------------`);
      console.log(`Querying endpoint: ${ep}...`);
      try {
        const res = await fetch(`${baseUrl}${ep}`, {
          headers: { Authorization: `Bearer ${apiKey}` }
        });
        console.log("Status:", res.status);
        const text = await res.text();
        console.log("Raw Response preview (first 300 chars):", text.substring(0, 300));
      } catch (err) {
        console.error("Fetch error for endpoint", ep, ":", err);
      }
    }
  }

  test();
} catch (e) {
  console.error("Script execution failed:", e);
}

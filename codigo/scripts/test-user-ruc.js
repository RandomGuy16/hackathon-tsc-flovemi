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
  const ruc = '20330262428'; // User RUC

  console.log("LATINFO Base URL:", baseUrl);
  console.log(`Querying user RUC: ${ruc}...`);

  async function test() {
    try {
      const res = await fetch(`${baseUrl}/pe/kyb/${ruc}`, {
        headers: { Authorization: `Bearer ${apiKey}` }
      });
      console.log("KYB Detail Status:", res.status);
      const text = await res.text();
      console.log("KYB Detail Response:", text.substring(0, 500));

      const resSearch = await fetch(`${baseUrl}/pe/sunat/padron/search?q=${ruc}`, {
        headers: { Authorization: `Bearer ${apiKey}` }
      });
      console.log("Search Status:", resSearch.status);
      const textSearch = await resSearch.text();
      console.log("Search Response:", textSearch);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  }

  test();
} catch (e) {
  console.error("Script execution failed:", e);
}

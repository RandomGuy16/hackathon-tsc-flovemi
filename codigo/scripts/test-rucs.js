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
  
  // Real Peruvian RUCs
  const rucs = [
    '20505686064', // Google Peru S.R.L.
    '20100017491', // Telefonica del Peru S.A.A.
    '20100030595'  // Southern Peru (preloaded)
  ];

  async function test() {
    for (const ruc of rucs) {
      console.log(`\n---------------------------------`);
      console.log(`Querying RUC: ${ruc}...`);
      try {
        const res = await fetch(`${baseUrl}/pe/kyb/${ruc}`, {
          headers: { Authorization: `Bearer ${apiKey}` }
        });
        console.log("Status:", res.status);
        const text = await res.text();
        console.log("Raw Response:", text);
      } catch (err) {
        console.error("Fetch error for RUC", ruc, ":", err);
      }
    }
  }

  test();
} catch (e) {
  console.error("Script execution failed:", e);
}

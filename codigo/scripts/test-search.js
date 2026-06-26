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
  
  // Test searching by RUC
  const query = '20100047218'; 

  console.log("LATINFO API KEY length:", apiKey ? apiKey.length : 0);
  console.log("LATINFO Base URL:", baseUrl);

  async function test() {
    console.log(`Searching for "${query}" via /pe/sunat/padron/search...`);
    try {
      const res = await fetch(`${baseUrl}/pe/sunat/padron/search?q=${encodeURIComponent(query)}`, {
        headers: { Authorization: `Bearer ${apiKey}` }
      });
      console.log("Response Status:", res.status);
      const text = await res.text();
      console.log("Response Text:", text);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  }

  test();
} catch (e) {
  console.error("Script execution failed:", e);
}

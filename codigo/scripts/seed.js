const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

async function run() {
  console.log("Starting Supabase database setup and seeding...");

  // 1. Read environment variables from .env.local
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
  // Prefer service role key for admin operations to bypass RLS
  const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SECRET_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  console.log("Supabase URL:", url);
  console.log("Using Key (length):", serviceKey ? serviceKey.length : 0);

  if (!url || !serviceKey) {
    console.error("Error: Missing NEXT_PUBLIC_SUPABASE_URL or API key.");
    process.exit(1);
  }

  // Initialize Supabase client
  const supabase = createClient(url, serviceKey);

  try {
    const mockCompanies = [
      {
        ruc: '20330262428',
        razon_social: 'COMPAÑIA MINERA ANTAMINA S.A.',
        region: 'Ancash',
        province: 'Huaraz',
        district: 'Jangas',
        latitude: -9.531,
        longitude: -77.528
      },
      {
        ruc: '20100047218',
        razon_social: 'MINERA LOS QUENUALES S.A.',
        region: 'La Libertad',
        province: 'Viru',
        district: 'Viru',
        latitude: -8.641,
        longitude: -78.748
      },
      {
        ruc: '20100030595',
        razon_social: 'SOUTHERN PERU COPPER CORPORATION',
        region: 'Moquegua',
        province: 'Ilo',
        district: 'Pacocha',
        latitude: -17.643,
        longitude: -71.341
      },
      {
        ruc: '20340596821',
        razon_social: 'COMPAÑIA MINERA BARRICK MISQUICHILCA S.A.',
        region: 'Ancash',
        province: 'Huaraz',
        district: 'Janghas',
        latitude: -9.531,
        longitude: -77.528
      },
      {
        ruc: '20552528795',
        razon_social: 'MINERA LAS BAMBAS S.A.',
        region: 'Apurimac',
        province: 'Cotabambas',
        district: 'Challhuahuacho',
        latitude: -14.103,
        longitude: -72.336
      },
      {
        ruc: '20601837031',
        razon_social: 'MINERA TEMYJ S.A.C.',
        region: 'Ica',
        province: 'Nasca',
        district: 'Vista Alegre',
        latitude: -14.832,
        longitude: -74.938
      }
    ];

    console.log("Seeding companies...");
    for (const c of mockCompanies) {
      const { error } = await supabase.from('companies').upsert(c, { onConflict: 'ruc' });
      if (error) console.error(`Error seeding company ${c.ruc}:`, error.message);
    }
    console.log("Companies seeded successfully!");

    const mockSafety = [
      { company_ruc: '20330262428', year: 2024, fatal_accidents: 0, occupational_diseases: 2, source_url: 'http://minem.gob.pe/safety/2024' },
      { company_ruc: '20330262428', year: 2025, fatal_accidents: 1, occupational_diseases: 4, source_url: 'http://minem.gob.pe/safety/2025' },
      { company_ruc: '20100047218', year: 2024, fatal_accidents: 2, occupational_diseases: 5, source_url: 'http://minem.gob.pe/safety/2024' },
      { company_ruc: '20100047218', year: 2025, fatal_accidents: 3, occupational_diseases: 12, source_url: 'http://minem.gob.pe/safety/2025' },
      { company_ruc: '20100030595', year: 2024, fatal_accidents: 1, occupational_diseases: 1, source_url: 'http://minem.gob.pe/safety/2024' },
      { company_ruc: '20100030595', year: 2025, fatal_accidents: 0, occupational_diseases: 3, source_url: 'http://minem.gob.pe/safety/2025' },
      { company_ruc: '20552528795', year: 2024, fatal_accidents: 2, occupational_diseases: 8, source_url: 'http://minem.gob.pe/safety/2024' },
      { company_ruc: '20552528795', year: 2025, fatal_accidents: 3, occupational_diseases: 15, source_url: 'http://minem.gob.pe/safety/2025' }
    ];

    console.log("Seeding safety records...");
    for (const s of mockSafety) {
      const { error } = await supabase.from('safety_records').upsert(s);
      if (error) console.error("Error seeding safety:", error.message);
    }
    console.log("Safety records seeded!");

    const mockConflicts = [
      { region: 'Ancash', province: 'Huaraz', district: 'Jangas', description: 'Conflicto socioambiental por acceso y canalización de fuentes de agua comunitarias', status: 'activo', related_company_ruc: '20330262428', reported_at: '2025-02-15' },
      { region: 'La Libertad', province: 'Viru', district: 'Viru', description: 'Conflicto social por el impacto del transporte pesado de mineral en las vías agrícolas locales', status: 'activo', related_company_ruc: '20100047218', reported_at: '2025-01-20' },
      { region: 'Moquegua', province: 'Ilo', district: 'Pacocha', description: 'Mesa de diálogo por cumplimiento de compromisos laborales y aportes para obras de infraestructura local', status: 'resuelto', related_company_ruc: '20100030595', reported_at: '2024-08-10' },
      { region: 'Apurimac', province: 'Cotabambas', district: 'Challhuahuacho', description: 'Conflicto socioambiental de alta intensidad por el paso del transporte pesado de concentrados de cobre a lo largo del Corredor Minero del Sur, afectando la calidad del aire y los predios agrícolas de las comunidades campesinas.', status: 'activo', related_company_ruc: '20552528795', reported_at: '2025-03-10' }
    ];

    console.log("Seeding social conflicts...");
    for (const c of mockConflicts) {
      const { error } = await supabase.from('social_conflicts').upsert(c);
      if (error) console.error("Error seeding conflict:", error.message);
    }
    console.log("Social conflicts seeded!");

    const mockProjects = [
      { region: 'Ancash', name: 'Mejoramiento integral del sistema de agua potable en San Marcos', budget: 3500000, physical_progress: 0.72, executor: 'Municipalidad Distrital de San Marcos', latitude: -9.53, longitude: -77.52 },
      { region: 'La Libertad', name: 'Mejoramiento y mantenimiento vial de la carretera de acceso a Virú', budget: 5000000, physical_progress: 0.35, executor: 'Municipalidad Provincial de Virú', latitude: -8.64, longitude: -78.74 },
      { region: 'Moquegua', name: 'Construcción y equipamiento del nuevo muelle artesanal de Ilo', budget: 8200000, physical_progress: 0.90, executor: 'Gobierno Regional de Moquegua', latitude: -17.64, longitude: -71.34 },
      { region: 'Apurimac', name: 'Mejoramiento y ampliación del servicio de transitabilidad vial del Corredor Minero en Challhuahuacho', budget: 15400000, physical_progress: 0.42, executor: 'Gobierno Regional de Apurímac', latitude: -14.10, longitude: -72.33 }
    ];

    console.log("Seeding public projects...");
    for (const p of mockProjects) {
      const { error } = await supabase.from('public_projects').upsert(p);
      if (error) console.error("Error seeding public project:", error.message);
    }
    console.log("Public projects seeded!");

    const mockAir = [
      { region: 'Ancash', station_name: 'Estación Jangas', year: 2024, parameter: 'PM10', value: 24.5, unit: 'µg/m³' },
      { region: 'La Libertad', station_name: 'Estación Virú', year: 2024, parameter: 'PM2.5', value: 35.5, unit: 'µg/m³' },
      { region: 'Moquegua', station_name: 'Estación Pacocha', year: 2024, parameter: 'SO2', value: 18.3, unit: 'µg/m³' },
      { region: 'Apurimac', station_name: 'Estación Challhuahuacho (Frente a garita de control)', year: 2024, parameter: 'PM10', value: 45.8, unit: 'µg/m³' }
    ];

    console.log("Seeding air quality...");
    for (const a of mockAir) {
      const { error } = await supabase.from('air_quality').upsert(a);
      if (error) {
        console.log("⚠️ Air Quality table seeding skipped/failed (likely table doesn't exist yet):", error.message);
        break;
      }
    }

    const mockMiningProjects = [
      { company_ruc: '20330262428', name: 'Ampliación Antamina', status: 'de_acuerdo', region: 'Ancash', province: 'Huaraz', district: 'Jangas', process: 'explotacion', mineral_type: 'cobre', estimated_months_remaining: 36, latitude: -9.53, longitude: -77.52 },
      { company_ruc: '20100047218', name: 'Proyecto Andino', status: 'de_acuerdo', region: 'La Libertad', province: 'Viru', district: 'Viru', process: 'exploracion', mineral_type: 'zinc', estimated_months_remaining: 18, latitude: -8.64, longitude: -78.74 },
      { company_ruc: '20100030595', name: 'Tía María', status: 'paralizado', region: 'Arequipa', province: 'Islay', district: 'Cocachacra', process: 'estudio_impacto', mineral_type: 'cobre', estimated_months_remaining: null, latitude: -17.02, longitude: -71.75 },
      { company_ruc: '20552528795', name: 'Ampliación Challhuahuacho - Tajo Chalcobamba', status: 'paralizado', region: 'Apurimac', province: 'Cotabambas', district: 'Challhuahuacho', process: 'explotacion', mineral_type: 'cobre', estimated_months_remaining: 48, latitude: -14.10, longitude: -72.33 }
    ];

    console.log("Seeding mining projects...");
    for (const m of mockMiningProjects) {
      const { error } = await supabase.from('mining_projects').upsert(m);
      if (error) {
        console.log("⚠️ Mining Projects table seeding skipped/failed (likely table doesn't exist yet):", error.message);
        break;
      }
    }

    const mockIllegalMining = [
      { company_ruc: '20100047218', location: 'Cerro El Toro', region: 'La Libertad', province: 'Sanchez Carrion', district: 'Huamachuco', reason: 'Uso de cianuro sin autorización de vertimiento ni planta regulada', regularization_status: 'denegado', detected_at: '2024-11-05', latitude: -7.81, longitude: -78.04 },
      { company_ruc: '20330262428', location: 'Pampa de El Faique', region: 'Ancash', province: 'Huaraz', district: 'Jangas', reason: 'Extracción aurífera informal en área protegida de amortiguamiento', regularization_status: 'en_tramite', detected_at: '2025-03-01', latitude: -9.52, longitude: -77.51 },
      { company_ruc: '20552528795', location: 'Áreas colindantes a la concesión Las Bambas', region: 'Apurimac', province: 'Cotabambas', district: 'Challhuahuacho', reason: 'Invasión de terrenos de la concesión por mineros informales armados para la extracción ilegal de cobre y oro en la zona de amortiguamiento.', regularization_status: 'denegado', detected_at: '2025-01-12', latitude: -14.11, longitude: -72.34 }
    ];

    console.log("Seeding illegal mining...");
    for (const i of mockIllegalMining) {
      const { error } = await supabase.from('illegal_mining').upsert(i);
      if (error) {
        console.log("⚠️ Illegal Mining table seeding skipped/failed (likely table doesn't exist yet):", error.message);
        break;
      }
    }

    // Seeding TEMYJ S.A.C. (RUC 20601837031)
    const kybTemyj = {
      ruc: '20601837031',
      type: 'empresa',
      identity: {
        ruc: '20601837031',
        razon_social: 'MINERA TEMYJ S.A.C.',
        estado: 'BAJA DE OFICIO',
        condicion: 'NO HABIDO',
        ubigeo: '110301',
        domicilio_fiscal: 'P.J. BUENA FE Mz. H Lt. 16',
        locales: [
          { ubigeo: '080703', lugar: 'Chamaca, Chumbivilcas, Cusco', direccion: 'NORTE 8407582 SN MONTE ROJO 06 05003144X0' },
          { ubigeo: '110111', lugar: 'Santiago, Ica, Ica', direccion: 'NORTE 8411368 SN ICA 2 DE CLARITA 01026150' }
        ]
      },
      public_entity: {
        departamento: 'Ica',
        provincia: 'Nasca',
        distrito: 'Vista Alegre',
        estado: 'INACTIVO'
      },
      sanctions: {
        osce_sanctioned: null,
        osce_fines: null,
        osce_penalidades: []
      },
      debts: {
        sunat_coactiva: {
          monto: 449259.00,
          estado: 'EXIGIBLE',
          dependencia: 'I.T.I.Ica',
          nro_resoluciones: 1
        }
      },
      contracts_with_state: {
        total: 0,
        sample: []
      },
      risk_score: 55,
      risk_flags: ['baja_de_oficio', 'no_habido', 'deuda_coactiva']
    };

    console.log("Seeding MINERA TEMYJ S.A.C. cache payload...");
    const { error: errCache } = await supabase.from('latinfo_cache').upsert({
      ruc:          '20601837031',
      payload:      kybTemyj,
      fetched_at:   new Date().toISOString(),
      source_status: 'ok'
    }, { onConflict: 'ruc' });
    if (errCache) console.error("Error seeding TEMYJ cache:", errCache.message);

    console.log("\nFinished seeding process. If any tables failed to seed, run the migration scripts first.");
  } catch (err) {
    console.error("General execution error during seeding:", err);
  }
}

run();

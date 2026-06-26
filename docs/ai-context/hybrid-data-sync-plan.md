# Hybrid Data Sync Plan: latinfo.dev & Manual Government Pipelines

This document details the architecture and operational plan to combine real-time API integrations (`latinfo.dev`) with manual/automated parsing of government documents (Excel/PDF reports from MINEM and OSINERGMIN).

---

## 1. Hybrid Data Architecture

To ensure high availability, data accuracy, and compliance with the 11-hour hackathon limit, we merge two data paths into a single Supabase backend served by Next.js API Routes:

```
[Government Sites: MINEM / OSINERGMIN / PCM]  [API Source: latinfo.dev]
                     |                                       |
    (Manual / Scraping Downloads)                            |
                     v                                       v
         [PDF / Excel Raw Files]                             | (Live HTTPS Request)
                     |                                       |
           (ETL Parser Script)                               v
                     |                         [Next.js: LatinfoAdapter]
                     v                                       |
        [Supabase: Structured Tables] <----------------------| (Cache Update / Fallback)
          - safety_records                                   |
          - osinergmin_sanctions                             v
          - social_conflicts                     [Supabase: latinfo_cache]
                     \                                       /
                      \                                     /
                       v                                   v
                      [Next.js API Route: /api/companies/:ruc/dashboard]
```

---

## 2. Ingestion Workflows per Source Type

### Path A: Live & Cached API Data (`latinfo.dev`)
*   **What:** SUNAT identification data, OSCE sanctions/fines, public tenders, and OEFA environmental sanctions.
*   **How:** 
    1.  The client requests a company profile.
    2.  `LatinfoAdapter` triggers a fetch to the `latinfo.dev` API (SUNAT + OSCE endpoints).
    3.  If the API call is successful, Next.js returns the payload to the frontend and silently launches an asynchronous `upsert` query to write this JSON payload to the `latinfo_cache` table.
    4.  If the API call fails or times out, the adapter queries `latinfo_cache` to retrieve the last successful payload.

### Path B: Seeded Historical & File-Based Data (MINEM & OSINERGMIN)
*   **What:** Fatal accidents, occupational diseases (MINEM), and safety/operational fines (OSINERGMIN).
*   **How:**
    1.  **Extraction:** Download the latest monthly statistic reports from MINEM (Excel format) and the registry of sanctioned companies from OSINERGMIN (PDF or CSV formats).
    2.  **Storage:** Save these raw files inside `codigo/scripts/raw-data/`.
    3.  **Parsing:** Write a unified script `codigo/scripts/seed-file-data.ts`.
        *   For Excel files: Use `xlsx` to parse sheets, extract companies by name or RUC, and read accident counts.
        *   For PDF files: Use `pdf-parse` (or pre-convert them to text locally) to parse the text, search for company RUCs, and extract the resolution numbers, dates, and fine amounts.
    4.  **Database Seeding:** The script runs locally during deployment and inserts structured objects into the database tables (`safety_records`, `safety_fines`).

---

## 3. Data Schema Modifications (Supabase)

To support the OSINERGMIN safety fines alongside MINEM accidents, we add a new table `safety_fines`:

```sql
-- OSINERGMIN safety and operational fines
CREATE TABLE IF NOT EXISTS safety_fines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_ruc TEXT NOT NULL REFERENCES companies(ruc) ON DELETE CASCADE,
  resolution_number TEXT NOT NULL,
  year INTEGER NOT NULL,
  fine_amount_uit NUMERIC(10, 2) NOT NULL, -- Fines measured in UITs (Unidades Impositivas Tributarias)
  infraction_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_safety_fines_ruc ON safety_fines(company_ruc);
```

---

## 4. Backend Aggregation (Next.js Layer)

When serving the unified Ficha Dashboard (`/api/companies/[ruc]/dashboard`), the Next.js API Route aggregates both sources in parallel:

```typescript
// Implement inside infrastructure/repositories/SupabaseCompanyRepository.ts
export async function getCompanyDashboardData(ruc: string) {
  // Query Supabase tables (populated by local CSV/PDF seeds) 
  // and run the LatinfoAdapter concurrently
  const [latinfoResult, safetyDbResult, finesDbResult] = await Promise.all([
    latinfoAdapter.getCompanyData(ruc),
    supabase.from('safety_records').select('*').eq('company_ruc', ruc),
    supabase.from('safety_fines').select('*').eq('company_ruc', ruc)
  ]);

  // Aggregate into the API contract response schema
  return {
    ruc,
    razonSocial: latinfoResult.razonSocial,
    summary: calculateCompositeRisk(latinfoResult, safetyDbResult.data, finesDbResult.data),
    safety: {
      fatalAccidents: safetyDbResult.data?.reduce((acc, curr) => acc + curr.fatal_accidents, 0) || 0,
      occupationalDiseases: safetyDbResult.data?.reduce((acc, curr) => acc + curr.occupational_diseases, 0) || 0,
      osinergminFinesCount: finesDbResult.data?.length || 0,
      finesList: finesDbResult.data || [],
      source: "MINEM + OSINERGMIN"
    },
    environmental: latinfoResult.environmental,
    legal: latinfoResult.legal,
    social: await getSocialConflictsByRegion(latinfoResult.region),
    investment: await getPublicProjectsByRegion(latinfoResult.region)
  };
}
```

---

## 5. Timeline & Responsibilities for Hackathon Implementation

1.  **Phase 1 (13:30 - 14:30) - Ingestion & Seed:**
    *   *Persona C (Infra)*: Downloads the latest PDF list of OSINERGMIN sanctions and the Excel file of MINEM safety statistics.
    *   *Persona C (Infra)*: Writes `codigo/scripts/seed-file-data.ts` to parse the spreadsheets and inject the data into Supabase.
2.  **Phase 2 (14:30 - 15:30) - Backend Integration:**
    *   *Persona A (Backend)*: Implements the `LatinfoAdapter` in Next.js.
    *   *Persona A (Backend)*: Hooks up `getCompanyDashboardData` in the API Route using `Promise.all` for parallel queries.
3.  **Phase 3 (15:30 - 16:30) - Verification:**
    *   *Persona A & C*: Write Jest tests to verify that if `latinfo.dev` API is down, the dashboard still serves the MINEM and OSINERGMIN data correctly from Supabase.

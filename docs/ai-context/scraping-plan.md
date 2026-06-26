# Action Plan: latinfo.dev Data Integration & Scraping

This document outlines the step-by-step integration plan for collecting company profiles, legal history, and tender records from `latinfo.dev`.

---

## 1. Target Endpoints & Integration

We consume three endpoints from `latinfo.dev` to fulfill the requirements detailed in `docs/requerimientos.md`:

### A. Company Search (UC-01)
*   **Endpoint:** `GET https://api.latinfo.dev/pe/sunat/padron/search?q={query}`
*   **Purpose:** Search for companies by commercial name, corporate name, or RUC.
*   **Validation:** Input must be at least 3 characters.
*   **Cache Strategy:** Do not cache search results in database tables directly, but cache key matches in memory (or redis if available) to avoid rapid API call exhaust.

### B. Company Profile & Sanctions (UC-02)
*   **Endpoint:** `GET https://api.latinfo.dev/pe/ruc/{ruc}`
*   **Purpose:** Retrieve RUC validation data, OSCE fines/sanctions, and OEFA sanctions.
*   **Cache Strategy:** Store full JSON payload inside the `latinfo_cache` table.

### C. Public Contracts & Tenders (UC-02)
*   **Endpoint:** `GET https://api.latinfo.dev/pe/licitaciones?ruc={ruc}`
*   **Purpose:** Retrieve the history of state contracts executed by the company.
*   **Cache Strategy:** Store in cache with the company profile.

---

## 2. Core Integration Workflows (Sprint-by-Sprint)

```
[Request /api/companies/:ruc/dashboard]
                   |
         +---------+---------+
         | (Concurrent Runs) |
         v                   v
   [latinfo.dev API]   [Local Supabase DB]
         |                   |
         |-- (Success)       |-- (Fetch seed data)
         |   |               |   - Safety Accidents (MINEM)
         |   v               |   - Regional Conflicts (PNDA)
         | [Update Cache]    |   - Public Projects (INFOBRAS)
         |   |               |
         |-- (Fails)         |
             |               |
             v               v
       [Read Cache] -------->|
             |
             v
     [Combine & Calculate Score]
             |
             v
      [Serve JSON API]
```

### Phase 1: Infrastructure Adapters (Sprint 1)
1.  **Create Interface:** Define `CompanyRepository` and `LatinfoAdapter` contracts in `domain/`.
2.  **Implement `LatinfoAdapter`:** Create the concrete class inside `infrastructure/adapters/`.
    *   Implement **Adapter + Cache + Fallback** pattern.
    *   Attempt live `fetch` call with a timeout of 4 seconds.
    *   If API fails, query `latinfo_cache` table.
    *   If API succeeds, asynchronously trigger `upsert` to update `latinfo_cache`.

### Phase 2: Concurrent Orchestration (Sprint 1)
To satisfy **RNF-02 (Performance: Parallel Queries)**, the use case `ObtenerFichaEmpresa` must execute data fetching concurrently:
```typescript
// Implement in domain/usecases/ObtenerFichaEmpresa.ts
const [latinfoData, safetyData, conflictsData] = await Promise.all([
  this.latinfoAdapter.getCompanyData(ruc),
  this.safetyRepository.getByRuc(ruc),
  this.conflictsRepository.getByRegion(region)
]);
```

### Phase 3: Risk Score Calculation (Sprint 1)
According to **RF-03** and **RF-05**, the business logic must compute the score as follows:

*   **Composite Formula:**
    $$\text{Score} = (\text{Seguridad} \times 0.40) + (\text{Legalidad} \times 0.35) + (\text{Impacto Social} \times 0.25)$$
*   **Calculations per Axis:**
    1.  **Seguridad (40%):**
        *   Base score: 0.
        *   If `fatalAccidents > 0`: `+100` points (multiplied by weight: `40` points to total).
        *   Scale up points based on `occupationalDiseases` (e.g., `+10` points per disease, capped at 100).
    2.  **Legalidad (35%):**
        *   If company has active OSCE sanctions (temporary/permanent debarment): `+100` points.
        *   **OEFA Sanctions (RF-05):** Only sum sanctions where the legal status is **firme** (confirmed/non-appealable). If a sanction is pending or appealed, ignore it for the score.
    3.  **Impacto Social (25%):**
        *   If there is an active conflict directly related to the company RUC or in its immediate operational district/province: `+100` points.

---

## 3. Resiliency & Fallback Strategy

*   **Timeout Guard:** Wrap every external HTTP request with a promise timeout race to prevent a hanging API from blocking the backend.
*   **Null-Safety (RF-04):** Wrap individual sub-promises in try/catch blocks. If `latinfo` fails completely (and cache is empty), the `safety` and `social` axes must still render successfully.

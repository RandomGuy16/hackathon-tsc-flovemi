# Technical Design: Architecture & API Contract

This document compiles the architectural decisions, database schemas, and API contracts for MineraWatch.

## 1. Architectural Decisions & Rules

### Core Layer Separation (Clean Architecture)
To keep domain logic testable and decoupled from underlying infrastructure (Supabase, Vercel, Next.js), we follow these rules:
* **Domain Layer (`codigo/domain/`)**: Holds business entities and use cases. It contains **no imports** of `@supabase/supabase-js`, `next`, `react`, or node-specific framework utilities.
* **Infrastructure Layer (`codigo/infrastructure/`)**: Interacts directly with database clients (Supabase), files, or external APIs (`latinfo.dev`). It implements repository interfaces defined in the domain layer.
* **Interface Layer (`codigo/interface/` or `app/api/*`)**: Exposes Next.js API Routes. They validate incoming request arguments, execute domain use cases, and format responses.
* **Frontend Component Layer (`codigo/app/` except `api/`)**: Consumes JSON payloads from API routes. **Never imports from domain/usecases or infrastructure/ directly**.

### Resiliency: Adapter + Cache + Fallback Pattern
To mitigate external API service instability (such as `latinfo.dev` rate limits or downtime):
1. **Fetch**: The adapter initiates the request.
2. **Fallback**: If the API call fails, query the `latinfo_cache` table in Supabase.
3. **Cache Update**: On a successful external response, save the JSON payload to `latinfo_cache` with a fresh `fetched_at` timestamp.

---

## 2. Database Schema (Supabase)
The database structure is designed to hold both company profiles, external API caches, and seeded territorial risk records.

```sql
-- Company Directory
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ruc TEXT UNIQUE NOT NULL,
  razon_social TEXT NOT NULL,
  region TEXT,
  province TEXT,
  district TEXT,
  latitude FLOAT,
  longitude FLOAT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- LatInfo Resiliency Cache
CREATE TABLE latinfo_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ruc TEXT REFERENCES companies(ruc) ON DELETE CASCADE,
  payload JSONB NOT NULL,
  fetched_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  source_status TEXT
);

-- Axis 1: Safety Records (MINEM)
CREATE TABLE safety_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_ruc TEXT REFERENCES companies(ruc) ON DELETE CASCADE,
  year INT NOT NULL,
  fatal_accidents INT DEFAULT 0,
  occupational_diseases INT DEFAULT 0,
  source_url TEXT
);

-- Axis 4: Social Conflicts (PCM / PNDA)
CREATE TABLE social_conflicts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  region TEXT NOT NULL,
  province TEXT,
  district TEXT,
  description TEXT,
  status TEXT, -- e.g., 'Activo', 'Latente', 'Resuelto'
  related_company_ruc TEXT REFERENCES companies(ruc) ON DELETE SET NULL,
  reported_at DATE
);

-- Axis 5: Public Projects (INFOBRAS / MEF)
CREATE TABLE public_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  region TEXT NOT NULL,
  name TEXT NOT NULL,
  budget NUMERIC DEFAULT 0,
  physical_progress FLOAT DEFAULT 0.0,
  executor TEXT,
  latitude FLOAT,
  longitude FLOAT
);

-- Axis 2: Air Quality (OEFA)
CREATE TABLE air_quality (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  region TEXT NOT NULL,
  station_name TEXT NOT NULL,
  year INT NOT NULL,
  parameter TEXT, -- e.g., 'PM10', 'PM2.5', 'SO2'
  value FLOAT,
  unit TEXT
);
```

---

## 3. Mining Risk Score (Calculated Ejes)
A composite index generated dynamically by the `GetCompanyDashboard` use case:

| Risk Axis | Weight | Condition |
| :--- | :---: | :--- |
| **Safety** (🔴) | 25% | `+25` points if `fatalAccidents > 0` |
| **Environment** (🟡) | 25% | `+25` points if `sanctionsCount > 0` |
| **Legal** (🔴) | 20% | `+20` points if RUC has open OSCE sanctions or fines |
| **Social Conflict** (🟠) | 20% | `+20` points if `activeConflicts > 0` in region/district |
| **Public Investment** (🟢) | 10% | `+10` points if regional projects show budget execution but `< 10%` physical progress |

### Risk Level Ranges:
- **0 - 30**: Low (🟢)
- **31 - 60**: Medium (🟡)
- **61 - 100**: High (🔴)

---

## 4. API Contract

### Search Companies
* **Endpoint**: `GET /api/companies?search={query}`
* **Response**:
```json
{
  "data": [
    {
      "ruc": "20100047218",
      "razonSocial": "MINERA LOS QUENUALES S.A.",
      "region": "La Libertad"
    }
  ]
}
```

### Get Company Dashboard
* **Endpoint**: `GET /api/companies/[ruc]/dashboard`
* **Response**:
```json
{
  "ruc": "20100047218",
  "razonSocial": "MINERA LOS QUENUALES S.A.",
  "summary": {
    "riskScore": 70,
    "riskLevel": "ALTO",
    "lastSyncedAt": "2026-06-26T10:00:00Z"
  },
  "safety": {
    "fatalAccidents": 3,
    "occupationalDiseases": 12,
    "source": "MINEM"
  },
  "environmental": {
    "sanctionsCount": 2,
    "sanctions": [
      {
        "resolution": "Res. 120-2024-OEFA",
        "description": "Exceso de límites máximos permisibles en efluentes",
        "fineUit": 45.5
      }
    ],
    "airQuality": [
      {
        "station": "Estación Quiruvilca",
        "parameter": "PM10",
        "value": 65.4,
        "status": "EXCEDE"
      }
    ]
  },
  "legal": {
    "osceSanctions": [
      {
        "type": "Inhabilitación temporal",
        "period": "6 meses",
        "cause": "Presentación de documentos falsos"
      }
    ],
    "osceFines": [
      {
        "amount": 25000,
        "cause": "Incumplimiento de contrato"
      }
    ],
    "tenders": [
      {
        "id": "LP-001-2025-MINEM",
        "description": "Servicio de remediación ambiental de pasivos",
        "amount": 1200000
      }
    ]
  },
  "social": {
    "activeConflicts": 1,
    "conflicts": [
      {
        "description": "Conflicto por el uso de agua en la microcuenca Quiruvilca",
        "status": "Activo"
      }
    ]
  },
  "investment": {
    "publicProjects": [
      {
        "name": "Mejoramiento del servicio de agua potable en Quiruvilca",
        "budget": 3500000,
        "progress": 5.4,
        "status": "RETRASADO"
      }
    ],
    "totalBudget": 3500000
  }
}
```

### Get Regional Summary
* **Endpoint**: `GET /api/regions/[region]`
* **Response**:
```json
{
  "companiesCount": 15,
  "activeConflicts": 4,
  "totalPublicInvestment": 15000000,
  "companies": [
    {
      "ruc": "20100047218",
      "razonSocial": "MINERA LOS QUENUALES S.A.",
      "riskScore": 70
    }
  ],
  "conflicts": [
    {
      "description": "Conflicto Quiruvilca",
      "status": "Activo"
    }
  ],
  "projects": [
    {
      "name": "Mejoramiento de agua potable",
      "budget": 3500000,
      "progress": 5.4
    }
  ]
}
```

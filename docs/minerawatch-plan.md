# MineraWatch — Panel de Vigilancia Minera Ciudadana

## 1. Resumen ejecutivo

**MineraWatch** es un panel de vigilancia territorial y sectorial que permite a comunidades, periodistas, ONGs y funcionarios conocer el historial y el impacto de una empresa minera en una zona específica del Perú.

No es solo un buscador de RUC. Usa `latinfo.dev` como una fuente más, pero lo cruza con datos de MINEM, PCM conflictos sociales, OEFA calidad del aire e INFOBRAS para responder la pregunta real: **"¿Qué está pasando con la minería cerca de donde vivo?"**

## 2. Problema

El 47% de los proyectos mineros en Perú tienen conflictos sociales activos. Las comunidades afectadas no tienen acceso fácil a información sobre:

- Si la empresa minera ha sido sancionada ambientalmente.
- Cuántos accidentes o muertes ocurrieron en esa mina.
- Qué enfermedades ocupacionales reportaron sus trabajadores.
- Si tiene procesos legales abiertos.
- Cuánto presupuesto del Estado se ha invertido en esa zona vs el impacto real.

## 3. Propuesta de solución

Una plataforma web que, por empresa minera o zona geográfica, muestra una ficha de riesgo completa con cinco ejes:

| Eje | Indicadores | Fuente |
|---|---|---|
| **🔴 SEGURIDAD** | Accidentes mortales, enfermedades ocupacionales | MINEM |
| **🟡 MEDIO AMBIENTE** | Sanciones ambientales, calidad del aire | OEFA + latinfo.dev |
| **🔴 LEGAL** | Sanciones OSCE, multas, licitaciones públicas | latinfo.dev |
| **🟠 CONFLICTO SOCIAL** | Conflictos sociales activos por zona | PCM / PNDA |
| **🟢 INVERSIÓN PÚBLICA** | Obras públicas, presupuesto ejecutado | INFOBRAS / MEF |

Además, genera un **score de riesgo minero** que resume en lenguaje ciudadano el nivel de alerta.

## 4. Usuarios

1. **Comunidades / ciudadanos** cerca de zonas mineras.
2. **Periodistas / ONGs** que investigan minería informal o impacto social.
3. **Funcionarios / fiscalizadores** que necesitan un resumen rápido de una empresa.

## 5. Diferenciación respecto a latinfo.dev

| latinfo.dev | MineraWatch |
|---|---|
| Due diligence empresarial (KYB) | Panel de vigilancia territorial y sectorial |
| Datos crudos por RUC | Ficha interpretada por empresa y por zona |
| No incluye MINEM, PCM, INFOBRAS | Cruce multi-fuente minero |
| Sin mapa geográfico | Mapa interactivo con capas de riesgo |
| Lenguaje técnico/legal | Lenguaje ciudadano + score de riesgo |
| No compara ni rankea | Rankings y comparativas por región |

## 6. Stack técnico

| Capa | Tecnología |
|---|---|
| Frontend + API | Next.js 14+ App Router |
| Deploy | Vercel |
| Base de datos | Supabase (PostgreSQL) |
| Mapas | Leaflet |
| External API | latinfo.dev |
| Seed/ETL | Script Node.js local |

## 7. Arquitectura

```
Next.js (Vercel)
├── Frontend (App Router)
├── API Routes (/app/api)
│     ├── /companies/search
│     ├── /companies/[ruc]/dashboard
│     └── /regions/[region]
domain/
├── entities/
│     ├── Company.ts
│     ├── SafetyRecord.ts
│     ├── EnvironmentalRecord.ts
│     ├── LegalRecord.ts
│     ├── SocialConflict.ts
│     └── InfrastructureInvestment.ts
└── usecases/
      ├── GetCompanyDashboard.ts
      ├── SearchCompanies.ts
      ├── ListCompaniesByRegion.ts
      └── GetRegionSummary.ts
infrastructure/
├── supabase/
│     └── client.ts
└── adapters/
      ├── LatinfoAdapter.ts
      ├── LatinfoTendersAdapter.ts
      ├── PNDAAdapter.ts
      ├── InfobrasAdapter.ts
      ├── OEFAAirAdapter.ts
      └── MinemAdapter.ts
```

### Patrón: Adapter + Cache + Fallback

Cada adapter:
1. Intenta llamar la fuente externa.
2. Si falla, lee de la tabla `latinfo_cache` en Supabase.
3. Si tiene éxito, actualiza la cache.

## 8. Fuentes de datos

| Fuente | Datos | Forma de integración |
|---|---|---|
| **latinfo.dev** `/pe/ruc/{ruc}` | RUC, razón social, OSCE sanciones/multas, OEFA sanciones, licitaciones | API en vivo + cache |
| **latinfo.dev** `/pe/licitaciones` | Licitaciones por empresa | API en vivo + cache |
| **datosabiertos.gob.pe** | Conflictos sociales, datasets mineros | CSV manual → seed |
| **INFOBRAS** | Obras públicas por zona | CSV manual → seed |
| **OEFA calidad del aire** | Calidad del aire 2018-2024 | API key gratis o CSV manual |
| **MINEM** | Accidentes/enfermedades ocupacionales | Excel/PDF manual → CSV → seed |

## 9. Contrato de API inicial

### `GET /api/companies?search={name}`

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

### `GET /api/companies/[ruc]/dashboard`

```json
{
  "ruc": "20100047218",
  "razonSocial": "MINERA LOS QUENUALES S.A.",
  "summary": {
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
    "sanctions": [],
    "airQuality": []
  },
  "legal": {
    "osceSanctions": [],
    "osceFines": [],
    "tenders": []
  },
  "social": {
    "activeConflicts": 1,
    "conflicts": []
  },
  "investment": {
    "publicProjects": [],
    "totalBudget": 5000000
  }
}
```

### `GET /api/regions/[region]`

```json
{
  "companies": [],
  "conflicts": [],
  "projects": []
}
```

## 10. Esquema de Supabase (tablas principales)

```sql
companies (
  id uuid primary key default gen_random_uuid(),
  ruc text unique not null,
  razon_social text,
  region text,
  province text,
  district text,
  latitude float,
  longitude float,
  created_at timestamp default now()
);

latinfo_cache (
  id uuid primary key default gen_random_uuid(),
  ruc text references companies(ruc),
  payload jsonb,
  fetched_at timestamp,
  source_status text
);

safety_records (
  id uuid primary key default gen_random_uuid(),
  company_ruc text references companies(ruc),
  year int,
  fatal_accidents int default 0,
  occupational_diseases int default 0,
  source_url text
);

social_conflicts (
  id uuid primary key default gen_random_uuid(),
  region text,
  province text,
  district text,
  description text,
  status text,
  related_company_ruc text references companies(ruc),
  reported_at date
);

public_projects (
  id uuid primary key default gen_random_uuid(),
  region text,
  name text,
  budget numeric,
  physical_progress numeric,
  executor text,
  latitude float,
  longitude float
);

air_quality (
  id uuid primary key default gen_random_uuid(),
  region text,
  station_name text,
  year int,
  parameter text,
  value float,
  unit text
);
```

## 11. Score de riesgo minero

Score final = (seguridad × 40%) + (legalidad × 35%) + (impacto × 25%)

**Seguridad (40%) — MINEM vía Supabase**

| Dato | Umbral | Puntos |
|---|---|---|
| Accidentes mortales | 1–2 | +30 |
| Accidentes mortales | 3 o más | +50 |
| Accidentes incapacitantes | 3–9 | +15 |
| Accidentes incapacitantes | 10 o más | +30 |

**Legalidad (35%) — latinfo.dev**

| Dato | Endpoint | Umbral | Puntos |
|---|---|---|---|
| Sanciones OEFA firmes | `/pe/oefa/sanctions/ruc/{ruc}` | 1–2 | +20 |
| Sanciones OEFA firmes | `/pe/oefa/sanctions/ruc/{ruc}` | 3 o más | +40 |
| Multas OSCE (monto) | `/pe/osce/fines/ruc/{ruc}` | S/ 1–100k | +15 |
| Multas OSCE (monto) | `/pe/osce/fines/ruc/{ruc}` | S/ +100k | +30 |
| Penalidades OSCE | `/pe/osce/penalidades/ruc/{ruc}` | cualquiera | +15 |
| Impedida de contratar | `/pe/osce/sanctioned/ruc/{ruc}` | sí | +30 |
| Deuda coactiva SUNAT activa | `/pe/sunat/coactiva/ruc/{ruc}` | cualquiera | +20 |

**Impacto social (25%) — datosabiertos.gob.pe PNDA**

| Dato | Umbral | Puntos |
|---|---|---|
| Conflictos sociales activos en la región | 1 | +30 |
| Conflictos sociales activos en la región | 2 o más | +60 |

**Niveles:**
- 0–30: Bajo
- 31–60: Medio
- 61–100: Alto

## 12. Plan de implementación por roles

### Persona A — Dominio + Backend
- Entidades y casos de uso.
- Adapters (`LatinfoAdapter`, `PNDAAdapter`, etc.).
- API routes.

### Persona B — Frontend
- Buscador.
- Ficha de empresa.
- Mapa con Leaflet.
- Mockea respuestas mientras A termina.

### Persona C — Infra + Data + Tests
- Configurar Supabase y tablas.
- Descargar CSVs de PNDA, INFOBRAS, MINEM.
- Script de seed.
- Tests con Jest.
- Deploys incrementales.

## 13. Riesgos y mitigaciones

| Riesgo | Mitigación |
|---|---|
| latinfo.dev caído | Cache local en `latinfo_cache` |
| MINEM no descarga | Seed con datos de ejemplo documentados |
| PNDA sin dataset exacto | Buscar "conflictos sociales" o usar datos de ejemplo |
| Falta de tiempo | Feature freeze 16:45, priorizar ficha + mapa |

## 14. Próximos pasos

1. Obtener API key de latinfo.dev: `api.latinfo.dev/auth/github`
2. Descargar datasets de PNDA, INFOBRAS y MINEM.
3. Crear proyecto en Supabase y ejecutar schema SQL.
4. Correr script de seed.
5. Implementar `/api/companies/search` y `/api/companies/[ruc]/dashboard`.
6. Construir frontend con mapa y ficha.

---

**Evento:** Viernes 26 de junio de 2026  
**Stack:** Next.js + Vercel + Supabase + Clean Architecture  
**Repositorio:** [pendiente]

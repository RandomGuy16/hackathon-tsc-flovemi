# MineraWatch

**Panel ciudadano de vigilancia minera en el Perú.**

Buscas una empresa minera por nombre o RUC y obtienes en segundos su historial de sanciones ambientales, accidentes, deudas fiscales y contratos con el Estado — todo cruzando fuentes oficiales peruanas en una sola ficha de riesgo.

---

## Stack tecnológico

| Capa | Tecnología |
|---|---|
| Frontend + API | Next.js 16 (App Router) |
| Estilos | Tailwind CSS 4 |
| Base de datos | Supabase (PostgreSQL) |
| Deploy | Vercel (serverless) |
| Lenguaje | TypeScript 5 |
| Tests | Jest + ts-jest |

## Herramientas de IA utilizadas

| Herramienta | Uso en el proyecto |
|---|---|
| Claude Code | Arquitectura, implementación y documentación |
| Claude (Anthropic) | Diseño de soluciones y revisión de decisiones |
| ChatGPT | Apoyo en desarrollo y consultas puntuales |
| Kimi | Consultas y generación de contenido |
| Codex | Generación de código asistida |
| Antigravity / Antigravity CLI / Antigravity IDE | Desarrollo asistido por IA |

## Integrantes

| Integrante | Rol |
|---|---|
| Diego Sotelo | Backend: entidades, casos de uso, API routes |
| Ariana Cárdenas | Frontend: buscador, ficha de empresa, mapa |
| Aaroon Delgado | Infraestructura: conexión Supabase, seed de datos, deploy |

## Documentación adicional

| Documento | Descripción |
|---|---|
| [Arquitectura](docs/arquitectura.md) | Capas, flujo de datos y patrón Adapter + Cache + Fallback |
| [Requerimientos](docs/requerimientos.md) | Casos de uso, requisitos funcionales y no funcionales |
| [Contrato de API](docs/api-contract.md) | Endpoints, payloads y manejo de errores |
| [Plan del producto](docs/minerawatch-plan.md) | Resumen ejecutivo, fuentes de datos y score de riesgo |
| [ADR 001 — Clean Architecture](docs/adr/001-clean-architecture-serverless.md) | Decisión de arquitectura con alternativas consideradas |

---

## ¿Qué problema resuelve?

El 47% de los proyectos mineros en Perú tienen conflictos sociales activos. Las comunidades afectadas no tienen forma fácil de saber:

- Si la empresa fue sancionada por daño ambiental (OEFA).
- Cuántos accidentes mortales ocurrieron en esa mina (MINEM).
- Si tiene deudas con SUNAT o está impedida de contratar con el Estado (OSCE).
- Qué contratos públicos tiene adjudicados (SEACE).

MineraWatch reúne esos datos en una sola ficha, en lenguaje ciudadano.

---

## ¿Qué muestra por empresa?

```
EMPRESA: [Nombre]  ·  RUC: [20XXXXXXXXX]  ·  REGIÓN: [Región]
SCORE DE RIESGO: [0–100]  →  NIVEL: BAJO / MEDIO / ALTO

SEGURIDAD      → Accidentes mortales y enfermedades ocupacionales  (MINEM)
MEDIO AMBIENTE → Sanciones ambientales + calidad del aire          (OEFA via latinfo.dev)
LEGAL / FISCAL → Deudas SUNAT · sanciones y multas OSCE           (latinfo.dev)
CONFLICTO      → Conflictos sociales activos en la zona            (PCM / PNDA)
INVERSIÓN      → Obras públicas y presupuesto ejecutado en la zona (INFOBRAS / MEF)
```

### Score de riesgo (0–100)

Cada dimensión produce un sub-score propio (0–100) a partir de datos reales de las APIs. El score final es un promedio ponderado de las tres.

```
score final = (seguridad × 40%) + (legalidad × 35%) + (impacto × 25%)

BAJO   0 – 30
MEDIO 31 – 60
ALTO  61 – 100
```

#### Seguridad (40%) — fuente: MINEM vía Supabase

| Dato que llega | Umbral | Puntos |
|---|---|---|
| Accidentes mortales | 1–2 | +30 |
| Accidentes mortales | 3 o más | +50 |
| Accidentes incapacitantes | 3–9 | +15 |
| Accidentes incapacitantes | 10 o más | +30 |

> Los datos de MINEM (SSL expirado) se cargan manualmente como CSV a Supabase antes de la demo.

#### Legalidad (35%) — fuente: latinfo.dev

| Dato que llega | Endpoint latinfo.dev | Umbral | Puntos |
|---|---|---|---|
| Sanciones OEFA **firmes** | `/pe/oefa/sanctions/ruc/{ruc}` | 1–2 | +20 |
| Sanciones OEFA **firmes** | `/pe/oefa/sanctions/ruc/{ruc}` | 3 o más | +40 |
| Multas OSCE (monto total) | `/pe/osce/fines/ruc/{ruc}` | S/ 1–100k | +15 |
| Multas OSCE (monto total) | `/pe/osce/fines/ruc/{ruc}` | S/ +100k | +30 |
| Penalidades OSCE | `/pe/osce/penalidades/ruc/{ruc}` | cualquiera | +15 |
| **Impedida de contratar** con el Estado | `/pe/osce/sanctioned/ruc/{ruc}` | sí | +30 |
| Deuda coactiva SUNAT activa | `/pe/sunat/coactiva/ruc/{ruc}` | cualquiera | +20 |

> Sanciones OEFA en estado `apelada` o `impugnada` **no suman puntos** — solo las `firme`.

#### Impacto social (25%) — fuente: datosabiertos.gob.pe (PNDA)

| Dato que llega | Endpoint PNDA | Umbral | Puntos |
|---|---|---|---|
| Conflictos sociales activos en la región | `/api/3/action/datastore_search` | 1 | +30 |
| Conflictos sociales activos en la región | `/api/3/action/datastore_search` | 2 o más | +60 |

> La API PNDA no requiere autenticación. Se filtra por región de la empresa.

---

## Fuentes de datos

| Fuente | Qué aporta | Estado |
|---|---|---|
| **latinfo.dev** | SUNAT + OSCE + OEFA + licitaciones en una sola llamada | Funciona · token gratuito (1 000 créditos/mes) |
| **datosabiertos.gob.pe** (PNDA) | Conflictos sociales, datasets salud y sociales por zona | Funciona · sin autenticación |
| **INFOBRAS — Contraloría** | Obras públicas, avance físico/financiero por región | Funciona · datos abiertos descargables |
| **OEFA** | Calidad del aire 2018–2024 | Funciona · API key gratuita |
| **MINEM** | Accidentes y enfermedades ocupacionales | SSL expirado — carga manual de CSV a Supabase |

### Endpoints de latinfo.dev que se usan

```
GET /pe/sunat/padron/search?q=      → búsqueda por nombre (18M+ registros)
GET /pe/ruc/{ruc}                   → empresa completa: SUNAT + OSCE + OEFA + licitaciones
GET /pe/sunat/coactiva/ruc/{ruc}    → deudas coactivas
GET /pe/osce/sanctioned/ruc/{ruc}   → impedidas de contratar con el Estado (~9 200)
GET /pe/osce/fines/ruc/{ruc}        → multas en contrataciones (~4 500)
GET /pe/osce/penalidades/ruc/{ruc}  → penalidades (~12 800)
GET /pe/oefa/sanctions/ruc/{ruc}    → sanciones ambientales (14 000+)
GET /pe/licitaciones                → 900 000+ contratos públicos
```

> Token gratuito en `api.latinfo.dev/auth/github` (sin tarjeta, 1 000 créditos/mes).

---

## API del sistema

La documentación completa está en [`docs/api-contract.md`](docs/api-contract.md). Resumen:

### `GET /api/companies?search={name}`

Busca empresas por nombre o RUC (mínimo 3 caracteres). Error 400 si `search` viene vacío o tiene menos de 3 caracteres.

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

Ficha de riesgo completa de una empresa.

```json
{
  "ruc": "20100047218",
  "razonSocial": "MINERA LOS QUENUALES S.A.",
  "summary": { "riskLevel": "ALTO", "riskScore": 70 },
  "safety":      { "fatalAccidents": 3, "occupationalDiseases": 12 },
  "environmental": { "sanctionsCount": 2, "sanctions": [], "airQuality": [] },
  "legal":       { "osceSanctions": [], "osceFines": [], "tenders": [] },
  "social":      { "activeConflicts": 1, "conflicts": [] },
  "investment":  { "publicProjects": [], "totalBudget": 5000000 }
}
```

### `GET /api/regions/[region]`

Resumen territorial por región (para el mapa).

```json
{
  "region": "La Libertad",
  "companies": [],
  "conflicts": [],
  "projects": []
}
```

---

## Arquitectura

Clean Architecture de 3 capas dentro de `codigo/`:

```
domain/          → lógica de negocio pura (TypeScript puro — sin Next.js ni Supabase)
  entities/      → Empresa · Sancion · DeudaFiscal · Accidente · Contrato · FichaEmpresa
  repositories/  → interfaces abstractas (IEmpresaRepository, ISancionRepository, etc.)
  use-cases/     → BuscarEmpresa · ObtenerFichaEmpresa

infrastructure/  → implementaciones concretas: adapters a latinfo.dev y cliente Supabase

app/api/         → route handlers HTTP (interface)
app/             → frontend Next.js (consume la API por HTTP, nunca directo a Supabase)
```

**Regla de dependencias:** `domain/` no importa nada de Next.js ni Supabase.

### Patrón Adapter + Cache + Fallback

Cada adapter de fuente externa:
1. Intenta consultar la API externa.
2. Si falla, lee de la tabla `latinfo_cache` en Supabase.
3. Si tiene éxito, actualiza la cache.

Esto garantiza que la demo funcione aunque una fuente esté caída.

---

## Instalación local

### Requisitos

- Node.js 20+
- Proyecto en [Supabase](https://supabase.com)
- Token de [latinfo.dev](https://api.latinfo.dev/auth/github) (gratis)

### Pasos

```bash
cd codigo
npm install
```

Crea `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
SUPABASE_SECRET_KEY=...
LATINFO_API_KEY=lat_...
```

```bash
npm run dev   # → http://localhost:3000
npm test      # ejecuta los tests con Jest
```

---

## Estructura del repositorio

```
hackathon-tsc-flovemi/
├── AGENTS.md                    # Reglas para IAs/agentes — fuente de verdad del proyecto
├── codigo/                      # Todo el código (Next.js 16 + TypeScript + Supabase)
└── docs/
    ├── api-contract.md          # Contrato de API completo (fuente de verdad)
    ├── arquitectura.md          # Diagramas Mermaid de capas y flujo de datos
    ├── minerawatch-plan.md      # Plan completo del producto
    └── adr/
        └── 001-clean-architecture-serverless.md
```

---

## Para quién es

| Usuario | Qué busca |
|---|---|
| Comunidad / ciudadano | Saber si la minera de su zona tiene historial de daño |
| Periodista / ONG | Investigar minería informal o impacto social |
| Fiscalizador | Resumen rápido de una empresa antes de una inspección |

---

**Hackathon Torneo de Vibecoding PUCP · 26 de junio de 2026**

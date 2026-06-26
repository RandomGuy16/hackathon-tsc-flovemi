# Arquitectura del sistema — MineraWatch

## Capas del sistema

```mermaid
flowchart TD
    subgraph Frontend["Frontend — Next.js App Router"]
        P1[Buscador de empresas]
        P2[Ficha de empresa]
        P3[Mapa por región]
    end

    subgraph Interface["Interface — app/api"]
        A1["GET /api/companies?search="]
        A2["GET /api/companies/:ruc/dashboard"]
        A3["GET /api/regions/:region"]
    end

    subgraph Domain["Domain — TypeScript puro"]
        UC1[BuscarEmpresa]
        UC2[ObtenerFichaEmpresa]
        SC[CalcularScoreRiesgo]
        EN["Entidades: Empresa · Sancion · DeudaFiscal\nAccidente · Contrato · FichaEmpresa"]
    end

    subgraph Infra["Infrastructure — Adapters + Supabase"]
        AD1[LatinfoAdapter]
        AD2[PNDAAdapter]
        AD3[MinemAdapter]
        CACHE[(latinfo_cache\nSupabase)]
    end

    subgraph Externas["Fuentes externas"]
        LAT[latinfo.dev]
        PNDA[datosabiertos.gob.pe]
        SUP[(Supabase\naccidentes MINEM)]
    end

    P1 -->|fetch| A1
    P2 -->|fetch| A2
    P3 -->|fetch| A3
    A1 --> UC1
    A2 --> UC2
    UC2 --> SC
    UC1 --> AD1
    UC2 --> AD1 & AD2 & AD3
    AD1 <-->|API + cache| LAT
    AD1 -->|fallback| CACHE
    AD2 -->|API| PNDA
    AD3 -->|query| SUP
```

---

## Regla de dependencias

```
domain/         → NO importa nada de Next.js ni Supabase. TypeScript puro.
infrastructure/ → Implementa interfaces del domain. Puede importar Supabase y SDKs externos.
app/api/        → Llama casos de uso del domain. Nunca toca Supabase directo.
app/ (frontend) → Solo consume la API HTTP. Nunca llama al domain ni a Supabase.
```

---

## Flujo de datos — UC-02 Ver ficha de empresa

```mermaid
sequenceDiagram
    actor Usuario
    participant Frontend
    participant API as app/api/companies/:ruc/dashboard
    participant UC as ObtenerFichaEmpresa
    participant Score as CalcularScoreRiesgo
    participant Latinfo as latinfo.dev
    participant PNDA as datosabiertos.gob.pe
    participant Supabase

    Usuario->>Frontend: clic en empresa
    Frontend->>API: GET /api/companies/20100047218/dashboard
    API->>UC: ejecutar("20100047218")

    par consultas en paralelo
        UC->>Latinfo: /pe/ruc/20100047218
        UC->>PNDA: conflictos por región
        UC->>Supabase: accidentes WHERE ruc = ...
    end

    Latinfo-->>UC: empresa + sanciones + deudas + contratos
    PNDA-->>UC: conflictos sociales activos
    Supabase-->>UC: accidentes[]

    UC->>Score: calcular(fichaEmpresa, conflictos)
    Score-->>UC: ScoreRiesgo { total, nivel, dimensiones }

    UC-->>API: FichaEmpresa + score
    API-->>Frontend: JSON
    Frontend-->>Usuario: ficha con 5 secciones + score 0–100
```

---

## Patrón Adapter + Cache + Fallback

Cada adapter de fuente externa sigue este flujo para que la demo funcione aunque la API esté caída:

```mermaid
flowchart TD
    A[Route handler llama adapter] --> B{¿API externa disponible?}
    B -->|Sí| C[Llama API externa]
    C --> D[Guarda respuesta en latinfo_cache]
    D --> E[Retorna datos frescos]
    B -->|No| F[Lee de latinfo_cache en Supabase]
    F --> G[Retorna datos cacheados]
```

---

## Estructura de carpetas

```
codigo/
├── app/
│   ├── api/
│   │   ├── companies/
│   │   │   ├── route.ts              ← GET /api/companies?search=
│   │   │   └── [ruc]/
│   │   │       └── dashboard/
│   │   │           └── route.ts      ← GET /api/companies/:ruc/dashboard
│   │   └── regions/
│   │       └── [region]/
│   │           └── route.ts          ← GET /api/regions/:region
│   └── (páginas y componentes)
├── domain/
│   ├── entities/
│   │   ├── empresa.ts
│   │   ├── sancion.ts
│   │   ├── deuda-fiscal.ts
│   │   ├── accidente.ts
│   │   ├── contrato.ts
│   │   └── ficha-empresa.ts
│   ├── repositories/
│   │   ├── IEmpresaRepository.ts
│   │   ├── ISancionRepository.ts
│   │   ├── IDeudaRepository.ts
│   │   ├── IAccidenteRepository.ts
│   │   └── IContratoRepository.ts
│   └── use-cases/
│       ├── BuscarEmpresa.ts
│       ├── ObtenerFichaEmpresa.ts
│       └── CalcularScoreRiesgo.ts
└── infrastructure/
    ├── repositories/
    │   ├── LatinfoEmpresaRepository.ts
    │   ├── LatinfoSancionRepository.ts
    │   ├── LatinfoDeudaRepository.ts
    │   ├── LatinfoContratoRepository.ts
    │   └── SupabaseAccidenteRepository.ts
    └── database/
        └── supabase-client.ts
```

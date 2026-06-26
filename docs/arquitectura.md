# Arquitectura del sistema — MineraWatch

## Diagrama de arquitectura

```mermaid
graph TD
    subgraph Usuarios
        U1[Ciudadano / Comunidad]
        U2[Periodista / ONG]
        U3[Fiscalizador]
    end

    subgraph Frontend - Next.js App Router
        P1[Página: Búsqueda de empresa]
        P2[Página: Ficha de empresa]
    end

    subgraph Interface - app/api
        A1[GET /api/empresa/buscar]
        A2[GET /api/empresa/:ruc]
    end

    subgraph Domain
        UC1[BuscarEmpresa]
        UC2[ObtenerFichaEmpresa]
     EN[Entidades: Empresa, Sancion, DeudaFiscal, Accidente, Contrato, FichaEmpresa, MiningProject, IllegalMiningRecord]
     RI[Repositorios abstractos: IEmpresaRepository, ISancionRepository, IDeudaRepository, IAccidenteRepository, IContratoRepository, MiningProjectRepository, IllegalMiningRepository]
    end

    subgraph Infrastructure
         IR1[EmpresaRepository]
         IR2[SancionRepository]
         IR3[DeudaRepository]
         IR4[ContratoRepository]
         IR5[AccidenteRepository]
         IR6[MiningProjectRepository]
         IR7[IllegalMiningRepository]
    end

    subgraph Fuentes externas
        LAT[latinfo.dev — SUNAT + OSCE + OEFA + SEACE]
        SUP[Supabase — accidentes MINEM pre-cargados]
    end

    U1 & U2 & U3 -->|HTTP| P1 & P2
    P1 -->|fetch /api/empresa/buscar| A1
    P2 -->|fetch /api/empresa/:ruc| A2
    A1 --> UC1
    A2 --> UC2
    UC1 & UC2 --> EN & RI
    UC1 --> IR1
    UC2 --> IR1 & IR2 & IR3 & IR4 & IR5
    IR1 & IR2 & IR3 & IR4 -->|REST| LAT
    IR5 -->|query| SUP
```

## Capas

| Capa | Carpeta | Responsabilidad |
|---|---|---|
| Domain | `domain/` | Entidades, casos de uso, repositorios abstractos. TypeScript puro — sin Next.js ni Supabase |
| Infrastructure | `infrastructure/` | Implementaciones concretas: latinfo.dev client, Supabase client |
| Interface | `app/api/` | Route handlers HTTP que orquestan los casos de uso |
| Frontend | `app/` (fuera de api/) | Páginas y componentes React. Solo consume la API por HTTP |

## Flujo de datos — UC-03 ObtenerFichaEmpresa

```mermaid
sequenceDiagram
    actor Usuario
    participant Frontend
    participant API as app/api/empresa/:ruc
    participant UC as ObtenerFichaEmpresa
    participant Latinfo as latinfo.dev
    participant Supabase

    Usuario->>Frontend: clic en empresa
    Frontend->>API: GET /api/empresa/20332666516
    API->>UC: ejecutar("20332666516")
    par consultas en paralelo
        UC->>Latinfo: /pe/ruc/20332666516
        UC->>Supabase: SELECT accidentes WHERE ruc = ...
    end
    Latinfo-->>UC: empresa + sanciones + deudas + contratos
    Supabase-->>UC: accidentes[]
    UC-->>API: FichaEmpresa
    API-->>Frontend: JSON
    Frontend-->>Usuario: Ficha con 4 secciones
```

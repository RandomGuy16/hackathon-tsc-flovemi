# ADR 002: Extensión del modelo de dominio para proyectos mineros y minería ilegal

- **Estado:** Aceptado
- **Fecha:** 2026-06-26
- **Contexto:** Sprint 0 — Torneo de Vibecoding PUCP

## Contexto

Durante el diseño del frontend se identificó que los usuarios de MineraWatch necesitan visibilidad no solo del historial sancionador y de conflictos de una empresa minera, sino también de:

1. **Proyectos mineros** vinculados a una empresa o zona: estado (de acuerdo, paralizado, en trámite, cerrado), proceso, tipo de mineral, ubicación y tiempo estimado de cierre.
2. **Minería ilegal** detectada en una zona: motivo de ilegalidad y estado de regularización.

Estos datos no estaban en el modelo de dominio ni en el contrato de API del Sprint 0.

## Decisión

Extendemos el modelo de dominio y el contrato de API con dos nuevas entidades:

- `MiningProject` — representa un proyecto minero con su estado, proceso, mineral y ubicación.
- `IllegalMiningRecord` — representa un hallazgo de minería ilegal con su motivo y estado de regularización.

### Cambios en el dominio

```
codigo/domain/entities/
├── MiningProject.ts
└── IllegalMiningRecord.ts

codigo/domain/repositories/
├── MiningProjectRepository.ts
└── IllegalMiningRepository.ts
```

Los casos de uso `GetCompanyDashboard` y `GetRegionSummary` ahora devuelven listas de estas entidades:

- `CompanyDashboard.miningProjects`
- `CompanyDashboard.illegalMining`
- `RegionSummary.miningProjects`
- `RegionSummary.illegalMining`

### Cambios en el contrato de API

- `GET /api/companies/[ruc]/dashboard` incluye `miningProjects` e `illegalMining`.
- `GET /api/regions/[region]` incluye `miningProjects` e `illegalMining`.

### Fuente de datos provisional

Dado el tiempo del hackathon, los datos de proyectos mineros y minería ilegal se cargarán inicialmente mediante seed con datos de ejemplo documentados, mientras se consolida la integración con PNDA u otras fuentes oficiales.

## Consecuencias

### Positivas

- El frontend puede mostrar las dos secciones solicitadas por los usuarios sin asumir un contrato distinto al del dominio.
- Las entidades son independientes del resto: si una fuente falla, las demás secciones siguen funcionando.
- Se mantiene la regla de dependencias: `domain/` sigue siendo TypeScript puro sin Next.js ni Supabase.

### Negativas / Riesgos

- Aumenta la superficie del dominio y del contrato de API en el Sprint 0.
- Persona C debe crear dos tablas adicionales en Supabase y preparar seed de ejemplo.
- Si las fuentes oficiales de proyectos mineros / ilegalidad no están disponibles, los datos iniciales serán solo de demostración.

## Alternativas consideradas

| Alternativa | Por qué no se eligió |
| --- | --- |
| No incluir estos datos en el MVP | Descartado porque el equipo priorizó visibilidad de proyectos de acuerdo/paralizados y minería ilegal como diferenciador del panel. |
| Modelar proyectos e ilegalidad como metadatos dentro de `Company` | Descartado porque un mismo proyecto o hallazgo ilegal puede estar vinculado a una zona sin tener una empresa asignada clara. |
| Usar el modelo en español (`FichaEmpresa`) | Descartado porque el contrato de API del Sprint 0 y los tipos del caso de uso `GetCompanyDashboard` ya usan el modelo en inglés. |

## Notas

- El score de riesgo minero no se modifica con esta decisión; sigue calculándose con seguridad (40%), legalidad (35%) e impacto social (25%).
- Los campos `companyRuc` en `MiningProject` e `IllegalMiningRecord` son opcionales (`string | null`) para permitir registros regionales no vinculados a una empresa específica.

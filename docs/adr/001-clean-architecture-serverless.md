# ADR 001: Clean Architecture pragmática de 3 capas + Serverless con Next.js, Vercel y Supabase

- **Estado:** Aceptado
- **Fecha:** 2026-06-26
- **Contexto:** Sprint 0 — Torneo de Vibecoding PUCP

## Contexto

MineraWatch necesita un backend que:
- Sirva datos de múltiples fuentes (latinfo.dev, MINEM, PCM/PNDA, OEFA, INFOBRAS).
- Permita cambiar fuentes de datos sin reescribir la lógica de negocio.
- Sea desplegable rápidamente en un hackathon de 11 horas.
- Sea explicable ante un jurado técnico.

## Decisión

Adoptamos una **Clean Architecture pragmática de 3 capas** sobre **Next.js API Routes** desplegados en **Vercel**, con **Supabase (PostgreSQL + Auth)** como base de datos.

### Las 3 capas

```
domain/         → entidades + casos de uso. Lógica de negocio pura.
infrastructure/ → cliente de Supabase, repositorios concretos, adapters.
interface/      → app/api/ — route handlers que llaman casos de uso.
```

### Patrón Adapter + Cache + Fallback

Cada adapter de fuente externa:
1. Intenta consultar la API externa.
2. Si falla, lee de la tabla `latinfo_cache` en Supabase.
3. Si tiene éxito, actualiza la cache.

Esto garantiza que la demo funcione aunque las fuentes externas estén caídas.

## Consecuencias

### Positivas

- El dominio no depende de Next.js ni de Supabase. Podemos cambiar de proveedor de DB o de framework sin tocar la lógica de negocio.
- Los casos de uso son testeables con mocks simples.
- El frontend consume solo el contrato HTTP; no conoce detalles de infraestructura.
- El deploy es serverless y escalable sin configuración extra.

### Negativas / Riesgos

- No es Clean Architecture canónica (faltan capas intermedias como interface adapters). Esto es aceptado a propósito para reducir boilerplate en 11 horas.
- Los Next.js API Routes acoplan ligeramente la capa de presentación HTTP con la infraestructura serverless. Es un tradeoff consciente por velocidad.
- Si la lógica de negocio crece mucho, podría necesitarse refactorizar hacia más capas después del evento.

## Alternativas consideradas

| Alternativa | Por qué no se eligió |
| --- | --- |
| Clean Architecture canónica de 6 capas | Demasiado boilerplate para 11 horas; riesgo de sobreingeniería. |
| Supabase Edge Functions | Menos familiar para el equipo y más acoplamiento a Supabase. |
| Express en un servidor separado | Añade complejidad de deploy fuera de Vercel. |

## Notas

- Esta decisión es pragmática, no dogmática. Si durante el evento una capa extra simplifica algo, se discute con los 3 integrantes antes de cambiarla.
- Cualquier atajo que rompa la regla de dependencias debe etiquetarse con `// TECH-DEBT: ...`.

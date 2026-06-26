# MineraWatch

Panel ciudadano que permite buscar cualquier empresa minera del Perú y ver su historial de sanciones, accidentes, deudas y conflictos sociales cruzando fuentes oficiales del Estado en una sola ficha de riesgo con score 0–100.
Dirigido a comunidades afectadas, periodistas/ONGs y fiscalizadores que necesitan información veraz y accesible sobre el impacto minero en su zona.

---

## Problemática

El 47% de los proyectos mineros en Perú tienen conflictos sociales activos. Las comunidades no tienen acceso fácil a información integrada sobre si una empresa fue sancionada ambientalmente, cuántos accidentes mortales tuvo, si tiene deudas con el Estado o qué contratos públicos maneja.

## Usuarios objetivo

| Usuario | Necesidad |
|---|---|
| Ciudadano / Comunidad | Saber si la minera de su zona tiene historial de daño |
| Periodista / ONG | Investigar minería informal e impacto social |
| Fiscalizador | Resumen rápido de una empresa antes de una inspección |

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

---

## Herramientas de IA utilizadas

| Herramienta | Uso en el proyecto |
|---|---|
| Claude Code | Arquitectura, implementación y documentación |
| Claude (Anthropic) | Consultas de diseño y revisión de decisiones |
| ChatGPT | Apoyo en desarrollo y consultas puntuales |
| Kimi | Consultas y generación de contenido |
| Codex | Generación de código asistida |
| Antigravity / Antigravity CLI / Antigravity IDE | Desarrollo asistido por IA |

---

## Integrantes y roles

| Integrante | Rol |
|---|---|
| [Nombre A] | Dominio + Backend: entidades, casos de uso, API routes |
| [Nombre B] | Frontend: buscador, ficha de empresa, mapa |
| [Nombre C] | Infraestructura, testing, deploy y documentación |

---

## Correr el proyecto localmente

### Requisitos

- Node.js 20+
- Cuenta en [Supabase](https://supabase.com)
- Token gratuito de [latinfo.dev](https://api.latinfo.dev/auth/github)

### Pasos

```bash
cd codigo
npm install
```

Crea el archivo `codigo/.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
SUPABASE_SECRET_KEY=...
LATINFO_API_KEY=lat_...
```

```bash
npm run dev    # → http://localhost:3000
npm test       # ejecutar tests
```

---

## Documentación adicional

| Documento | Descripción |
|---|---|
| [Arquitectura del sistema](docs/arquitectura.md) | Capas, flujo de datos y patrón Adapter + Cache + Fallback |
| [Requerimientos](docs/requerimientos.md) | Casos de uso, requisitos funcionales y no funcionales |
| [Contrato de API](docs/api-contract.md) | Endpoints, payloads de entrada/salida y errores |
| [Plan del producto](docs/minerawatch-plan.md) | Resumen ejecutivo, fuentes de datos y score de riesgo |
| [ADR 001 — Clean Architecture](docs/adr/001-clean-architecture-serverless.md) | Decisión de arquitectura con alternativas consideradas |

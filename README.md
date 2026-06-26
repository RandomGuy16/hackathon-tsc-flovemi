# Torneo de Vibecoding PUCP — Repositorio base

Este es el repositorio base para el hackathon de 11 horas del **Torneo de Vibecoding PUCP**.

## Estructura del repo

```
Repo-Base/
├── AGENTS.md          # Reglas de contexto para cualquier IA/agente
├── README.md          # Este archivo
├── docs/              # Documentación del proyecto
│   ├── adr/           # Architecture Decision Records
│   ├── use-cases/     # Especificaciones de casos de uso
│   ├── decisions/     # Decisiones técnicas y de negocio
│   └── README.md
├── cases/             # Casos de negocio / documentación del reto
│   └── README.md
├── .github/           # Templates de issues/PRs y workflows
│   └── README.md
└── codigo/            # Proyecto Next.js (boilerplate listo)
    └── README.md
```

- **Todo lo que está fuera de `codigo/` es documentación.**
- **Todo el código del proyecto vive dentro de `codigo/`**, siguiendo Clean Architecture pragmática de 3 capas.

## Stack

- **Frontend:** Next.js (App Router), React, Tailwind CSS.
- **Backend:** Next.js API Routes (serverless).
- **Base de datos y auth:** Supabase.
- **Hosting:** Vercel.

## Arquitectura

Dentro de `codigo/`:

```
app/api/         → interface: route handlers HTTP
domain/          → entidades, casos de uso, repositorios abstractos
infrastructure/  → repositorios concretos, clientes Supabase
```

Regla de dependencias:
- `domain/` no importa nada de Next.js ni Supabase.
- `infrastructure/` puede importar de `domain/`.
- `interface/` puede importar de `domain/` e `infrastructure/`.

## Configuración

Vercel y Supabase se configuran el día del evento con los proyectos oficiales del torneo.

Para desarrollo local ver `codigo/README.md`.

## Equipo

- Persona A — Dominio + Backend
- Persona B — Frontend
- Persona C — Infraestructura, testing, deploy y documentación

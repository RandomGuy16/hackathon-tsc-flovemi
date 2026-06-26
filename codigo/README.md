# codigo

Proyecto Next.js para el Torneo de Vibecoding PUCP.

## Arquitectura

Clean Architecture pragmática de 3 capas:

```
app/api/         → interface: route handlers HTTP
domain/          → entidades, casos de uso, repositorios abstractos
infrastructure/  → repositorios concretos, clientes Supabase
```

### Reglas de dependencia

- `domain/` **no importa** nada de Next.js, React ni Supabase.
- `infrastructure/` puede importar de `domain/`.
- `interface/` puede importar de `domain/` e `infrastructure/`.
- El frontend (`app/` fuera de `api/`) consume la API por contrato HTTP.

## Instalación local

```bash
npm install
```

Crea un archivo `.env.local` a partir de `.env.local.example` y completa las variables de Supabase:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SECRET_KEY`

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Tests

```bash
npm test
```

## Deploy

El deploy se realiza en Vercel. Los deploys a producción deben ser aprobados por un humano.

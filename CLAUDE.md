# MineraWatch — Claude Code Guidelines

Guidelines, commands, and rules for working on the MineraWatch workspace.

## Build and Test Commands
All development scripts must be run from the `codigo/` directory.

- **Start Dev Server**: `npm run dev --prefix codigo`
- **Build Project**: `npm run build --prefix codigo`
- **Run Linting**: `npm run lint --prefix codigo`
- **Run Tests**: `npm run test --prefix codigo`
- **Run Watch Tests**: `npm run test:watch --prefix codigo`

## Code Style & Architecture Constraints

### 1. Strict 3-Layer Clean Architecture
Code is organized into three layers in `codigo/`:
- `domain/`: Business logic. **TypeScript only**. No framework imports (`next`, `next/server`), Supabase clients, or external SDKs.
- `infrastructure/`: Concrete repositories, Supabase connection, external API adapters.
- `interface/`: Next.js API Routes (`app/api/*`). Handles HTTP requests/responses and coordinates use cases from `domain/`.
- **Frontend Components & Hooks**: Live in `codigo/app/` (except `api/`). Must not import from `domain/` or `infrastructure/` directly. They consume endpoints via fetch/axios.

### 2. External API Integration (Adapter + Cache + Fallback)
Every external source (`latinfo.dev`, PNDA, OEFA, INFOBRAS) must follow this design:
- Call API via the adapter in `infrastructure/adapters/`.
- If API fails (errors/limits), retrieve cached data from the `latinfo_cache` table in Supabase.
- If API succeeds, save/update cache with fresh JSON and timestamp.

### 3. Guidelines & Process Rules
- **Explain Design**: For non-boilerplate tasks (complex logic, cross-layer changes), draft your implementation plan in chat and wait for approval before generating code.
- **Tech Debt Identification**: For any quick hacks violating layers, mark with `// TECH-DEBT: [reason]`.
- **TypeScript**: Strict TypeScript. Always define complete types and interfaces.
- **Q&A Inverse Rule**: Before suggesting/generating a commit, ensure you can explain the code line-by-line if requested.
- **Git Flow**: Branches should follow `feature/*`, `fix/*`, `docs/*`, `test/*`, `refactor/*`. Commits should be atomic and descriptive.
- **Deploys**: Never execute deploy commands autonomously. The human operator controls production builds and deployments.

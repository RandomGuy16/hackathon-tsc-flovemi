# Implementation Plan: MineraWatch MVP

The project must be completed within an 11-hour hackathon timeframe.

## Timeline Overview
- **Total Time**: 11 Hours
- **Feature Freeze**: 16:45
- **Final Release Tag & Submission**: 18:00

---

## 1. Phase Plan

### 🚀 Sprint 0: Foundation & Setup
* **Goals**: Architecture boundaries, database schema setup, mock contracts, API contracts.
* **Deliverables**:
  - Verification of TS config, ESLint, and Jest.
  - Final database tables definition inside Supabase.
  - AI Configuration (.cursorrules, CLAUDE.md, .clinerules, skills).
  - Mock API responses based on `docs/minerawatch-plan.md` endpoints.

### ⚙️ Sprint 1: Backend Layer & Data Adapters
* **Goals**: Data collection, seed scripts, adapters implementation, and domain use cases.
* **Deliverables**:
  - **Database Migration**: Run SQL commands in Supabase.
  - **Seed Script**: local script to parse downloaded CSVs (MINEM safety, PNDA conflicts, INFOBRAS projects) and populate the database.
  - **API Adapters (`infrastructure/adapters/`)**:
    - `LatinfoAdapter` (calls `/pe/ruc/{ruc}` with Cache + Fallback).
    - `LatinfoTendersAdapter` (calls `/pe/licitaciones` with Cache + Fallback).
    - Adapters/readers for PNDA (conflicts), INFOBRAS (projects), OEFA (air quality), MINEM (safety).
  - **Domain Use Cases (`domain/usecases/`)**:
    - `SearchCompanies.ts`
    - `GetCompanyDashboard.ts`
    - `GetRegionSummary.ts`
  - **API Routes (`interface/`)**: `/api/companies`, `/api/companies/[ruc]/dashboard`, `/api/regions/[region]`.
  - **Testing**: Happy/error path Jest tests for the adapters and use cases.

### 🎨 Sprint 2: Frontend & Maps
* **Goals**: Citizen dashboard UI, interactive maps, search interaction.
* **Deliverables**:
  - **Search & Discovery Page**: Company directory, RUC search bar, regional filter.
  - **Company Ficha Dashboard**: Renders the 5 axes (Safety, Environment, Legal, Social, Investment), details on infractions/accidents, and the **Mining Risk Score Component**.
  - **Geographic Map Component**: Integrated with Leaflet, highlighting:
    - Company operational headquarters (markers).
    - Regional hazard coloring based on active conflicts or air quality metrics.
  - **Responsive adjustments**: Ensure mobile optimization for community users.

### 🥶 Sprint 3: Freeze, Polishing & Demo Prep
* **Target Time**: 15:30 - 16:45
* **Goals**: Clean architecture compliance, bug squash, feature freeze.
* **Deliverables**:
  - Complete code freeze at 16:45.
  - Run `npm run lint` and `npm run build` to guarantee compilation.
  - Fix any lingering TypeScript errors or warnings.
  - Scan `codigo/domain/` to verify no illegal imports (`next`, `supabase`, or framework libraries) leaked in. If any leak is found, refactor it immediately.
  - Record demo video or prepare slides for the pitch.

### 📦 Release & Submission
* **Target Time**: 16:45 - 18:00
* **Goals**: Final check, tag release, deploy verification.
* **Deliverables**:
  - Trigger final manual check on Vercel preview deployment.
  - Create Git tag: `Entrega final - MineraWatch`.
  - Push codebase and draft the final README/ADR documentation.

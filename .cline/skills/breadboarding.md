# UI Breadboarding & Styling Guidelines

Before building CSS or JSX elements, use this guide to draft raw layout flows and map out the interface aesthetics.

## 1. Core Visual Aesthetics (Premium Rules)
MineraWatch must look clean, modern, and highly interactive.
* **Palette**: Curated dark-theme. Use deep slate-grays (`#0f172a`), emerald-greens (`#10b981`), amber-yellows (`#f59e0b`), and intense reds (`#ef4444`). Avoid basic saturated primaries.
* **Glassmorphism**: Utilize backdrop blurs (`backdrop-filter: blur(12px)`) and semi-transparent borders for cards.
* **Typography**: Clean sans-serif (Inter, Outfit) via Google Fonts. Custom bold weight for indicators.
* **Micro-animations**: Subtle scale-up on card hover, transition properties on buttons, and rotating sync symbols for refresh states.

---

## 2. Low-Fidelity UI Layouts

### Page A: Search and Discovery Home
```
+-------------------------------------------------------------------------+
|  [Logo] MineraWatch                             [Region Map Filter v]   |
+-------------------------------------------------------------------------+
|                                                                         |
|                 VIGILANCIA MINERA CIUDADANA EN EL PERÚ                   |
|       Busque el historial social, ambiental y financiero de una empresa |
|                                                                         |
|                +-----------------------------------------+              |
|                |  Buscar por RUC o Razón Social...   [Q] |              |
|                +-----------------------------------------+              |
|                                                                         |
|           Regiones populares: [ La Libertad ] [ Ancash ] [ Arequipa ]    |
|                                                                         |
|  +-------------------------------------------------------------------+  |
|  | Resultados de Búsqueda (Cards Grid)                               |  |
|  |                                                                   |  |
|  |  +---------------------------+     +---------------------------+  |  |
|  |  | Los Quenuales S.A.        |     | Barrick Misquichilca      |  |  |
|  |  | RUC: 20100047218          |     | RUC: 20340596821          |  |  |
|  |  | Región: La Libertad       |     | Región: Ancash            |  |  |
|  |  | Score: 70 [ALTO 🔴]       |     | Score: 20 [BAJO 🟢]       |  |  |
|  |  +---------------------------+     +---------------------------+  |  |
|  +-------------------------------------------------------------------+  |
+-------------------------------------------------------------------------+
```

### Page B: Company Risk Dashboard (The Ficha)
```
+-------------------------------------------------------------------------+
|  <- Volver al Buscador                                                  |
|                                                                         |
|  MINERA LOS QUENUALES S.A.                                              |
|  RUC: 20100047218 | Sede Principal: La Libertad                         |
|                                                                         |
|  +---------------------------------+  +-------------------------------+ |
|  | SCORE DE RIESGO MINERO          |  | MAPA DE OPERACIÓN             | |
|  |                                 |  |                               | |
|  |             ( 70 )              |  |         [ Leaflet Map ]       | |
|  |           ALTO RIESGO           |  |                               | |
|  |                                 |  |     (X) Mina Quiruvilca       | |
|  |  [🟢 Legal] [🔴 Seguridad]      |  |                               | |
|  +---------------------------------+  +-------------------------------+ |
|                                                                         |
|  EJES DE FISCALIZACIÓN:                                                 |
|                                                                         |
|  +------------------+  +------------------+  +------------------+       |
|  | 🔴 SEGURIDAD     |  | 🟡 MEDIO AMB.    |  | 🔴 LEGAL         |       |
|  | - 3 Accidentes   |  | - 2 Sanciones    |  | - 1 Sanción OSCE |       |
|  |   mortales       |  | - Aire: PM10     |  | - 0 Multas       |       |
|  | - 12 Enfermedades|  |   Excede         |  | - 3 Licitaciones |       |
|  +------------------+  +------------------+  +------------------+       |
|  +------------------+  +------------------+                             |
|  | 🟠 SOCIAL        |  | 🟢 INVERSIÓN     |                             |
|  | - 1 Conflicto    |  | - S/. 3.5M Obra  |                             |
|  |   activo         |  | - Avance: 5.4%   |                             |
|  | - Quiruvilca     |  |   (RETRASADO)    |                             |
|  +------------------+  +------------------+                             |
+-------------------------------------------------------------------------+
```

## 3. UI Component Implementation Guidelines
* **Interactive Ejes**: Clicking a card opens a modal overlay or smooth slide-down detail section revealing actual resolution IDs, source links to MINEM/OEFA PDFs, and audit trail metadata.
* **Map Overlay**: Provide layer controls for the Leaflet map (e.g., toggle "Conflict Zones" or "Company Sites").
* **Aesthetics check**: Verify borders, padding, contrast (`AA`/`AAA` compliance), and spacing scales. Do not code components without testing responsive breakdowns (`sm:`, `md:`, `lg:` in tailwind or CSS media queries).

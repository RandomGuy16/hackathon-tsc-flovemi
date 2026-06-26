# Project Goal: MineraWatch MVP

This document summarizes the core business, user goals, and target objectives for the MineraWatch platform.

## 1. The Problem
In Peru, **47% of active mining projects are involved in social conflicts**. Affected communities, investigative journalists, NGOs, and local government auditors lack a consolidated, understandable, and trusted source of information. 
Existing raw data tools (like `latinfo.dev` or government open data sites) are:
- Too legal/technical for general citizens.
- Scattered across multiple ministries and formats (PDF, Excel, CSV).
- Lacking geographic context and clear syntheses of risk.

## 2. Project Proposal
**MineraWatch** is a citizen mining surveillance dashboard. It consolidates multiple raw data sources into a citizen-friendly dashboard showing a **5-axis Risk Report** and a synthesized **Mining Risk Score**:

1. 🔴 **SAFETY (Seguridad)**: Fatal accidents & occupational diseases (Source: MINEM).
2. 🟡 **ENVIRONMENT (Medio Ambiente)**: Environmental sanctions & air quality (Sources: OEFA, latinfo.dev).
3. 🔴 **LEGAL (Legal)**: OSCE sanctions, fines, & state tenders (Source: latinfo.dev).
4. 🟠 **SOCIAL CONFLICTS (Conflictos Sociales)**: Active conflicts by region/district (Source: PCM / PNDA).
5. 🟢 **PUBLIC INVESTMENT (Inversión Pública)**: Local infrastructure projects & budget execution (Source: INFOBRAS / MEF).

## 3. Targeted Users
- **Affected Communities & Citizens**: Want to know the immediate environmental, social, and safety history of mining operations near their homes.
- **Journalists & NGOs**: Investigate corporate compliance, state spending, and environmental infractions.
- **Auditors & Officials**: Require rapid summaries of mining operators' track records.

## 4. MVP Target Features (Scope for the Hackathon)
1. **Search & Discovery**: Find companies by RUC or company name (Razón Social).
2. **Company Risk Dashboard**: Render the 5 axes of risk with clear indicators, source attributions, and the calculated Mining Risk Score (Low 🟢, Medium 🟡, High 🔴).
3. **Interactive Maps (Leaflet)**: Visualize regional risk levels, active conflicts, and company coordinates.
4. **Resilient Adapters**: Implement local caching on Supabase (`latinfo_cache` table) to maintain dashboard functionality even if external APIs fail.

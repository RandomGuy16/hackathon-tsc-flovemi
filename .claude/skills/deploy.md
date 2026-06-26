# Deployment & Database Setup Guidelines

This document details the exact sequence for configuring databases and deploying the application.

## 1. Supabase Database Checks

### A. SQL Schema execution
Ensure all tables, foreign keys, and indexes from `docs/minerawatch-plan.md` or `design.md` are executed in the Supabase SQL Editor.

### B. Row Level Security (RLS) & Policies
Since MineraWatch is a citizen transparency platform, all tables must allow public reading, but strictly restrict write/delete access:
1. Enable RLS on all tables:
   ```sql
   ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
   ALTER TABLE safety_records ENABLE ROW LEVEL SECURITY;
   ALTER TABLE social_conflicts ENABLE ROW LEVEL SECURITY;
   ALTER TABLE public_projects ENABLE ROW LEVEL SECURITY;
   ALTER TABLE air_quality ENABLE ROW LEVEL SECURITY;
   ```
2. Create standard Read Policies:
   ```sql
   CREATE POLICY "Allow public read access" ON companies
     FOR SELECT USING (true);
   -- Repeat for all tables
   ```
3. Restrict Write/Updates: Only allow database seed scripts (using the `service_role` key) to write data.

### C. Seed Execution
Before deployment, run the seed script to populate the database tables with standard geographical data (conflict areas, regional projects, MINEM statistics):
```bash
# From the root or codigo directory:
npm run seed --prefix codigo
```

---

## 2. Vercel Deployment

### A. Required Environment Variables
Configure the following keys in the Vercel project panel:
* `NEXT_PUBLIC_SUPABASE_URL`: The endpoint of the Supabase project.
* `NEXT_PUBLIC_SUPABASE_ANON_KEY`: The public anonymous database token.
* `SUPABASE_SERVICE_ROLE_KEY`: Service token used by the backend seed/adapter scripts (keep secret!).
* `LATINFO_API_KEY`: API key for accessing SUNAT/OSCE data on `latinfo.dev`.

### B. Deploy Workflow
1. **Compilation Validation**: Ensure the project compiles clean locally with zero warnings:
   ```bash
   npm run build --prefix codigo
   ```
2. **Preview Deploy**: Triggered automatically on pulling/pushing to pull requests.
3. **Production Deploy**: Triggered manually by a developer.
   ```bash
   vercel --prod
   ```
   *Note: AI agents are strictly forbidden from executing `--prod` deployments autonomously.*
4. **Post-deploy validation**: Run a quick validation request against the health endpoint (e.g., `/api/companies`) to confirm the database connectivity is active.

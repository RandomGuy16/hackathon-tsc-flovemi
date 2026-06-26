-- MineraWatch — Esquema inicial de Supabase (Sprint 0)
-- Ejecutar en el SQL Editor de Supabase o via psql.

-- Extensiones útiles
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Empresas mineras
CREATE TABLE IF NOT EXISTS companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ruc TEXT UNIQUE NOT NULL,
  razon_social TEXT,
  region TEXT,
  province TEXT,
  district TEXT,
  latitude FLOAT,
  longitude FLOAT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_companies_ruc ON companies(ruc);
CREATE INDEX IF NOT EXISTS idx_companies_region ON companies(region);
CREATE INDEX IF NOT EXISTS idx_companies_search ON companies USING gin(to_tsvector('spanish', coalesce(razon_social, '') || ' ' || coalesce(ruc, '')));

-- Cache de respuestas de latinfo.dev
CREATE TABLE IF NOT EXISTS latinfo_cache (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ruc TEXT REFERENCES companies(ruc) ON DELETE CASCADE,
  payload JSONB NOT NULL,
  fetched_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  source_status TEXT
);

CREATE INDEX IF NOT EXISTS idx_latinfo_cache_ruc ON latinfo_cache(ruc);

-- Registros de seguridad (MINEM)
CREATE TABLE IF NOT EXISTS safety_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_ruc TEXT REFERENCES companies(ruc) ON DELETE CASCADE,
  year INT NOT NULL,
  fatal_accidents INT DEFAULT 0,
  occupational_diseases INT DEFAULT 0,
  source_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_safety_records_company_ruc ON safety_records(company_ruc);
CREATE INDEX IF NOT EXISTS idx_safety_records_year ON safety_records(year);

-- Conflictos sociales (PCM / PNDA)
CREATE TABLE IF NOT EXISTS social_conflicts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  region TEXT NOT NULL,
  province TEXT,
  district TEXT,
  description TEXT,
  status TEXT CHECK (status IN ('activo', 'inactivo', 'resuelto')),
  related_company_ruc TEXT REFERENCES companies(ruc) ON DELETE SET NULL,
  reported_at DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_social_conflicts_region ON social_conflicts(region);
CREATE INDEX IF NOT EXISTS idx_social_conflicts_company_ruc ON social_conflicts(related_company_ruc);
CREATE INDEX IF NOT EXISTS idx_social_conflicts_status ON social_conflicts(status);

-- Obras públicas (INFOBRAS / MEF)
CREATE TABLE IF NOT EXISTS public_projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  region TEXT NOT NULL,
  name TEXT NOT NULL,
  budget NUMERIC DEFAULT 0,
  physical_progress NUMERIC DEFAULT 0 CHECK (physical_progress >= 0 AND physical_progress <= 1),
  executor TEXT,
  latitude FLOAT,
  longitude FLOAT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_public_projects_region ON public_projects(region);

-- Calidad del aire (OEFA)
CREATE TABLE IF NOT EXISTS air_quality (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  region TEXT NOT NULL,
  station_name TEXT,
  year INT NOT NULL,
  parameter TEXT NOT NULL,
  value FLOAT NOT NULL,
  unit TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_air_quality_region ON air_quality(region);
CREATE INDEX IF NOT EXISTS idx_air_quality_year ON air_quality(year);

'use client';

import React from 'react';
import {
  Database,
  Leaf,
  Scale,
  Users,
  Landmark,
  Pickaxe,
  Ban,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';

interface DataSourceBannerProps {
  lastSyncedAt?: string;
}

const FUENTES = [
  { label: 'OSCE', icon: Scale, description: 'Sanciones, impedimentos y licitaciones públicas' },
  { label: 'OEFA', icon: Leaf, description: 'Infracciones y sanciones ambientales firmes' },
  { label: 'MINEM', icon: Pickaxe, description: 'Proyectos mineros y estadísticas de seguridad laboral' },
  { label: 'SUNAT', icon: Database, description: 'Identificación tributaria y razón social' },
  { label: 'Defensoría', icon: Users, description: 'Conflictos sociales y violencia social' },
  { label: 'INFOBRAS / MEF', icon: Landmark, description: 'Proyectos de inversión pública y obras' },
  { label: 'PNIA / Fiscales', icon: Ban, description: 'Catastro de minería ilegal e intervenciones' },
];

export default function DataSourceBanner({ lastSyncedAt }: DataSourceBannerProps) {
  const fecha = lastSyncedAt
    ? new Date(lastSyncedAt).toLocaleDateString('es-PE', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
    : 'sin fecha de sincronización';

  return (
    <div className="animate-fade-in rounded-[2rem] border border-amber-200 bg-gradient-to-br from-amber-50 via-white to-amber-50/50 p-8 shadow-lg shadow-amber-100/50">
      <div className="mb-6 flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-700 text-white shadow-md shadow-amber-200">
          <Database className="h-6 w-6" />
        </div>
        <div>
          <h2 className="font-outfit text-xl font-black text-slate-900">
            Fuentes y metodología de esta ficha
          </h2>
          <p className="mt-1 max-w-3xl text-sm font-medium leading-relaxed text-slate-600">
            La información que aparece a continuación se construye cruzando datos abiertos de
            distintas entidades del Estado peruano. Cada sección indica su fuente primaria y las
            limitaciones conocidas. Antes de publicar o presentar una denuncia formal, verifique el
            dato directamente en la fuente oficial.
          </p>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {FUENTES.map((fuente) => (
          <div
            key={fuente.label}
            className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-all hover:border-amber-200 hover:shadow-md"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-amber-700">
              <fuente.icon className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-slate-900">
                {fuente.label}
              </p>
              <p className="text-[11px] font-medium leading-snug text-slate-500">
                {fuente.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-4 rounded-2xl border border-amber-100 bg-amber-50/70 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />
          <p className="text-xs font-semibold leading-relaxed text-amber-900">
            Los datos pueden tener rezagos de actualización, omisiones o estar sujetos a recursos
            administrativos. Esta plataforma es una herramienta de exploración, no una fuente
            primaria de verdad legal.
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2 self-start rounded-xl bg-white px-4 py-2 shadow-sm sm:self-center">
          <RefreshCw className="h-3.5 w-3.5 text-amber-600" />
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
            Sincronizado: {fecha}
          </span>
        </div>
      </div>
    </div>
  );
}

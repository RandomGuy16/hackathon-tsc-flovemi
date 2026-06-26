import React from 'react';
import { RegionResponse } from '@/lib/types';
import { Building2, AlertCircle, Pickaxe, DollarSign, Ban } from 'lucide-react';

interface RegionSummaryProps {
  data: RegionResponse;
}

const statusLabels: Record<string, string> = {
  de_acuerdo: 'De acuerdo',
  paralizado:  'Paralizado',
  en_tramite:  'En trámite',
  cerrado:     'Cerrado',
};

const statusColors: Record<string, string> = {
  de_acuerdo: 'text-emerald-700 bg-emerald-50 border-emerald-200',
  paralizado:  'text-rose-700 bg-rose-50 border-rose-200',
  en_tramite:  'text-amber-700 bg-amber-50 border-amber-200',
  cerrado:     'text-slate-600 bg-slate-50 border-slate-200',
};

const RegionSummary: React.FC<RegionSummaryProps> = ({ data }) => {
  const totalBudget = data.projects.reduce((acc, p) => acc + p.budget, 0);

  const stats = [
    { label: 'Empresas',   value: data.companies.length,    icon: Building2,    color: 'text-amber-700 bg-amber-50'    },
    { label: 'Conflictos', value: data.conflicts.length,    icon: AlertCircle,  color: 'text-rose-600 bg-rose-50'      },
    { label: 'Proyectos',  value: data.miningProjects.length,icon: Pickaxe,     color: 'text-slate-700 bg-slate-100'   },
    { label: 'Min. ilegal',value: data.illegalMining.length, icon: Ban,         color: 'text-rose-700 bg-rose-50'      },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
            <div className={`inline-flex h-8 w-8 items-center justify-center rounded-lg ${color}`}>
              <Icon className="h-4 w-4" />
            </div>
            <p className="mt-2 font-outfit text-2xl font-black text-slate-900">{value}</p>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
          </div>
        ))}
      </div>

      {/* Inversión — copper accent */}
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
        <div className="flex items-center gap-2 text-amber-700">
          <DollarSign className="h-4 w-4" />
          <span className="text-[10px] font-black uppercase tracking-widest">Inversión pública total</span>
        </div>
        <p className="mt-1 font-outfit text-2xl font-black text-amber-900">
          S/ {totalBudget.toLocaleString('es-PE')}
        </p>
      </div>

      {/* Proyectos por estado */}
      {data.miningProjects.length > 0 && (
        <div>
          <h4 className="mb-3 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
            <Pickaxe className="h-3 w-3" />
            Proyectos por estado
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {(['de_acuerdo', 'paralizado', 'en_tramite', 'cerrado'] as const).map((status) => {
              const count = data.miningProjects.filter((p) => p.status === status).length;
              if (count === 0) return null;
              return (
                <div
                  key={status}
                  className={`flex items-center justify-between rounded-lg border px-3 py-2 text-xs font-bold ${statusColors[status]}`}
                >
                  <span>{statusLabels[status]}</span>
                  <span className="font-black">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Minería ilegal */}
      {data.illegalMining.length > 0 && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4">
          <div className="flex items-center gap-2 text-rose-700">
            <Ban className="h-4 w-4" />
            <p className="text-xs font-black">
              {data.illegalMining.length} foco{data.illegalMining.length !== 1 ? 's' : ''} de minería ilegal detectado{data.illegalMining.length !== 1 ? 's' : ''}
            </p>
          </div>
          <p className="mt-1 text-[10px] leading-tight text-rose-600">
            Requiere intervención en zonas de amortiguamiento.
          </p>
        </div>
      )}
    </div>
  );
};

export default RegionSummary;

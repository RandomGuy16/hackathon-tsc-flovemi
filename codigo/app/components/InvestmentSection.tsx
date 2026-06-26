import React from 'react';
import { UserMode, CompanyDashboardData } from '@/lib/types';
import { TrendingUp, ClipboardCheck, Wallet, Landmark } from 'lucide-react';

interface InvestmentSectionProps {
  data: CompanyDashboardData['investment'];
  mode: UserMode;
}

const InvestmentSection: React.FC<InvestmentSectionProps> = ({ data, mode }) => {
  const totalBudget = data.totalBudget;

  if (mode === 'citizen') {
    return (
      <div className="flex flex-col gap-5 animate-fade-in">
        <div className="flex items-center gap-4 rounded-2xl bg-amber-50 p-5 border border-amber-100">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-700 text-white shadow-sm shadow-amber-200">
            <Landmark className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-amber-700 opacity-80">Obras para ti</p>
            <p className="font-outfit text-2xl font-black text-amber-900 leading-none">
              S/ {(totalBudget / 1000000).toFixed(1)}M
            </p>
          </div>
        </div>

        <p className="text-sm font-medium text-slate-600 leading-relaxed">
          Esta empresa contribuye con{' '}
          <span className="font-bold text-slate-900">S/ {totalBudget.toLocaleString()}</span>{' '}
          para proyectos de infraestructura pública en beneficio de la comunidad.
        </p>

        <div className="space-y-3">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">Avance de Proyectos Principales</p>
          <div className="grid gap-3">
            {data.publicProjects.slice(0, 2).map((p, i) => (
              <div key={i} className="rounded-xl bg-white border border-slate-200 p-4 shadow-sm">
                <div className="flex justify-between items-center mb-2.5">
                  <p className="text-xs font-semibold text-slate-800 truncate">{p.name}</p>
                  <span className="text-[10px] font-bold text-amber-700 flex-shrink-0 ml-2">
                    {Math.round(p.physicalProgress * 100)}%
                  </span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-600 rounded-full transition-all duration-1000"
                    style={{ width: `${p.physicalProgress * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="group relative overflow-hidden rounded-2xl bg-slate-900 p-7 text-white shadow-lg transition-all hover:shadow-xl">
        <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-amber-500/10 blur-2xl transition-colors group-hover:bg-amber-400/20" />
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-amber-400 mb-2">Presupuesto Ejecutado</p>
            <p className="font-outfit text-4xl font-black tracking-tighter">S/ {totalBudget.toLocaleString()}</p>
          </div>
          <Wallet className="h-10 w-10 text-slate-600 opacity-40" />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">Cartera de Obras</p>
          <TrendingUp className="h-4 w-4 text-slate-200" />
        </div>

        {data.publicProjects.length === 0 ? (
          <div className="py-10 text-center rounded-xl border-2 border-dashed border-slate-100">
            <p className="text-xs text-slate-400">Sin obras públicas vinculadas.</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {data.publicProjects.map((p, i) => (
              <div
                key={i}
                className="group relative flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5 transition-all duration-300 hover:border-amber-200 hover:shadow-lg"
              >
                <div className="flex justify-between items-start">
                  <div className="min-w-0 flex-1">
                    <p className="font-outfit text-sm font-bold text-slate-900 leading-snug group-hover:text-amber-900 transition-colors">
                      {p.name}
                    </p>
                    <p className="mt-1 text-[10px] font-medium text-slate-400 uppercase tracking-wider truncate">
                      {p.executor}
                    </p>
                  </div>
                  <span className="font-mono text-sm font-bold text-amber-700 flex-shrink-0 ml-3">
                    S/ {p.budget.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center gap-4 pt-1">
                  <div className="flex-1">
                    <div className="flex justify-between text-[9px] font-semibold uppercase text-slate-400 tracking-wider mb-1.5">
                      <span>Avance Físico</span>
                      <span className="text-amber-700">{Math.round(p.physicalProgress * 100)}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-600 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${p.physicalProgress * 100}%` }}
                      />
                    </div>
                  </div>
                  {mode === 'official' && (
                    <button className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-50 border border-slate-200 text-slate-400 hover:bg-amber-700 hover:text-white hover:border-amber-700 transition-all cursor-pointer">
                      <ClipboardCheck className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default InvestmentSection;

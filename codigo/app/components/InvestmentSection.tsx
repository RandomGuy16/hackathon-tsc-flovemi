import React from 'react';
import { UserMode, CompanyDashboardData } from '@/lib/types';
import { TrendingUp, Building, ClipboardCheck } from 'lucide-react';

interface InvestmentSectionProps {
  data: CompanyDashboardData['investment'];
  mode: UserMode;
}

const InvestmentSection: React.FC<InvestmentSectionProps> = ({ data, mode }) => {
  const totalBudget = data.totalBudget;

  if (mode === 'citizen') {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3 rounded-xl bg-blue-50 p-4 border border-blue-100">
          <TrendingUp className="h-8 w-8 text-blue-600" />
          <div>
            <p className="text-sm font-bold text-blue-900">Inversión para el Pueblo</p>
            <p className="text-xl font-black text-blue-700">S/ {(totalBudget / 1000000).toFixed(1)} Millones</p>
          </div>
        </div>
        <p className="text-sm text-slate-600 leading-relaxed">
          Se han destinado <span className="font-bold">S/ {totalBudget.toLocaleString()}</span> para obras como colegios o pistas gracias a la minería en tu zona.
        </p>
        <div className="space-y-3">
          {data.publicProjects.map((p, i) => (
            <div key={i} className="rounded-lg border border-slate-100 p-3">
              <p className="text-xs font-bold text-slate-800">{p.name}</p>
              <div className="mt-2 h-1.5 w-full bg-slate-100 rounded-full">
                <div 
                  className="h-full bg-blue-500 rounded-full" 
                  style={{ width: `${p.physicalProgress * 100}%` }}
                />
              </div>
              <p className="mt-1 text-[10px] font-bold text-slate-400">Avance: {Math.round(p.physicalProgress * 100)}%</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
           <p className="text-xs font-bold text-slate-400 uppercase">Presupuesto Total</p>
           <p className="text-2xl font-black text-slate-900">S/ {totalBudget.toLocaleString()}</p>
        </div>
        <Building className="h-8 w-8 text-slate-200" />
      </div>

      <div className="space-y-4">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Obras Públicas</p>
        {data.publicProjects.map((p, i) => (
          <div key={i} className="rounded-xl border border-slate-100 p-4 transition-hover hover:shadow-sm">
            <div className="flex justify-between items-start">
              <p className="font-serif text-sm font-bold text-slate-900">{p.name}</p>
              <span className="text-xs font-mono font-bold text-blue-600">S/ {p.budget.toLocaleString()}</span>
            </div>
            
            <div className="mt-3 flex items-center gap-4">
               <div className="flex-1">
                 <div className="flex justify-between text-[10px] font-bold uppercase text-slate-400 mb-1">
                   <span>Avance Físico</span>
                   <span>{Math.round(p.physicalProgress * 100)}%</span>
                 </div>
                 <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 rounded-sm" 
                      style={{ width: `${p.physicalProgress * 100}%` }}
                    />
                 </div>
               </div>
               {mode === 'official' && (
                 <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-50 text-slate-400">
                   <ClipboardCheck className="h-5 w-5" />
                 </div>
               )}
            </div>
            
            <p className="mt-3 text-[10px] font-medium text-slate-500">Ejecutor: {p.executor}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InvestmentSection;

import React from 'react';
import { UserMode, CompanyDashboardData } from '@/lib/types';
import { Pickaxe, Clock, MapPin, Database } from 'lucide-react';
import ProjectStatusChart from './ProjectStatusChart';

interface MiningProjectsSectionProps {
  data: CompanyDashboardData['miningProjects'];
  mode: UserMode;
}

const MiningProjectsSection: React.FC<MiningProjectsSectionProps> = ({ data, mode }) => {
  const statusCounts = data.reduce((acc, p) => {
    const existing = acc.find(a => a.status === p.status);
    if (existing) {
      existing.count++;
    } else {
      acc.push({ status: p.status, count: 1 });
    }
    return acc;
  }, [] as { status: any; count: number }[]);

  if (mode === 'citizen') {
    return (
      <div className="flex flex-col gap-6">
        <ProjectStatusChart data={statusCounts} />
        <div className="space-y-4">
          {data.map((p, i) => (
            <div key={i} className="flex flex-col gap-2 rounded-xl border border-slate-100 p-4">
              <div className="flex justify-between items-center">
                <h4 className="font-serif font-bold text-slate-900">{p.name}</h4>
                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                  p.status === 'de_acuerdo' ? 'bg-emerald-100 text-emerald-700' :
                  p.status === 'paralizado' ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-700'
                }`}>
                  {p.status.replace('_', ' ')}
                </span>
              </div>
              <p className="text-xs text-slate-600">
                Se está buscando <span className="font-bold">{p.mineralType}</span> en {p.location}.
              </p>
              {p.estimatedMonthsRemaining && (
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
                  <Clock className="h-3 w-3" />
                  <span>Quedan aprox. {p.estimatedMonthsRemaining} meses</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-xl border border-slate-100 p-4 bg-slate-50/50">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Resumen de Proyectos</p>
        <ProjectStatusChart data={statusCounts} />
      </div>

      <div className="space-y-4">
        {data.map((p, i) => (
          <div key={i} className="rounded-xl border border-slate-100 p-4 shadow-sm hover:border-blue-100 transition-colors">
            <div className="flex justify-between items-start">
               <div>
                 <h4 className="font-serif font-bold text-slate-900">{p.name}</h4>
                 <div className="mt-1 flex items-center gap-3">
                    <div className="flex items-center gap-1 text-[10px] text-slate-500">
                      <Database className="h-3 w-3" />
                      <span className="font-bold uppercase">{p.mineralType}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-slate-500">
                      <MapPin className="h-3 w-3" />
                      <span>{p.location}</span>
                    </div>
                 </div>
               </div>
               <span className={`text-[10px] font-black border px-2 py-0.5 rounded-full uppercase ${
                  p.status === 'de_acuerdo' ? 'border-emerald-200 text-emerald-600 bg-emerald-50' :
                  p.status === 'paralizado' ? 'border-rose-200 text-rose-600 bg-rose-50' : 
                  'border-slate-200 text-slate-600 bg-slate-50'
                }`}>
                  {p.status.replace('_', ' ')}
                </span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4 border-t border-slate-50 pt-3">
               <div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase">Proceso Actual</p>
                  <p className="text-xs font-bold text-slate-700 capitalize">{p.process}</p>
               </div>
               <div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase">Tiempo Estimado</p>
                  <p className="text-xs font-bold text-slate-700">
                    {p.estimatedMonthsRemaining ? `${p.estimatedMonthsRemaining} meses` : 'Indefinido'}
                  </p>
               </div>
            </div>
            
            {mode === 'official' && (
              <div className="mt-3 flex gap-2">
                <button className="text-[9px] font-bold bg-slate-900 text-white px-3 py-1 rounded hover:bg-slate-800 transition-colors">Ver Expediente</button>
                <button className="text-[9px] font-bold border border-slate-200 px-3 py-1 rounded hover:bg-slate-50 transition-colors">Mapas de Concesión</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MiningProjectsSection;

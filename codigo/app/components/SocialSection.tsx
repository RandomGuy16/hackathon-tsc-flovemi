import React from 'react';
import { UserMode, CompanyDashboardData } from '@/lib/types';
import { Users, MessageCircle, MapPin, AlertCircle, Calendar } from 'lucide-react';

interface SocialSectionProps {
  data: CompanyDashboardData['social'];
  mode: UserMode;
}

const SocialSection: React.FC<SocialSectionProps> = ({ data, mode }) => {
  const hasConflicts = data.activeConflicts > 0;

  if (mode === 'citizen') {
    return (
      <div className="flex flex-col gap-6 animate-fade-in">
        <div className={`flex items-center gap-4 rounded-3xl p-6 border shadow-sm transition-all ${
          hasConflicts ? 'bg-amber-50 border-amber-100 text-amber-900 shadow-amber-50' : 'bg-emerald-50 border-emerald-100 text-emerald-900 shadow-emerald-50'
        }`}>
          <div className={`flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-lg ${
            hasConflicts ? 'bg-amber-500 shadow-amber-200' : 'bg-emerald-500 shadow-emerald-200'
          }`}>
            <MessageCircle className="h-8 w-8" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-70">Conflictos Activos</p>
            <p className="text-4xl font-outfit font-black leading-none">{hasConflicts ? data.activeConflicts : '0'}</p>
          </div>
        </div>
        
        <p className="text-base font-medium text-slate-600 leading-relaxed">
          {hasConflicts 
            ? `Se registran ${data.activeConflicts} situaciones de tensión con las comunidades locales. Estas requieren diálogo y mediación oficial.` 
            : 'No se reportan conflictos sociales vigentes en las zonas de influencia de esta empresa.'}
        </p>

        {hasConflicts && (
          <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-amber-700 mb-2">Caso Reciente</p>
            <p className="text-sm font-bold text-slate-800 leading-snug">{data.conflicts[0].description}</p>
            <div className="mt-3 flex items-center gap-2 text-[10px] font-bold text-slate-400">
               <MapPin className="h-3 w-3" />
               <span className="text-nowrap">{data.conflicts[0].district}, {data.conflicts[0].province}</span>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      <div className="flex items-center justify-between px-2">
        <div className="flex flex-col gap-1">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Estado de Convivencia</p>
          <div className="flex items-center gap-3">
             <h4 className="text-4xl font-outfit font-black text-slate-900 leading-none">{data.activeConflicts}</h4>
             <span className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest ring-1 ring-inset ${
               hasConflicts ? 'bg-amber-50 text-amber-600 ring-amber-100' : 'bg-emerald-50 text-emerald-600 ring-emerald-100'
             }`}>
               {hasConflicts ? 'Presión Social' : 'Diálogo Fluido'}
             </span>
          </div>
        </div>
        <Users className="h-10 w-10 text-slate-100" />
      </div>

      <div className="space-y-4">
        {data.conflicts.map((c, i) => (
          <div key={i} className="group relative flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 transition-all duration-300 hover:border-amber-200 hover:shadow-xl hover:shadow-slate-200/50">
            <div className="flex items-center justify-between">
              <span className={`rounded-lg px-2 py-1 text-[9px] font-black uppercase tracking-widest ${
                c.status.toLowerCase() === 'activo' ? 'bg-rose-500 text-white shadow-lg shadow-rose-100' : 'bg-slate-900 text-white'
              }`}>
                {c.status}
              </span>
              <div className="flex items-center gap-1.5 font-mono text-[10px] font-bold text-slate-400 uppercase">
                 <Calendar className="h-3 w-3" />
                 {c.reportedAt}
              </div>
            </div>
            
            <p className="font-outfit text-lg font-extrabold text-slate-900 leading-tight group-hover:text-amber-700 transition-colors">
              {c.description}
            </p>
            
            <div className="flex items-center gap-2 pt-4 border-t border-slate-50">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-50 text-slate-400">
                 <MapPin className="h-3.5 w-3.5" />
              </div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-tight">{c.district}, {c.province}, {c.region}</span>
            </div>
            
            {mode === 'official' && (
              <button className="mt-2 w-full rounded-xl bg-slate-900 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] text-white hover:bg-slate-800 transition-all cursor-pointer">
                Ver Log de Mediación
              </button>
            )}
          </div>
        ))}

        {data.conflicts.length === 0 && (
           <div className="py-12 text-center rounded-3xl border-2 border-dashed border-slate-100">
              <AlertCircle className="h-8 w-8 text-slate-200 mx-auto mb-3" />
              <p className="text-xs font-bold text-slate-400">No hay registros históricos en esta vista.</p>
           </div>
        )}
      </div>
    </div>
  );
};

export default SocialSection;

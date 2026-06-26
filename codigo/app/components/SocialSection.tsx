import React from 'react';
import { UserMode, CompanyDashboardData } from '@/lib/types';
import { Users, MessageCircle, MapPin } from 'lucide-react';

interface SocialSectionProps {
  data: CompanyDashboardData['social'];
  mode: UserMode;
}

const SocialSection: React.FC<SocialSectionProps> = ({ data, mode }) => {
  const hasConflicts = data.activeConflicts > 0;

  if (mode === 'citizen') {
    return (
      <div className="flex flex-col gap-4">
        <div className={`flex items-center gap-3 rounded-xl p-4 border ${hasConflicts ? 'bg-rose-50 border-rose-100' : 'bg-emerald-50 border-emerald-100'}`}>
          <Users className={`h-8 w-8 ${hasConflicts ? 'text-rose-600' : 'text-emerald-600'}`} />
          <div>
            <p className={`text-sm font-bold ${hasConflicts ? 'text-rose-900' : 'text-emerald-900'}`}>
              Conflictos con la Comunidad
            </p>
            <p className={`text-2xl font-black ${hasConflicts ? 'text-rose-700' : 'text-emerald-700'}`}>
              {hasConflicts ? data.activeConflicts : 'Ninguno'}
            </p>
          </div>
        </div>
        <p className="text-sm text-slate-600 leading-relaxed">
          {hasConflicts 
            ? `Hay ${data.activeConflicts} problemas activos entre la empresa y los vecinos de la zona.` 
            : 'No hay problemas graves reportados con la comunidad actualmente.'}
        </p>
        {hasConflicts && (
          <div className="rounded-lg bg-slate-50 p-3">
            <p className="text-xs font-bold text-slate-700">{data.conflicts[0].description}</p>
            <div className="mt-1 flex items-center gap-1 text-[10px] text-slate-500">
               <MapPin className="h-3 w-3" />
               <span>{data.conflicts[0].district}, {data.conflicts[0].province}</span>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Conflictos Activos</p>
          <p className="text-3xl font-black text-slate-900">{data.activeConflicts}</p>
        </div>
        <MessageCircle className="h-8 w-8 text-slate-200" />
      </div>

      <div className="space-y-4">
        {data.conflicts.map((c, i) => (
          <div key={i} className="flex flex-col gap-2 rounded-xl border border-slate-100 p-4 shadow-sm transition-hover hover:border-blue-100">
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-black text-rose-700 uppercase">
                {c.status}
              </span>
              <span className="text-[10px] font-mono text-slate-400">{c.reportedAt}</span>
            </div>
            <p className="font-serif text-sm font-bold text-slate-900">{c.description}</p>
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <MapPin className="h-3.5 w-3.5" />
              <span>{c.district}, {c.province}, {c.region}</span>
            </div>
            
            {mode === 'official' && (
              <div className="mt-2 border-t border-slate-50 pt-2">
                <button className="text-[10px] font-bold text-blue-600 hover:underline">Ver Informe de Gestión Social →</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SocialSection;

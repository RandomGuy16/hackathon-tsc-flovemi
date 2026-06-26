import React from 'react';
import { UserMode, CompanyDashboardData } from '@/lib/types';
import { Clock, MapPin, Database, ArrowUpRight } from 'lucide-react';
import type { EstadoProyectoMinero } from '@/domain/entities/proyecto-minero';
import ProjectStatusChart from './ProjectStatusChart';
import MethodologyCard from './MethodologyCard';
import SourceBadge from './SourceBadge';
import VerificationNotice from './VerificationNotice';

interface MiningProjectsSectionProps {
  data: CompanyDashboardData['miningProjects'];
  mode: UserMode;
}

const statusConfig: Record<EstadoProyectoMinero, { label: string; bg: string; text: string; border: string }> = {
  de_acuerdo: { label: 'En Regla', bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-200' },
  paralizado: { label: 'Paralizado', bg: 'bg-rose-100', text: 'text-rose-700', border: 'border-rose-200' },
  en_tramite: { label: 'En Trámite', bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-200' },
  cerrado: { label: 'Cerrado', bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-200' },
};

const MiningProjectsSection: React.FC<MiningProjectsSectionProps> = ({ data, mode }) => {
  const statusCounts = data.reduce((acc, p) => {
    const existing = acc.find(a => a.status === p.status);
    if (existing) {
      existing.count++;
    } else {
      acc.push({ status: p.status, count: 1 });
    }
    return acc;
  }, [] as { status: EstadoProyectoMinero; count: number }[]);

  if (mode === 'citizen') {
    return (
      <div className="flex flex-col gap-8 animate-fade-in">
        <div className="rounded-3xl bg-slate-50 p-6 border border-slate-100">
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Panorama de Proyectos</p>
           <ProjectStatusChart data={statusCounts} />
        </div>

        <div className="grid gap-4">
          {data.map((p, i) => (
            <div key={i} className="group relative flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5 transition-all hover:border-amber-200 hover:shadow-lg">
              <div className="flex justify-between items-center">
                <h4 className="font-outfit font-extrabold text-slate-900 group-hover:text-amber-700 transition-colors">{p.name}</h4>
                <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-lg ${statusConfig[p.status].bg} ${statusConfig[p.status].text}`}>
                  {statusConfig[p.status].label}
                </span>
              </div>
              <p className="text-xs font-medium text-slate-500 leading-relaxed">
                Extracción de <span className="font-black text-slate-900 uppercase tracking-tighter">{p.mineralType}</span> en la región de {p.location}.
              </p>
              {p.estimatedMonthsRemaining && (
                <div className="mt-2 flex items-center gap-2 text-[10px] font-bold text-amber-600 bg-amber-50 w-fit px-3 py-1.5 rounded-full ring-1 ring-amber-100">
                  <Clock className="h-3 w-3" />
                  <span>Cierre estimado: {p.estimatedMonthsRemaining} meses</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      <div className="grid gap-4">
        {data.map((p, i) => (
          <div key={i} className="group relative flex flex-col gap-5 rounded-[2rem] border border-slate-200 bg-white p-7 transition-all duration-300 hover:border-amber-300 hover:shadow-2xl hover:shadow-slate-200/50">
            <div className="flex justify-between items-start">
               <div className="flex flex-col gap-1.5 min-w-0">
                 <div className="flex items-center gap-2">
                    <Database className="h-3.5 w-3.5 text-amber-600" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Expediente {p.id.slice(-5).toUpperCase()}</span>
                 </div>
                 <h4 className="font-outfit text-xl font-black text-slate-900 leading-tight group-hover:text-amber-700 transition-colors truncate">{p.name}</h4>
                 <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500">
                      <MapPin className="h-3 w-3" />
                      <span>{p.location}</span>
                    </div>
                    <div className="h-1 w-1 rounded-full bg-slate-200" />
                    <span className="text-[10px] font-black text-amber-700 uppercase tracking-widest">{p.mineralType}</span>
                 </div>
               </div>
               <span className={`text-[10px] font-black border px-3 py-1.5 rounded-xl uppercase tracking-wider shadow-sm flex-shrink-0 ${
                  p.status === 'de_acuerdo' ? 'border-emerald-200 text-emerald-600 bg-emerald-50' :
                  p.status === 'paralizado' ? 'border-rose-200 text-rose-600 bg-rose-50' : 
                  'border-slate-200 text-slate-600 bg-slate-50'
                }`}>
                  {statusConfig[p.status].label}
                </span>
            </div>

            <div className="grid grid-cols-2 gap-4 rounded-2xl bg-slate-50 p-4 border border-slate-100">
               <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Fase Actual</p>
                  <p className="text-xs font-bold text-slate-700 capitalize">{p.process}</p>
               </div>
               <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Vida Útil</p>
                  <p className="text-xs font-bold text-slate-700">
                    {p.estimatedMonthsRemaining ? `${p.estimatedMonthsRemaining} meses` : 'Indefinido'}
                  </p>
               </div>
            </div>
            
            {mode === 'official' && (
              <div className="flex gap-2">
                <button className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-slate-900 py-3 text-[10px] font-black uppercase tracking-widest text-white hover:bg-slate-800 transition-all cursor-pointer">
                  Explorar GIS <ArrowUpRight className="h-3 w-3" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-inner">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Composición de Cartera</p>
        <ProjectStatusChart data={statusCounts} />
      </div>

      <MethodologyCard title="Nota metodológica: proyectos mineros">
        <p className="mb-2">
          La información de proyectos mineros proviene de la{' '}
          <strong>Base de Datos Minera del MINEM</strong> y de registros de concesiones mineras. El
          estado mostrado refleja la última resolución registrada en el trámite correspondiente.
        </p>
        <p className="mb-2">
          Los tiempos estimados de vida útil son proyecciones basadas en la información de
          exploración y producción disponible; los cierres reales dependen de resultados técnicos,
          decisiones económicas y autorizaciones regulatorias.
        </p>
        <p>
          Para una cobertura completa se recomienda verificar el estado de cada concesión en el
          portal de trámites mineros del MINEM y en los Estudios de Impacto Ambiental aprobados.
        </p>
      </MethodologyCard>

      <SourceBadge source="MINEM / Base de Datos Minera" confidence="alta" />
      <VerificationNotice />
    </div>
  );
};

export default MiningProjectsSection;

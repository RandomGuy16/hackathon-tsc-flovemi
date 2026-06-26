import React from 'react';
import { UserMode, CompanyDashboardData } from '@/lib/types';
import { Leaf, Wind, MapPin } from 'lucide-react';
import MethodologyCard from './MethodologyCard';
import SourceBadge from './SourceBadge';
import VerificationNotice from './VerificationNotice';

interface EnvironmentalSectionProps {
  data: CompanyDashboardData['environmental'];
  mode: UserMode;
}

const EnvironmentalSection: React.FC<EnvironmentalSectionProps> = ({ data, mode }) => {
  const totalAmount = data.sanctions.reduce((acc, s) => acc + (s.amount ?? 0), 0);

  if (mode === 'citizen') {
    return (
      <div className="flex flex-col gap-6 animate-fade-in">
        <div className={`flex items-center gap-4 rounded-3xl p-6 border shadow-sm transition-all ${
          data.sanctionsCount > 0 ? 'bg-amber-50 border-amber-100 text-amber-900 shadow-amber-50' : 'bg-emerald-50 border-emerald-100 text-emerald-900 shadow-emerald-50'
        }`}>
          <div className={`flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-lg ${
            data.sanctionsCount > 0 ? 'bg-amber-500 shadow-amber-200' : 'bg-emerald-500 shadow-emerald-200'
          }`}>
            <Leaf className="h-8 w-8" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-70">Multas Firmes</p>
            <p className="text-4xl font-outfit font-black leading-none">{data.sanctionsCount}</p>
          </div>
        </div>
        
        <p className="text-base font-medium text-slate-600 leading-relaxed">
          {data.sanctionsCount > 0 
            ? `Se han detectado ${data.sanctionsCount} infracciones a la normativa ambiental. Esto afecta directamente a la biodiversidad local.` 
            : 'No se registran multas ambientales vigentes para esta empresa.'}
        </p>

        <div className="space-y-3">
           <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <Wind className="h-3 w-3" /> Monitoreo Aire (PM2.5)
           </div>
           <div className="grid gap-2">
              {data.airQuality.map((aq, i) => (
                <div key={i} className="flex justify-between items-center rounded-2xl bg-slate-50 border border-slate-100 px-5 py-3">
                   <div className="flex items-center gap-2">
                      <MapPin className="h-3 w-3 text-slate-400" />
                      <span className="text-xs font-bold text-slate-700">{aq.stationName}</span>
                   </div>
                   <span className={`text-xs font-black px-2 py-1 rounded-lg ${aq.value > 25 ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'}`}>
                     {aq.value} {aq.unit}
                   </span>
                </div>
              ))}
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      <div className="flex items-center justify-between rounded-3xl bg-slate-900 p-8 text-white shadow-xl shadow-slate-200">
        <div>
           <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 mb-1">Sanciones OEFA</p>
           <p className="text-5xl font-outfit font-black tracking-tighter leading-none">{data.sanctionsCount}</p>
        </div>
        <div className="text-right">
           <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1 text-nowrap">Impacto Económico</p>
           <p className="text-xl font-mono font-black text-rose-400">
             S/ {totalAmount.toLocaleString()}
           </p>
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Historial de Resoluciones</p>
        {data.sanctions.length === 0 ? (
          <div className="py-6 text-center rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200">
             <p className="text-xs font-bold text-slate-400">Sin registros de sanciones.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {data.sanctions.map((s, i) => (
              <div key={i} className="group rounded-2xl border border-slate-100 p-5 transition-all hover:border-amber-200 hover:bg-white hover:shadow-md">
                <div className="flex justify-between items-start mb-2">
                  <span className="rounded bg-slate-900 px-2 py-0.5 text-[9px] font-black text-white uppercase">{s.authority}</span>
                  <span className="font-mono text-[10px] font-bold text-slate-400">{s.date}</span>
                </div>
                <p className="text-xs font-medium text-slate-600 leading-relaxed mb-3">{s.description}</p>
                {mode === 'official' && s.amount !== null && (
                  <div className="inline-flex items-center gap-2 rounded-lg bg-rose-50 px-3 py-1.5 ring-1 ring-rose-100">
                     <span className="text-[10px] font-black uppercase text-rose-500 tracking-wider">Multa:</span>
                     <span className="text-xs font-mono font-black text-rose-700">S/ {s.amount.toLocaleString()}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-sm">
        <div className="bg-slate-50 px-6 py-3 border-b border-slate-100">
           <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Lectura de Sensores PM2.5</p>
        </div>
        <div className="p-6 space-y-5">
          {data.airQuality.map((aq, i) => (
            <div key={i} className="flex flex-col gap-2">
              <div className="flex justify-between items-end">
                <span className="text-xs font-bold text-slate-700">{aq.stationName}</span>
                <span className="font-mono text-xs font-black text-slate-900">{aq.value} <span className="text-slate-400 font-medium tracking-normal">{aq.unit}</span></span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ease-out ${aq.value > 25 ? 'bg-rose-500' : 'bg-emerald-500'}`}
                  style={{ width: `${Math.min((aq.value / 50) * 100, 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <MethodologyCard title="Nota metodológica: fiscalización ambiental">
        <p className="mb-2">
          Las sanciones ambientales listadas provienen de resoluciones publicadas por la{' '}
          <strong>OEFA</strong>. Solo se muestran infracciones con resolución firme o en estado de
          ejecución; no se incluyen procesos en etapa de investigación reservada.
        </p>
        <p className="mb-2">
          Las lecturas de calidad del aire son aproximaciones basadas en estaciones de monitoreo
          cercanas a la zona de influencia reportada. No representan mediciones puntuales en cada
          instalación de la empresa.
        </p>
        <p>
          El monto acumulado de multas es una suma informativa; los cobros efectivos pueden variar
          por descuentos, apelaciones o convenios de pago.
        </p>
      </MethodologyCard>

      <SourceBadge source="OEFA / Sistema de Información Ambiental" confidence="alta" />
      <VerificationNotice />
    </div>
  );
};

export default EnvironmentalSection;

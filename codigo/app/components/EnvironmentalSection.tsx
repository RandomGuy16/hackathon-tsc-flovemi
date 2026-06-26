import React from 'react';
import { UserMode, CompanyDashboardData } from '@/lib/types';
import { Leaf, AlertTriangle } from 'lucide-react';

interface EnvironmentalSectionProps {
  data: CompanyDashboardData['environmental'];
  mode: UserMode;
}

const EnvironmentalSection: React.FC<EnvironmentalSectionProps> = ({ data, mode }) => {
  const totalAmount = data.sanctions.reduce((acc, s) => acc + (s.amount ?? 0), 0);

  if (mode === 'citizen') {
    return (
      <div className="flex flex-col gap-4">
        <div className={`flex items-center gap-3 rounded-xl p-4 border ${data.sanctionsCount > 0 ? 'bg-amber-50 border-amber-100' : 'bg-emerald-50 border-emerald-100'}`}>
          <Leaf className={`h-8 w-8 ${data.sanctionsCount > 0 ? 'text-amber-600' : 'text-emerald-600'}`} />
          <div>
            <p className={`text-sm font-bold ${data.sanctionsCount > 0 ? 'text-amber-900' : 'text-emerald-900'}`}>Multas Ambientales</p>
            <p className={`text-2xl font-black ${data.sanctionsCount > 0 ? 'text-amber-700' : 'text-emerald-700'}`}>{data.sanctionsCount}</p>
          </div>
        </div>
        <p className="text-sm text-slate-600 leading-relaxed">
          Esta empresa ha sido multada <span className="font-bold">{data.sanctionsCount}</span> veces por no cuidar la naturaleza.
          Esto puede significar daño a ríos o al aire que respiramos.
        </p>
        <div className="space-y-2">
           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Calidad del Aire</p>
           {data.airQuality.map((aq, i) => (
             <div key={i} className="flex justify-between items-center rounded-lg bg-slate-50 px-3 py-2 text-xs">
                <span className="font-medium">{aq.stationName}</span>
                <span className={`font-bold ${aq.value > 25 ? 'text-rose-600' : 'text-emerald-600'}`}>
                  {aq.value} {aq.unit}
                </span>
             </div>
           ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
           <p className="text-xs font-bold text-slate-400 uppercase">Sanciones OEFA</p>
           <p className="text-3xl font-black text-slate-900">{data.sanctionsCount}</p>
        </div>
        <div className="text-right">
           <p className="text-xs font-bold text-slate-400 uppercase">Monto Total</p>
           <p className="text-lg font-bold text-slate-900">
             S/ {totalAmount.toLocaleString()}
           </p>
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-xs font-bold text-slate-400 uppercase">Historial de Sanciones</p>
        {data.sanctions.length === 0 ? (
          <p className="text-xs text-slate-500 italic">No se registran sanciones ambientales.</p>
        ) : (
          data.sanctions.map((s, i) => (
            <div key={i} className="rounded-lg border border-slate-100 p-3 text-sm">
              <div className="flex justify-between items-start">
                <span className="font-bold text-slate-800">{s.authority}</span>
                <span className="text-xs font-mono text-slate-500">{s.date}</span>
              </div>
              <p className="mt-1 text-slate-600 text-xs">{s.description}</p>
              {mode === 'official' && s.amount !== null && (
                <p className="mt-2 text-[10px] font-bold text-rose-600">MULTA: S/ {s.amount.toLocaleString()}</p>
              )}
            </div>
          ))
        )}
      </div>

      <div className="rounded-xl bg-slate-900 p-4 text-white">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Monitoreo de Partículas (PM2.5)</p>
        <div className="mt-2 space-y-2">
          {data.airQuality.map((aq, i) => (
            <div key={i} className="flex flex-col gap-1">
              <div className="flex justify-between text-xs">
                <span>{aq.stationName}</span>
                <span className="font-mono">{aq.value} {aq.unit}</span>
              </div>
              <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${aq.value > 25 ? 'bg-rose-500' : 'bg-emerald-500'}`}
                  style={{ width: `${Math.min((aq.value / 50) * 100, 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EnvironmentalSection;

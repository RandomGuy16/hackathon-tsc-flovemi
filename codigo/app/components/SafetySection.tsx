import React from 'react';
import { UserMode, CompanyDashboardData } from '@/lib/types';
import { ShieldAlert, Info } from 'lucide-react';

interface SafetySectionProps {
  data: CompanyDashboardData['safety'];
  mode: UserMode;
}

const SafetySection: React.FC<SafetySectionProps> = ({ data, mode }) => {
  if (mode === 'citizen') {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3 rounded-xl bg-rose-50 p-4 border border-rose-100">
          <ShieldAlert className="h-8 w-8 text-rose-600" />
          <div>
            <p className="text-sm font-bold text-rose-900">Accidentes Fatales</p>
            <p className="text-2xl font-black text-rose-700">{data.fatalAccidents}</p>
          </div>
        </div>
        <p className="text-sm text-slate-600 leading-relaxed">
          Esta empresa ha reportado <span className="font-bold">{data.fatalAccidents}</span> accidentes con fallecidos. 
          Un número alto indica que el trabajo puede ser muy peligroso para los mineros.
        </p>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Info className="h-3 w-3" />
          <span>Fuente: {data.source}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Accidentes Mortales</p>
          <p className="mt-1 text-3xl font-black text-slate-900">{data.fatalAccidents}</p>
        </div>
        <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Enf. Ocupacionales</p>
          <p className="mt-1 text-3xl font-black text-slate-900">{data.occupationalDiseases}</p>
        </div>
      </div>

      {mode === 'official' && (
        <div className="rounded-lg border border-slate-200 overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold">
              <tr>
                <th className="px-4 py-2">Categoría</th>
                <th className="px-4 py-2">Valor</th>
                <th className="px-4 py-2">Tasa (1k)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="px-4 py-2 font-medium">Fallecidos</td>
                <td className="px-4 py-2">{data.fatalAccidents}</td>
                <td className="px-4 py-2">0.45</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-medium">Enfermedades</td>
                <td className="px-4 py-2">{data.occupationalDiseases}</td>
                <td className="px-4 py-2">1.2</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {mode === 'journalist' && (
        <div className="flex flex-col gap-2">
          <p className="text-xs text-slate-500 italic">
            * Datos acumulados según registros oficiales del {data.source} a la fecha.
          </p>
          <a href="#" className="text-xs font-bold text-blue-600 hover:underline">Ver reporte técnico completo →</a>
        </div>
      )}
    </div>
  );
};

export default SafetySection;

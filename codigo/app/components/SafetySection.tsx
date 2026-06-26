import React from 'react';
import { UserMode, CompanyDashboardData } from '@/lib/types';
import { ShieldAlert, Info, Skull, Thermometer } from 'lucide-react';

interface SafetySectionProps {
  data: CompanyDashboardData['safety'];
  mode: UserMode;
}

const SafetySection: React.FC<SafetySectionProps> = ({ data, mode }) => {
  if (mode === 'citizen') {
    return (
      <div className="flex flex-col gap-5 animate-fade-in">
        <div className="flex items-center gap-4 rounded-2xl bg-rose-50 p-5 border border-rose-100">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-500 text-white shadow-sm shadow-rose-200">
            <Skull className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-rose-500">Vidas Perdidas</p>
            <p className="font-outfit text-4xl font-black text-rose-700 leading-none">{data.fatalAccidents}</p>
          </div>
        </div>

        <p className="text-sm font-medium text-slate-600 leading-relaxed">
          Esta unidad registra{' '}
          <span className="font-bold text-slate-900">{data.fatalAccidents}</span>{' '}
          fallecimientos en operaciones. Un índice superior a cero representa un entorno de alto riesgo para los trabajadores.
        </p>

        <div className="flex items-center gap-2.5 rounded-xl bg-slate-50 px-4 py-3 border border-slate-100">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
          <p className="text-xs text-slate-500">Fuente Oficial: {data.source}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="grid grid-cols-2 gap-3">
        <div className="group rounded-xl border border-slate-100 bg-slate-50 p-5 transition-all hover:bg-white hover:border-rose-100 hover:shadow-md">
          <div className="flex items-center gap-2 mb-3">
            <Skull className="h-3.5 w-3.5 text-rose-500" />
            <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">Accidentes Mortales</p>
          </div>
          <p className="font-outfit text-4xl font-black text-slate-900 group-hover:text-rose-600 transition-colors">
            {data.fatalAccidents}
          </p>
        </div>
        <div className="group rounded-xl border border-slate-100 bg-slate-50 p-5 transition-all hover:bg-white hover:border-amber-100 hover:shadow-md">
          <div className="flex items-center gap-2 mb-3">
            <Thermometer className="h-3.5 w-3.5 text-amber-600" />
            <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">Enfermedades</p>
          </div>
          <p className="font-outfit text-4xl font-black text-slate-900 group-hover:text-amber-600 transition-colors">
            {data.occupationalDiseases}
          </p>
        </div>
      </div>

      {mode === 'official' && (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <table className="w-full text-left">
            <thead className="bg-slate-900 text-white">
              <tr>
                <th className="px-4 py-3 text-[9px] font-semibold uppercase tracking-widest">Indicador</th>
                <th className="px-4 py-3 text-[9px] font-semibold uppercase tracking-widest">Valor Real</th>
                <th className="px-4 py-3 text-[9px] font-semibold uppercase tracking-widest">Tasa %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3 text-xs font-medium text-slate-700">Fallecidos Acumulados</td>
                <td className="px-4 py-3 font-mono text-xs font-bold text-rose-600">{data.fatalAccidents}</td>
                <td className="px-4 py-3 font-mono text-xs text-slate-400">0.45</td>
              </tr>
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3 text-xs font-medium text-slate-700">Enf. Ocupacionales</td>
                <td className="px-4 py-3 font-mono text-xs font-bold text-amber-700">{data.occupationalDiseases}</td>
                <td className="px-4 py-3 font-mono text-xs text-slate-400">1.22</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {mode === 'journalist' && (
        <div className="flex flex-col gap-3">
          <div className="h-px bg-slate-100 w-full" />
          <div className="flex items-start gap-2.5">
            <Info className="h-4 w-4 text-slate-400 mt-0.5 flex-shrink-0" />
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Estadísticas proyectadas según el último cierre trimestral del {data.source}. Sujetos a auditoría por OSINERGMIN.
            </p>
          </div>
          <button className="w-full rounded-lg bg-amber-50 py-2.5 text-xs font-semibold uppercase tracking-wider text-amber-700 hover:bg-amber-100 transition-colors cursor-pointer">
            Descargar Dataset Seguridad
          </button>
        </div>
      )}
    </div>
  );
};

export default SafetySection;

import React from 'react';
import { UserMode, CompanyDashboardData } from '@/lib/types';
import { Scale, FileText, ExternalLink } from 'lucide-react';

interface LegalSectionProps {
  data: CompanyDashboardData['legal'];
  mode: UserMode;
}

const LegalSection: React.FC<LegalSectionProps> = ({ data, mode }) => {
  const hasSanctions = data.osceSanctions.length > 0;
  const totalFines = data.osceFines.reduce((acc, f) => acc + f.amount, 0);

  if (mode === 'citizen') {
    return (
      <div className="flex flex-col gap-4">
        <div className={`flex items-center gap-3 rounded-xl p-4 border ${hasSanctions ? 'bg-rose-50 border-rose-100' : 'bg-emerald-50 border-emerald-100'}`}>
          <Scale className={`h-8 w-8 ${hasSanctions ? 'text-rose-600' : 'text-emerald-600'}`} />
          <div>
            <p className={`text-sm font-bold ${hasSanctions ? 'text-rose-900' : 'text-emerald-900'}`}>
              Estado Legal
            </p>
            <p className={`text-lg font-black ${hasSanctions ? 'text-rose-700' : 'text-emerald-700'}`}>
              {hasSanctions ? 'SANCIONADA' : 'HABILITADA'}
            </p>
          </div>
        </div>
        <p className="text-sm text-slate-600 leading-relaxed">
          {hasSanctions
            ? 'Esta empresa tiene prohibido contratar con el Estado por faltas legales graves.'
            : 'Esta empresa puede contratar con el Estado sin problemas legales registrados.'}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="space-y-4">
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Sanciones OSCE</p>
          {data.osceSanctions.length === 0 ? (
            <div className="mt-2 flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Sin inhabilitaciones vigentes
            </div>
          ) : (
            <div className="mt-2 space-y-2">
              {data.osceSanctions.map((s, i) => (
                <div key={i} className="rounded-lg border border-rose-100 bg-rose-50 p-3 text-xs">
                  <p className="font-bold text-rose-900">{s.authority}</p>
                  <p className="text-rose-700">{s.description}</p>
                  <p className="text-slate-500">Fecha: {s.date}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {mode === 'official' && data.osceFines.length > 0 && (
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Multas OSCE</p>
            <p className="text-lg font-bold text-slate-900">S/ {totalFines.toLocaleString()}</p>
            {data.osceFines.map((f, i) => (
              <div key={i} className="mt-2 text-xs text-slate-600">
                <span className="font-bold">{f.authority}</span> — {f.currency} {f.amount.toLocaleString()} ({f.date})
              </div>
            ))}
          </div>
        )}

        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Licitaciones Públicas</p>
          {data.tenders.length === 0 ? (
            <p className="mt-2 text-xs text-slate-500 italic">No se registran licitaciones en el periodo actual.</p>
          ) : (
            <div className="mt-2 divide-y divide-slate-100">
              {data.tenders.map((t, i) => (
                <div key={i} className="py-2">
                   <div className="flex justify-between items-start">
                     <p className="text-xs font-bold text-slate-800">{t.title}</p>
                     <span className="text-[10px] font-mono text-slate-500">
                       {t.amount !== null ? `S/ ${t.amount.toLocaleString()}` : 'Monto no disponible'}
                     </span>
                   </div>
                   {mode === 'official' && <p className="text-[10px] text-slate-400">Código: {t.code}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {mode === 'journalist' && (
        <a href="https://www.osce.gob.pe" target="_blank" rel="noreferrer" className="mt-2 flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:underline">
          <FileText className="h-3 w-3" />
          Ver ficha completa en OSCE <ExternalLink className="h-3 w-3" />
        </a>
      )}
    </div>
  );
};

export default LegalSection;

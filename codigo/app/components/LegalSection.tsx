import React from 'react';
import { UserMode, CompanyDashboardData } from '@/lib/types';
import { Scale, FileText, ExternalLink, Gavel, CheckCircle2, AlertCircle } from 'lucide-react';
import MethodologyCard from './MethodologyCard';
import SourceBadge from './SourceBadge';
import VerificationNotice from './VerificationNotice';

interface LegalSectionProps {
  data: CompanyDashboardData['legal'];
  mode: UserMode;
}

const LegalSection: React.FC<LegalSectionProps> = ({ data, mode }) => {
  const hasSanctions = data.osceSanctions.length > 0;
  const totalFines = data.osceFines.reduce((acc, f) => acc + f.amount, 0);

  if (mode === 'citizen') {
    return (
      <div className="flex flex-col gap-6 animate-fade-in">
        <div className={`flex items-center gap-4 rounded-3xl p-6 border shadow-sm transition-all ${
          hasSanctions ? 'bg-rose-50 border-rose-100 shadow-rose-50' : 'bg-emerald-50 border-emerald-100 shadow-emerald-50'
        }`}>
          <div className={`flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-lg ${
            hasSanctions ? 'bg-rose-500 shadow-rose-200' : 'bg-emerald-500 shadow-emerald-200'
          }`}>
            {hasSanctions ? <Gavel className="h-8 w-8" /> : <CheckCircle2 className="h-8 w-8" />}
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-70 text-slate-500">Situación Jurídica</p>
            <p className={`text-2xl font-outfit font-black leading-none ${hasSanctions ? 'text-rose-700' : 'text-emerald-700'}`}>
              {hasSanctions ? 'SANCIONADA' : 'EN REGLA'}
            </p>
          </div>
        </div>
        
        <p className="text-base font-medium text-slate-600 leading-relaxed">
          {hasSanctions
            ? 'Esta empresa cuenta con procesos administrativos ante el OSCE que limitan su capacidad de contratación estatal.'
            : 'No se registran impedimentos legales para que la empresa realice contrataciones con el Estado Peruano.'}
        </p>
        {totalFines > 0 && (
          <div className="rounded-xl border border-amber-100 bg-amber-50 p-3">
            <p className="text-xs font-bold text-amber-800 uppercase tracking-wider">Multas OSCE</p>
            <p className="text-xl font-black text-amber-700">S/ {totalFines.toLocaleString()}</p>
            <p className="text-xs text-amber-600 mt-0.5">en multas registradas ante el Estado</p>
          </div>
        )}
        {data.tenders.length > 0 && (
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Contratos con el Estado</p>
            <p className="text-xl font-black text-slate-800">{data.tenders.length}</p>
            <p className="text-xs text-slate-500 mt-0.5">licitaciones públicas recientes</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
             <Scale className="h-3 w-3" /> Impedimentos OSCE
          </div>
          {data.osceSanctions.length === 0 ? (
            <div className="flex items-center gap-3 rounded-2xl bg-emerald-50/50 border border-emerald-100 px-5 py-4 text-xs font-bold text-emerald-700 shadow-sm">
              <CheckCircle2 className="h-4 w-4" />
              Empresa habilitada para contrataciones
            </div>
          ) : (
            <div className="space-y-3">
              {data.osceSanctions.map((s, i) => (
                <div key={i} className="rounded-2xl border border-rose-100 bg-rose-50 p-5 shadow-sm transition-all hover:shadow-md">
                  <div className="flex items-center gap-2 mb-2">
                     <AlertCircle className="h-3.5 w-3.5 text-rose-500" />
                     <p className="text-[10px] font-black text-rose-900 uppercase tracking-wide">{s.authority}</p>
                  </div>
                  <p className="text-sm font-bold text-rose-900 leading-tight mb-2">{s.description}</p>
                  <p className="font-mono text-[10px] font-bold text-rose-600 opacity-80 uppercase">Desde: {s.date}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {mode === 'official' && data.osceFines.length > 0 && (
          <div className="rounded-3xl bg-slate-50 border border-slate-200 overflow-hidden shadow-sm">
            <div className="bg-white px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Pasivos Administrativos</p>
              <span className="font-mono text-xs font-black text-rose-600">S/ {totalFines.toLocaleString()}</span>
            </div>
            <div className="p-4 space-y-2">
              {data.osceFines.map((f, i) => (
                <div key={i} className="flex justify-between items-center px-4 py-2 rounded-xl hover:bg-white transition-colors">
                  <span className="text-[11px] font-bold text-slate-700">{f.authority}</span>
                  <span className="font-mono text-[10px] font-bold text-slate-500">{f.currency} {f.amount.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <div className="flex items-center justify-between mb-4">
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Licitaciones Recientes</p>
             <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[9px] font-semibold text-amber-700 uppercase ring-1 ring-amber-100">
               {data.tenders.length} Procesos
             </span>
          </div>
          {data.tenders.length === 0 ? (
            <div className="py-8 text-center rounded-2xl border-2 border-dashed border-slate-200">
               <p className="text-xs font-bold text-slate-400">Sin procesos vigentes.</p>
            </div>
          ) : (
            <div className="grid gap-3">
              {data.tenders.map((t, i) => (
                <div key={i} className="group flex flex-col gap-2 rounded-2xl border border-slate-100 p-4 transition-all hover:border-amber-200 hover:bg-white">
                   <p className="text-xs font-bold text-slate-800 leading-tight group-hover:text-amber-700">{t.title}</p>
                   <div className="flex justify-between items-end mt-1">
                      <span className="font-mono text-[10px] font-bold text-slate-400 uppercase tracking-tight">Cód. {t.code}</span>
                      <span className="font-mono text-[11px] font-black text-slate-900">
                        {t.amount !== null ? `S/ ${t.amount.toLocaleString()}` : '—'}
                      </span>
                   </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {mode === 'journalist' && (
        <div className="flex flex-col gap-4">
          <MethodologyCard title="Nota metodológica: fiscalización legal">
            <p className="mb-2">
              Los impedimentos y multas administrativas se obtienen del{' '}
              <strong>OSCE</strong> a través del Registro Nacional de Proveedores Sancionados. Un
              impedimento impide contratar con el Estado durante un plazo; una multa es una sanción
              económica que no necesariamente genera inhabilitación.
            </p>
            <p className="mb-2">
              Las licitaciones recientes son procesos en los que la empresa ha participado según el
              SEACE. El monto mostrado es el presupuesto oficial del proceso, no el monto efectivamente
              contratado.
            </p>
            <p>
              Antes de afirmar que una empresa está inhabilitada para contratar con el Estado,
              verifique la vigencia exacta del impedimento en el portal del OSCE, ya que las
              sanciones pueden estar apeladas o extinguidas.
            </p>
          </MethodologyCard>

          <SourceBadge source="OSCE / SEACE" confidence="alta" />
          <VerificationNotice />

          <a
            href="https://www.osce.gob.pe"
            target="_blank"
            rel="noreferrer"
            className="group flex items-center justify-between rounded-xl bg-amber-700 p-4 text-white shadow-md shadow-amber-200 transition-all hover:bg-amber-800"
          >
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-white/20 p-2">
                <FileText className="h-4 w-4" />
              </div>
              <span className="text-xs font-black uppercase tracking-widest">Ficha OSCE Integral</span>
            </div>
            <ExternalLink className="h-4 w-4 opacity-50 group-hover:opacity-100 transition-opacity" />
          </a>
        </div>
      )}
    </div>
  );
};

export default LegalSection;

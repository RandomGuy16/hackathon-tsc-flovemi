import React from 'react';
import { UserMode, CompanyDashboardData } from '@/lib/types';
import { Ban, AlertCircle, Info, FileWarning } from 'lucide-react';

interface IllegalMiningSectionProps {
  data: CompanyDashboardData['illegalMining'];
  mode: UserMode;
}

const IllegalMiningSection: React.FC<IllegalMiningSectionProps> = ({ data, mode }) => {
  const hasIllegalRecords = data.length > 0;

  if (mode === 'citizen') {
    return (
      <div className="flex flex-col gap-4">
        {hasIllegalRecords ? (
          <>
            <div className="flex items-center gap-3 rounded-xl bg-rose-50 p-4 border border-rose-100">
              <Ban className="h-8 w-8 text-rose-600" />
              <div>
                <p className="text-sm font-bold text-rose-900">Actividad No Autorizada</p>
                <p className="text-lg font-black text-rose-700">DETECTADA</p>
              </div>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              Se han detectado trabajos mineros sin los permisos adecuados en esta zona. Esto es grave porque no hay control sobre el daño que causan.
            </p>
            <div className="space-y-3">
              {data.map((item, i) => (
                <div key={i} className="rounded-lg border-l-4 border-rose-500 bg-slate-50 p-3">
                  <p className="text-xs font-bold text-slate-800">{item.reason}</p>
                  <p className="mt-1 text-[10px] text-slate-500">Estado de trámites: {item.regularizationStatus}</p>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="flex items-center gap-3 rounded-xl bg-emerald-50 p-4 border border-emerald-100">
            <Info className="h-8 w-8 text-emerald-600" />
            <p className="text-sm font-bold text-emerald-900">Sin reportes de minería ilegal registrados.</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Registros de Ilegalidad</p>
        <span className={`text-[10px] font-black px-2 py-0.5 rounded ${hasIllegalRecords ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-500'}`}>
          {data.length} Hallazgos
        </span>
      </div>

      {data.length === 0 ? (
        <p className="text-sm text-slate-400 italic py-4 text-center">No se registran eventos en el catastro de minería ilegal.</p>
      ) : (
        <div className="space-y-4">
          {data.map((item, i) => (
            <div key={i} className="group relative rounded-xl border border-slate-100 p-4 transition-all hover:bg-slate-50">
              {/* Daltonism-friendly crosshatch pattern for illegal records */}
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none rounded-xl bg-[repeating-linear-gradient(45deg,#000,#000_1px,transparent_1px,transparent_6px),repeating-linear-gradient(-45deg,#000,#000_1px,transparent_1px,transparent_6px)]" />
              
              <div className="relative z-10">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-rose-500" />
                    <span className="text-[10px] font-mono font-bold text-slate-400">{item.detectedAt}</span>
                  </div>
                  <span className={`text-[10px] font-black uppercase ${
                    item.regularizationStatus === 'en_tramite' ? 'text-amber-600' : 'text-rose-600'
                  }`}>
                    {item.regularizationStatus}
                  </span>
                </div>
                
                <h5 className="mt-2 text-sm font-bold text-slate-900">{item.location}</h5>
                <p className="mt-1 text-xs text-slate-600 leading-snug">{item.reason}</p>
                
                {mode === 'official' && (
                  <div className="mt-3 flex items-center gap-4 border-t border-slate-100 pt-3">
                    <button className="flex items-center gap-1 text-[10px] font-bold text-blue-600 hover:underline">
                      <FileWarning className="h-3 w-3" />
                      Acta de Intervención
                    </button>
                    <button className="text-[10px] font-bold text-slate-400 hover:text-slate-600">
                      Coordenadas UTM
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default IllegalMiningSection;

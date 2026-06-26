import React from 'react';
import { UserMode, CompanyDashboardData } from '@/lib/types';
import { Ban, AlertCircle, Info, FileWarning, Search, ShieldBan, MapPin } from 'lucide-react';

interface IllegalMiningSectionProps {
  data: CompanyDashboardData['illegalMining'];
  mode: UserMode;
}

const IllegalMiningSection: React.FC<IllegalMiningSectionProps> = ({ data, mode }) => {
  const hasIllegalRecords = data.length > 0;

  if (mode === 'citizen') {
    return (
      <div className="flex flex-col gap-6 animate-fade-in">
        {hasIllegalRecords ? (
          <>
            <div className="flex items-center gap-4 rounded-3xl bg-rose-50 p-6 border border-rose-100 shadow-sm shadow-rose-50">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500 text-white shadow-lg shadow-rose-200">
                <ShieldBan className="h-8 w-8" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-500">Actividad Crítica</p>
                <p className="text-2xl font-outfit font-black text-rose-700 leading-none">DETECTADA</p>
              </div>
            </div>
            
            <p className="text-base font-medium text-slate-600 leading-relaxed">
              Existen registros de actividades mineras no autorizadas en las inmediaciones de esta unidad. Representa un riesgo severo para el ecosistema.
            </p>
            
            <div className="space-y-3">
              {data.map((item, i) => (
                <div key={i} className="group relative overflow-hidden rounded-2xl border border-rose-200 bg-white p-5 shadow-sm">
                  {/* Subtle crosshatch bg */}
                  <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[repeating-linear-gradient(45deg,#f43f5e,#f43f5e_1px,transparent_1px,transparent_8px)]" />
                  <div className="relative z-10">
                    <p className="text-xs font-black text-rose-900 leading-snug mb-2">{item.reason}</p>
                    <div className="flex items-center justify-between">
                       <div className="flex items-center gap-1.5 text-[10px] font-bold text-rose-500">
                          <MapPin className="h-3 w-3" />
                          <span className="truncate max-w-[150px]">{item.location}</span>
                       </div>
                       <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                         {item.regularizationStatus}
                       </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-4 py-12 text-center rounded-3xl bg-emerald-50/50 border-2 border-dashed border-emerald-100">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-emerald-500 shadow-sm">
               <Info className="h-8 w-8" />
            </div>
            <p className="text-sm font-bold text-emerald-800 uppercase tracking-widest px-6">Área libre de minería ilegal registrada.</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      <div className="flex items-center justify-between border-b border-slate-100 pb-5 px-1">
        <div className="flex flex-col gap-1">
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-nowrap">Catastro de Ilegalidad</p>
           <h4 className="text-2xl font-outfit font-black text-slate-900">{data.length} Eventos</h4>
        </div>
        <div className={`h-10 w-10 rounded-xl flex flex-shrink-0 items-center justify-center ${hasIllegalRecords ? 'bg-rose-500 text-white shadow-lg shadow-rose-100' : 'bg-slate-100 text-slate-400'}`}>
           <Search className="h-5 w-5" />
        </div>
      </div>

      {data.length === 0 ? (
        <div className="py-20 text-center rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
           <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Sin registros históricos.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {data.map((item, i) => (
            <div key={i} className="group relative flex flex-col gap-5 rounded-3xl border border-slate-200 bg-white p-6 transition-all duration-300 hover:border-rose-300 hover:shadow-2xl hover:shadow-rose-100/50 overflow-hidden">
              {/* Daltonism-friendly crosshatch pattern */}
              <div className="absolute inset-0 opacity-[0.04] pointer-events-none bg-[repeating-linear-gradient(-45deg,#000,#000_1px,transparent_1px,transparent_10px)]" />
              
              <div className="relative z-10">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2 bg-rose-50 px-3 py-1 rounded-full ring-1 ring-rose-100">
                    <AlertCircle className="h-3.5 w-3.5 text-rose-500" />
                    <span className="font-mono text-[10px] font-black text-rose-700 uppercase">{item.detectedAt || 'HISTÓRICO'}</span>
                  </div>
                  <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-lg shadow-sm border ${
                    item.regularizationStatus === 'sin_tramite' ? 'bg-rose-900 text-white border-rose-900' : 'bg-slate-900 text-white border-slate-900'
                  }`}>
                    {item.regularizationStatus}
                  </span>
                </div>
                
                <div className="flex flex-col gap-2">
                   <div className="flex items-center gap-1.5">
                      <MapPin className="h-3 w-3 text-slate-400" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 truncate">{item.location}</span>
                   </div>
                   <p className="font-outfit text-base font-extrabold text-slate-900 group-hover:text-rose-700 transition-colors leading-snug">
                     {item.reason}
                   </p>
                </div>
                
                {mode === 'official' && (
                  <div className="mt-5 grid grid-cols-2 gap-2 pt-4 border-t border-slate-100">
                    <button className="flex items-center justify-center gap-2 rounded-xl bg-slate-100 py-2.5 text-[9px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-200 transition-all cursor-pointer">
                      <FileWarning className="h-3.5 w-3.5" />
                      Acta Interv.
                    </button>
                    <button className="rounded-xl border border-slate-200 py-2.5 text-[9px] font-black uppercase tracking-widest text-slate-400 hover:bg-white hover:text-slate-900 hover:border-slate-900 transition-all cursor-pointer">
                      COORD. UTM
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

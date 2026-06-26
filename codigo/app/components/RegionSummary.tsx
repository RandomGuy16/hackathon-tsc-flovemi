import React from 'react';
import { RegionResponse } from '@/lib/types';
import { Pickaxe, AlertCircle, Building } from 'lucide-react';

interface RegionSummaryProps {
  data: RegionResponse;
}

const RegionSummary: React.FC<RegionSummaryProps> = ({ data }) => {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-1">
        <span className="text-xs font-black tracking-widest text-slate-400 uppercase">Región</span>
        <h2 className="font-serif text-3xl font-black text-slate-900">{data.region}</h2>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 text-slate-400">
             <Building className="h-4 w-4" />
             <span className="text-[10px] font-bold uppercase tracking-wider">Empresas</span>
          </div>
          <p className="mt-2 text-2xl font-black text-slate-900">{data.companies.length}</p>
        </div>
        
        <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 text-rose-400">
             <AlertCircle className="h-4 w-4" />
             <span className="text-[10px] font-bold uppercase tracking-wider">Conflictos</span>
          </div>
          <p className="mt-2 text-2xl font-black text-rose-600">{data.conflicts.length}</p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="rounded-2xl border border-slate-100 bg-blue-50 p-4">
           <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Inversión Total</p>
           <p className="mt-1 text-xl font-black text-blue-700">
             S/ {data.projects.reduce((acc, p) => acc + p.budget, 0).toLocaleString()}
           </p>
        </div>

        <div className="space-y-3">
          <h4 className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-wider">
            <Pickaxe className="h-3.5 w-3.5" />
            Proyectos Mineros
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {['de_acuerdo', 'paralizado', 'en_tramite', 'cerrado'].map((status) => {
              const count = data.miningProjects.filter(p => p.status === status).length;
              return (
                <div key={status} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-[10px] font-bold">
                  <span className="text-slate-500 capitalize">{status.replace('_', ' ')}</span>
                  <span className="text-slate-900">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-wider">
            <AlertCircle className="h-3.5 w-3.5" />
            Minería Ilegal
          </h4>
          <div className="rounded-xl border border-rose-100 bg-rose-50/50 p-3">
            <p className="text-xs font-bold text-rose-900">
              {data.illegalMining.length} focos detectados en la región
            </p>
            <p className="mt-1 text-[10px] text-rose-700 leading-tight">
              Se requiere intervención inmediata en zonas de amortiguamiento.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegionSummary;

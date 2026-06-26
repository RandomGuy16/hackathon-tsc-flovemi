'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { useParams } from 'next/navigation';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import RiskBadge from '@/app/components/RiskBadge';
import RegionSummary from '@/app/components/RegionSummary';
import { useRegionSummary } from '@/app/hooks/useRegionSummary';
import { Map as MapIcon, List as ListIcon } from 'lucide-react';

const RiskMap = dynamic(() => import('@/app/components/RiskMap'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-slate-100 text-slate-400 font-bold">
      Cargando Mapa...
    </div>
  ),
});

export default function RegionPage() {
  const params = useParams();
  const region = typeof params.region === 'string' ? decodeURIComponent(params.region) : '';
  const { data, loading, error } = useRegionSummary(region);
  const [view, setView] = useState<'map' | 'list'>('map');

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      {loading ? (
        <main className="flex flex-grow items-center justify-center">
          <p className="text-lg font-bold text-slate-400">Cargando resumen regional...</p>
        </main>
      ) : error || !data ? (
        <main className="flex flex-grow items-center justify-center">
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-8 text-center">
            <p className="font-bold text-rose-700">
              {error || 'No hay datos para esta región.'}
            </p>
          </div>
        </main>
      ) : (
        <div className="flex h-[calc(100vh-64px)] flex-col overflow-hidden lg:flex-row">
          {/* Mobile Toggle */}
          <div className="flex border-b border-slate-200 bg-white p-2 lg:hidden">
            <button
              onClick={() => setView('map')}
              className={`flex flex-1 items-center justify-center gap-2 py-2 text-xs font-bold uppercase transition-all ${
                view === 'map' ? 'bg-slate-900 text-white rounded-lg' : 'text-slate-400'
              }`}
            >
              <MapIcon className="h-4 w-4" />
              Mapa
            </button>
            <button
              onClick={() => setView('list')}
              className={`flex flex-1 items-center justify-center gap-2 py-2 text-xs font-bold uppercase transition-all ${
                view === 'list' ? 'bg-slate-900 text-white rounded-lg' : 'text-slate-400'
              }`}
            >
              <ListIcon className="h-4 w-4" />
              Detalles
            </button>
          </div>

          {/* Side Panel */}
          <aside
            className={`w-full flex-shrink-0 overflow-y-auto border-r border-slate-200 bg-slate-50 lg:w-[400px] ${
              view === 'list' ? 'block' : 'hidden lg:block'
            }`}
          >
            <RegionSummary data={data} />

            <div className="border-t border-slate-200 p-6">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">
                Empresas en la Región
              </h3>
              <div className="space-y-3">
                {data.companies.map((c) => (
                  <div
                    key={c.ruc}
                    className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:border-blue-200 transition-colors cursor-pointer"
                  >
                    <p className="font-serif font-bold text-slate-900 leading-tight">
                      {c.razonSocial}
                    </p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-[10px] font-mono text-slate-400">RUC: {c.ruc}</span>
                      <RiskBadge level={c.riskLevel} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          {/* Map Content */}
          <main
            className={`flex-1 relative ${
              view === 'map' ? 'block' : 'hidden lg:block'
            }`}
          >
            <RiskMap data={data} />
          </main>
        </div>
      )}

      <Footer />
    </div>
  );
}

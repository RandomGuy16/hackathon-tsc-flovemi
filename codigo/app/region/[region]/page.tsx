'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import RiskBadge from '@/app/components/RiskBadge';
import RegionSummary from '@/app/components/RegionSummary';
import { useRegionSummary } from '@/app/hooks/useRegionSummary';
import { Map as MapIcon, List as ListIcon, ChevronRight, ArrowLeft, Filter } from 'lucide-react';

const RiskMap = dynamic(() => import('@/app/components/RiskMap'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-slate-100">
      <div className="flex flex-col items-center gap-3 text-slate-400">
        <MapIcon className="h-12 w-12 animate-pulse" />
        <span className="text-[10px] font-black uppercase tracking-widest">Inicializando GIS...</span>
      </div>
    </div>
  ),
});

function SkeletonSidebar() {
  return (
    <div className="flex flex-col gap-8 p-8">
      <div className="flex flex-col gap-3">
        <div className="h-4 w-20 rounded-full shimmer-bg" />
        <div className="h-10 w-48 rounded-xl shimmer-bg" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        {[1, 2].map((i) => (
          <div key={i} className="rounded-2xl border border-slate-100 p-5">
            <div className="mb-3 h-3 w-16 rounded shimmer-bg" />
            <div className="h-8 w-12 rounded-lg shimmer-bg" />
          </div>
        ))}
      </div>
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-2xl border border-slate-100 p-5">
            <div className="mb-2 h-5 w-3/4 rounded shimmer-bg" />
            <div className="h-3 w-1/2 rounded shimmer-bg" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function RegionPage() {
  const params = useParams();
  const region = typeof params.region === 'string' ? decodeURIComponent(params.region) : '';
  const { data, loading, error } = useRegionSummary(region);
  const [view, setView] = useState<'map' | 'list'>('map');

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />

      {loading ? (
        <div className="flex h-[calc(100vh-80px)] flex-col overflow-hidden lg:flex-row">
          <aside className="w-full flex-shrink-0 border-r border-slate-200 bg-slate-50 lg:w-[450px]">
            <SkeletonSidebar />
          </aside>
          <main className="flex-1 bg-slate-100" />
        </div>
      ) : error || !data ? (
        <main className="flex flex-grow items-center justify-center bg-slate-50 p-8">
          <div className="max-w-lg rounded-[2.5rem] border border-rose-200 bg-white p-16 text-center shadow-2xl shadow-rose-100">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-rose-50 text-rose-500">
              <MapIcon className="h-10 w-10" />
            </div>
            <h2 className="font-outfit text-3xl font-black text-slate-900">Región no disponible</h2>
            <p className="mt-4 font-medium text-slate-500">
              {error || 'No logramos procesar la información geográfica para esta ubicación.'}
            </p>
            <Link
              href="/"
              className="mt-10 inline-flex items-center gap-3 rounded-2xl bg-slate-900 px-8 py-4 text-sm font-black uppercase tracking-widest text-white transition-all hover:bg-slate-800"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver al Mapa Nacional
            </Link>
          </div>
        </main>
      ) : (
        <div className="flex h-[calc(100vh-80px)] flex-col overflow-hidden lg:flex-row">
          {/* Mobile toggle */}
          <div className="flex gap-2 border-b border-slate-200 bg-white p-3 lg:hidden">
            <button
              onClick={() => setView('map')}
              className={`flex flex-1 items-center justify-center gap-2 rounded-2xl py-3 text-xs font-black uppercase tracking-[0.1em] transition-all duration-300 ${
                view === 'map'
                  ? 'bg-amber-700 text-white shadow-xl shadow-amber-900/20'
                  : 'bg-slate-100 text-slate-500'
              }`}
            >
              <MapIcon className="h-4 w-4" />
              Vista de Mapa
            </button>
            <button
              onClick={() => setView('list')}
              className={`flex flex-1 items-center justify-center gap-2 rounded-2xl py-3 text-xs font-black uppercase tracking-[0.1em] transition-all duration-300 ${
                view === 'list'
                  ? 'bg-amber-700 text-white shadow-xl shadow-amber-900/20'
                  : 'bg-slate-100 text-slate-500'
              }`}
            >
              <ListIcon className="h-4 w-4" />
              Resultados
            </button>
          </div>

          {/* Side panel */}
          <aside
            className={`w-full flex-shrink-0 overflow-y-auto border-r border-slate-200 bg-slate-50 lg:w-[450px] ${
              view === 'list' ? 'block' : 'hidden lg:block'
            }`}
          >
            <div className="sticky top-0 z-20 border-b border-slate-200 bg-slate-50 p-4 lg:px-8 lg:py-6">
              <Link
                href="/"
                className="group mb-4 inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 transition-colors hover:text-amber-700"
              >
                <ArrowLeft className="h-3 w-3" /> Mapa Nacional
              </Link>
              <div className="flex items-end justify-between">
                <div>
                  <span className="mb-1 block text-[10px] font-black uppercase tracking-[0.3em] text-amber-700">
                    Región Seleccionada
                  </span>
                  <h1 className="font-outfit text-4xl font-black tracking-tighter text-slate-900">
                    {data.region}
                  </h1>
                </div>
                <button className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-400 shadow-sm transition-all hover:border-amber-300 hover:text-amber-700">
                  <Filter className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="px-4 py-8 lg:px-8">
              <RegionSummary data={data} />

              <div className="mt-12 space-y-6">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                  Unidades Mineras ({data.companies.length})
                </h3>

                <div className="space-y-3">
                  {data.companies.map((c) => (
                    <Link
                      key={c.ruc}
                      href={`/empresa/${c.ruc}`}
                      className="group flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-amber-300 hover:shadow-xl hover:shadow-slate-200/50"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <p className="font-outfit text-lg font-extrabold leading-[1.2] text-slate-900 transition-colors group-hover:text-amber-900">
                            {c.razonSocial}
                          </p>
                          <p className="mt-1.5 font-mono text-[11px] font-bold uppercase tracking-wider text-slate-400">
                            RUC {c.ruc}
                          </p>
                        </div>
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-slate-50 transition-colors group-hover:bg-amber-50 group-hover:text-amber-700">
                          <ChevronRight className="h-5 w-5" />
                        </div>
                      </div>
                      <div className="flex items-center gap-3 border-t border-slate-50 pt-4">
                        <RiskBadge level={c.riskLevel} />
                      </div>
                    </Link>
                  ))}

                  {data.companies.length === 0 && (
                    <div className="py-16 text-center">
                      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-300">
                        <MapIcon className="h-8 w-8" />
                      </div>
                      <p className="text-sm font-bold text-slate-400">Sin concesiones registradas.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </aside>

          {/* Map */}
          <main
            className={`relative flex-1 bg-slate-100 ${view === 'map' ? 'block' : 'hidden lg:block'}`}
          >
            {/* Map legend floating pill */}
            <div className="absolute bottom-10 left-1/2 z-[400] -translate-x-1/2 flex items-center gap-2 rounded-full glass-effect px-6 py-3 shadow-2xl">
              <div className="flex items-center gap-2 border-r border-slate-200 pr-4">
                <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-rose-500" />
                <span className="text-nowrap text-[10px] font-black uppercase tracking-wider text-slate-600">Riesgo Alto</span>
              </div>
              <div className="flex items-center gap-2 pl-2">
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                <span className="text-nowrap text-[10px] font-black uppercase tracking-wider text-slate-600">En Regla</span>
              </div>
            </div>

            <RiskMap data={data} />
          </main>
        </div>
      )}

      <Footer />
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import SearchBar from '@/app/components/SearchBar';
import SearchResultItem from '@/app/components/SearchResultItem';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import { useCompanySearch } from '@/app/hooks/useCompanySearch';
import { ShieldAlert, Leaf, Users, ArrowRight } from 'lucide-react';

const featureCards = [
  {
    Icon: ShieldAlert,
    title: 'Seguridad Laboral',
    description:
      'Accidentes fatales y enfermedades ocupacionales reportados al MINEM por cada unidad minera del país.',
    metric: '47%',
    metricLabel: 'proyectos con riesgos',
    iconBg: 'bg-rose-50',
    iconColor: 'text-rose-600',
    metricBg: 'bg-rose-50 text-rose-700',
  },
  {
    Icon: Leaf,
    title: 'Impacto Ambiental',
    description:
      'Sanciones OEFA firmes y monitoreo de calidad del aire en estaciones cercanas a proyectos activos.',
    metric: '14 000+',
    metricLabel: 'sanciones registradas',
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
    metricBg: 'bg-emerald-50 text-emerald-700',
  },
  {
    Icon: Users,
    title: 'Conflictividad Social',
    description:
      'Conflictos activos reportados por la Defensoría del Pueblo y el PCM en todo el territorio peruano.',
    metric: '180+',
    metricLabel: 'conflictos activos',
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-700',
    metricBg: 'bg-amber-50 text-amber-800',
  },
] as const;

function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="h-14 w-14 flex-shrink-0 rounded-2xl shimmer-bg" />
        <div className="flex flex-1 flex-col gap-2">
          <div className="h-5 w-3/4 rounded-lg shimmer-bg" />
          <div className="h-3 w-1/2 rounded shimmer-bg" />
        </div>
      </div>
      <div className="mt-6 flex flex-col gap-3">
        <div className="h-3 w-full rounded shimmer-bg" />
        <div className="h-3 w-5/6 rounded shimmer-bg" />
      </div>
    </div>
  );
}

export default function HomePage() {
  const [query, setQuery] = useState('');
  const { results, loading, error } = useCompanySearch(query);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden bg-slate-900 py-32 text-white">
        {/* Topographic contour pattern */}
        <div className="topo-pattern pointer-events-none absolute inset-0" />

        {/* Copper / amber glow blobs */}
        <div className="pointer-events-none absolute -top-40 left-1/4 h-[30rem] w-[30rem] rounded-full bg-amber-700/15 blur-[120px]" />
        <div className="pointer-events-none absolute -bottom-40 right-1/4 h-[28rem] w-[28rem] rounded-full bg-amber-600/10 blur-[100px]" />

        <div className="container relative z-10 flex flex-col items-center px-6 text-center">
          {/* Live badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-amber-500/25 bg-amber-500/8 px-5 py-2 text-[11px] font-black uppercase tracking-[0.2em] text-amber-300 shadow-xl shadow-slate-950/50 animate-fade-in">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-500" />
            </span>
            Plataforma Nacional de Transparencia Minera
          </div>

          <h1 className="max-w-4xl animate-fade-in font-outfit text-6xl font-black leading-[1.05] tracking-tight sm:text-7xl lg:text-8xl">
            <span className="text-slate-100">Vigilancia Minera</span>{' '}
            <br />
            <span className="bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent">
              en Tiempo Real
            </span>
          </h1>

          <p className="mt-8 max-w-2xl animate-fade-in text-lg font-medium leading-relaxed text-slate-400 sm:text-xl">
            Acceso ciudadano a sanciones, accidentes y conflictos sociales de todas las
            empresas mineras operando en el Perú.
          </p>

          <div className="mt-14 w-full flex justify-center animate-slide-up">
            <SearchBar onSearch={setQuery} />
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="container mx-auto flex-grow px-6 py-24">
        {query.length >= 3 ? (
          <div className="flex flex-col gap-10 animate-fade-in">
            <div className="flex items-end justify-between border-b border-slate-200 pb-8">
              <div className="flex flex-col gap-2">
                <h2 className="font-outfit text-3xl font-black tracking-tight text-slate-900">
                  Resultados de Búsqueda
                </h2>
                <p className="font-medium text-slate-500">
                  Buscando coincidencias para &ldquo;{query}&rdquo;
                </p>
              </div>
              <span className="rounded-full bg-amber-50 px-4 py-2 text-xs font-black uppercase tracking-widest text-amber-700 ring-1 ring-amber-200">
                {loading ? 'Consultando...' : `${results.length} Hallazgos`}
              </span>
            </div>

            {error && (
              <div className="rounded-3xl border border-rose-200 bg-rose-50 p-10 text-center">
                <p className="font-outfit text-xl font-black text-rose-800">Error en el sistema</p>
                <p className="mt-2 font-medium text-rose-600">{error}</p>
              </div>
            )}

            {loading && (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((i) => <SkeletonCard key={i} />)}
              </div>
            )}

            {!loading && !error && results.length > 0 && (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {results.map((company) => (
                  <SearchResultItem key={company.ruc} company={company} />
                ))}
              </div>
            )}

            {!loading && !error && results.length === 0 && (
              <div className="flex flex-col items-center justify-center py-32 text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 text-slate-300">
                  <Users className="h-10 w-10" />
                </div>
                <h3 className="mt-6 font-outfit text-2xl font-black text-slate-900">Sin coincidencias</h3>
                <p className="mt-2 max-w-xs font-medium text-slate-500">
                  No encontramos empresas con ese nombre o RUC en la base nacional.
                </p>
                <button
                  onClick={() => setQuery('')}
                  className="mt-8 rounded-xl bg-slate-900 px-8 py-3 text-sm font-black uppercase tracking-widest text-white transition-all hover:bg-slate-800 hover:shadow-xl active:scale-95"
                >
                  Nueva Búsqueda
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-16">
            <div className="flex flex-col items-center gap-4 text-center">
              <h2 className="font-outfit text-4xl font-black tracking-tight text-slate-900">
                Ejes de Fiscalización
              </h2>
              <p className="max-w-xl font-medium text-slate-500">
                Monitoreo constante a través de interoperabilidad con OEFA, MINEM y Defensoría.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {featureCards.map(({ Icon, title, description, metric, metricLabel, iconBg, iconColor, metricBg }, i) => (
                <div
                  key={title}
                  className="group flex flex-col gap-7 rounded-2xl border border-slate-200 bg-white p-8 transition-all duration-300 hover:-translate-y-1 hover:border-amber-200 hover:shadow-xl hover:shadow-slate-200/50 animate-slide-up"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl ${iconBg} transition-all duration-300 group-hover:scale-110`}>
                    <Icon className={`h-7 w-7 ${iconColor}`} />
                  </div>

                  <div className="flex flex-col gap-3">
                    <h3 className="font-outfit text-2xl font-black tracking-tight text-slate-900">
                      {title}
                    </h3>
                    <p className="text-sm font-medium leading-relaxed text-slate-500">{description}</p>
                  </div>

                  <div
                    className={`mt-auto flex flex-col gap-1 rounded-2xl p-5 ${metricBg} ring-1 ring-inset ring-black/5`}
                  >
                    <span className="font-mono text-3xl font-black tracking-tighter">{metric}</span>
                    <span className="text-[10px] font-semibold uppercase tracking-widest opacity-75">
                      {metricLabel}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100">
                    Explorar datos <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}

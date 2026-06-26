'use client';

import React, { useState } from 'react';
import SearchBar from '@/app/components/SearchBar';
import SearchResultItem from '@/app/components/SearchResultItem';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import { useCompanySearch } from '@/app/hooks/useCompanySearch';

export default function HomePage() {
  const [query, setQuery] = useState('');
  const { results, loading, error } = useCompanySearch(query);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-900 py-24 text-white">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg className="h-full w-full" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,500 C200,400 300,600 500,500 S800,400 1000,500" stroke="currentColor" fill="none" strokeWidth="2" />
            <path d="M0,600 C200,500 300,700 500,600 S800,500 1000,600" stroke="currentColor" fill="none" strokeWidth="2" />
            <path d="M0,700 C200,600 300,800 500,700 S800,600 1000,700" stroke="currentColor" fill="none" strokeWidth="2" />
          </svg>
        </div>

        <div className="container relative z-10 flex flex-col items-center px-4 text-center">
          <h1 className="max-w-3xl font-serif text-5xl font-black leading-tight sm:text-6xl text-balance">
            MineraWatch - Vigilancia Minera del Perú
          </h1>
          <p className="mt-6 max-w-xl text-lg font-medium text-slate-300">
            Transparencia radical sobre la actividad minera. ¿Qué está pasando cerca de donde vives?
          </p>

          <div className="mt-12 w-full flex justify-center">
            <SearchBar onSearch={setQuery} />
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="container mx-auto flex-grow px-4 py-16">
        {query.length >= 3 ? (
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">
                Resultados de Búsqueda
              </h2>
              <span className="text-sm font-bold text-slate-400">
                {loading ? 'Buscando...' : `${results.length} empresas encontradas`}
              </span>
            </div>

            {error && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 p-6 text-center">
                <p className="font-bold text-rose-700">Error al buscar: {error}</p>
              </div>
            )}

            {!loading && !error && (
              <>
                {results.length > 0 ? (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {results.map((company) => (
                      <SearchResultItem key={company.ruc} company={company} />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <p className="text-lg font-bold text-slate-400">No se encontraron empresas con esos datos.</p>
                    <button
                      onClick={() => setQuery('')}
                      className="mt-4 text-blue-600 font-bold hover:underline"
                    >
                      Limpiar búsqueda
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        ) : (
          <div className="grid gap-12 md:grid-cols-3">
            <div className="flex flex-col gap-3">
              <div className="h-1 bg-blue-600 w-12" />
              <h3 className="font-serif text-xl font-bold text-slate-900">Seguridad Laboral</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Acceso directo a reportes de accidentes fatales y enfermedades ocupacionales por unidad minera.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <div className="h-1 bg-emerald-600 w-12" />
              <h3 className="font-serif text-xl font-bold text-slate-900">Impacto Ambiental</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Monitoreo de sanciones OEFA y calidad del aire en estaciones cercanas a proyectos mineros.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <div className="h-1 bg-rose-600 w-12" />
              <h3 className="font-serif text-xl font-bold text-slate-900">Conflictividad Social</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Seguimiento de conflictos activos reportados por la Defensoría del Pueblo en todo el país.
              </p>
            </div>
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}

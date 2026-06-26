'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useUserMode } from '@/app/context/UserModeContext';
import { useCompanyDashboard } from '@/app/hooks/useCompanyDashboard';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import RiskScore from '@/app/components/RiskScore';
import SectionCard from '@/app/components/SectionCard';
import SafetySection from '@/app/components/SafetySection';
import EnvironmentalSection from '@/app/components/EnvironmentalSection';
import LegalSection from '@/app/components/LegalSection';
import SocialSection from '@/app/components/SocialSection';
import InvestmentSection from '@/app/components/InvestmentSection';
import MiningProjectsSection from '@/app/components/MiningProjectsSection';
import IllegalMiningSection from '@/app/components/IllegalMiningSection';
import DataSourceBanner from '@/app/components/DataSourceBanner';
import {
  ShieldCheck, Leaf, Scale, Users, TrendingUp, Pickaxe, Ban,
  Map as MapIcon, RefreshCw, ArrowLeft, Share2, Download,
} from 'lucide-react';

function SkeletonSection() {
  return (
    <div className="flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center gap-4 p-7">
        <div className="h-12 w-12 rounded-2xl shimmer-bg" />
        <div className="h-6 w-40 rounded-lg shimmer-bg" />
      </div>
      <div className="flex flex-col gap-4 border-t border-slate-100 p-7">
        <div className="h-4 w-full rounded-lg shimmer-bg" />
        <div className="h-4 w-5/6 rounded-lg shimmer-bg" />
        <div className="mt-2 h-10 w-1/2 rounded-2xl shimmer-bg" />
      </div>
    </div>
  );
}

export default function CompanyDashboardPage() {
  const params = useParams();
  const ruc = typeof params.ruc === 'string' ? params.ruc : '';
  const { mode } = useUserMode();
  const { data, loading, error } = useCompanyDashboard(ruc);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-slate-50">
        <Header />
        <main className="container mx-auto flex-grow px-6 py-12">
          <div className="mb-12 flex flex-col gap-5">
            <div className="h-4 w-32 rounded-full shimmer-bg" />
            <div className="h-12 w-3/4 rounded-2xl shimmer-bg" />
            <div className="h-6 w-48 rounded-xl shimmer-bg" />
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 7 }).map((_, i) => (
              <SkeletonSection key={i} />
            ))}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex min-h-screen flex-col bg-slate-50">
        <Header />
        <main className="container mx-auto flex flex-grow items-center justify-center px-6">
          <div className="rounded-[3rem] border border-rose-200 bg-white p-16 text-center shadow-2xl shadow-rose-100">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-rose-50 text-rose-500">
              <Ban className="h-10 w-10" />
            </div>
            <h2 className="font-outfit text-3xl font-black text-slate-900">Error de consulta</h2>
            <p className="mt-4 max-w-sm font-medium text-slate-500">
              {error || 'No logramos ubicar la empresa en nuestra base de datos nacional.'}
            </p>
            <Link
              href="/"
              className="mt-10 inline-flex items-center gap-3 rounded-2xl bg-slate-900 px-8 py-4 text-sm font-black uppercase tracking-widest text-white transition-all hover:bg-slate-800 hover:shadow-xl active:scale-95"
            >
              <ArrowLeft className="h-4 w-4" />
              Regresar al Portal
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const region = data.social.conflicts[0]?.region || '';

  return (
    <div className="flex min-h-screen flex-col bg-slate-50/60">
      <Header />

      <main className="container mx-auto flex-grow px-6 py-12 animate-fade-in">
        {/* Page header */}
        <div className="mb-12 flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex flex-col gap-5">
            <Link
              href="/"
              className="group inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 transition-colors hover:text-amber-700"
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-white transition-colors group-hover:border-amber-300 group-hover:bg-amber-50">
                <ArrowLeft className="h-3 w-3" />
              </div>
              Buscador Nacional
            </Link>

            <div className="flex flex-col gap-3">
              <h1 className="font-outfit text-4xl font-black leading-[1.1] tracking-tight text-slate-900 lg:text-6xl">
                {data.razonSocial}
              </h1>
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 shadow-sm">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">RUC</span>
                  <span className="font-mono text-sm font-black text-slate-900">{data.ruc}</span>
                </div>
                {data.summary.lastSyncedAt && (
                  <div className="flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-2">
                    <RefreshCw className="h-3.5 w-3.5 text-slate-400" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                      Sincronizado:{' '}
                      {new Date(data.summary.lastSyncedAt).toLocaleDateString('es-PE', {
                        day: '2-digit', month: 'short', year: 'numeric',
                      })}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button className="flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-[10px] font-medium text-slate-400 transition-colors hover:text-slate-700">
                <Share2 className="h-3.5 w-3.5" /> Compartir
              </button>
              <button className="flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-[10px] font-medium text-slate-400 transition-colors hover:text-slate-700">
                <Download className="h-3.5 w-3.5" /> PDF
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-stretch">
            <RiskScore score={data.summary.riskScore} level={data.summary.riskLevel} />
            {region && (
              <Link
                href={`/region/${encodeURIComponent(region)}`}
                className="group relative flex flex-col justify-center gap-2 overflow-hidden rounded-[2rem] bg-slate-900 p-8 text-white shadow-2xl transition-all hover:-translate-y-1 hover:bg-slate-800 active:translate-y-0"
              >
                <div className="pointer-events-none absolute -right-4 -top-4 h-24 w-24 rounded-full bg-amber-600/20 blur-2xl transition-colors group-hover:bg-amber-500/30" />
                <MapIcon className="h-8 w-8 text-amber-400 transition-transform group-hover:scale-110" />
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Explorar Región</p>
                  <p className="font-outfit text-xl font-extrabold">{region}</p>
                </div>
              </Link>
            )}
          </div>
        </div>

        {mode === 'journalist' && (
          <div className="mb-10">
            <DataSourceBanner lastSyncedAt={data.summary.lastSyncedAt ?? undefined} />
          </div>
        )}

        {/* 7 Sections Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          <SectionCard title="Seguridad Laboral"    icon={<ShieldCheck />}><SafetySection data={data.safety} mode={mode} /></SectionCard>
          <SectionCard title="Impacto Ambiental"   icon={<Leaf />}><EnvironmentalSection data={data.environmental} mode={mode} /></SectionCard>
          <SectionCard title="Fiscalización Legal" icon={<Scale />}><LegalSection data={data.legal} mode={mode} /></SectionCard>
          <SectionCard title="Conflictividad Social" icon={<Users />}><SocialSection data={data.social} mode={mode} /></SectionCard>
          <SectionCard title="Inversión Pública"   icon={<TrendingUp />}><InvestmentSection data={data.investment} mode={mode} /></SectionCard>
          <SectionCard title="Proyectos Mineros"   icon={<Pickaxe />}><MiningProjectsSection data={data.miningProjects} mode={mode} /></SectionCard>
          <SectionCard title="Minería Ilegal"      icon={<Ban />}><IllegalMiningSection data={data.illegalMining} mode={mode} /></SectionCard>
        </div>
      </main>

      <Footer />
    </div>
  );
}

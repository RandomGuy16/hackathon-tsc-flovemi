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
import {
  ShieldCheck,
  Leaf,
  Scale,
  Users,
  TrendingUp,
  Pickaxe,
  Ban,
  Map as MapIcon,
  RefreshCw,
} from 'lucide-react';

export default function CompanyDashboardPage() {
  const params = useParams();
  const ruc = typeof params.ruc === 'string' ? params.ruc : '';
  const { mode } = useUserMode();
  const { data, loading, error } = useCompanyDashboard(ruc);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="container mx-auto flex flex-grow items-center justify-center px-4">
          <p className="text-lg font-bold text-slate-400">Cargando ficha de riesgo...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="container mx-auto flex flex-grow items-center justify-center px-4">
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-8 text-center">
            <p className="font-bold text-rose-700">
              {error || 'No se encontró la empresa solicitada.'}
            </p>
            <Link href="/" className="mt-4 inline-block text-blue-600 font-bold hover:underline">
              ← Volver al buscador
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const region = data.social.conflicts[0]?.region || '';

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="container mx-auto flex-grow px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex flex-col gap-2">
            <Link href="/" className="text-xs font-bold text-slate-400 hover:text-blue-600 uppercase tracking-widest">
              ← Volver a Búsqueda
            </Link>
            <h1 className="font-serif text-4xl font-black text-slate-900 lg:text-5xl">
              {data.razonSocial}
            </h1>
            <div className="flex items-center gap-4 text-slate-500">
              <span className="text-sm font-mono font-bold bg-slate-100 px-2 py-0.5 rounded">RUC: {data.ruc}</span>
              <div className="flex items-center gap-1 text-xs">
                <RefreshCw className="h-3 w-3" />
                <span>Sincronizado: {data.summary.lastSyncedAt ? new Date(data.summary.lastSyncedAt).toLocaleDateString() : 'No disponible'}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <RiskScore score={data.summary.riskScore} level={data.summary.riskLevel} />
            {region && (
              <Link
                href={`/region/${encodeURIComponent(region)}`}
                className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-4 text-sm font-bold text-white transition-all hover:bg-slate-800 active:scale-[0.98]"
              >
                <MapIcon className="h-5 w-5" />
                Ver en mapa
              </Link>
            )}
          </div>
        </div>

        {/* 7 Sections Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <SectionCard title="Seguridad" icon={<ShieldCheck />}>
            <SafetySection data={data.safety} mode={mode} />
          </SectionCard>

          <SectionCard title="Medio Ambiente" icon={<Leaf />}>
            <EnvironmentalSection data={data.environmental} mode={mode} />
          </SectionCard>

          <SectionCard title="Legal" icon={<Scale />}>
            <LegalSection data={data.legal} mode={mode} />
          </SectionCard>

          <SectionCard title="Conflicto Social" icon={<Users />}>
            <SocialSection data={data.social} mode={mode} />
          </SectionCard>

          <SectionCard title="Inversión Pública" icon={<TrendingUp />}>
            <InvestmentSection data={data.investment} mode={mode} />
          </SectionCard>

          <SectionCard title="Proyectos Mineros" icon={<Pickaxe />}>
            <MiningProjectsSection data={data.miningProjects} mode={mode} />
          </SectionCard>

          <SectionCard title="Minería Ilegal" icon={<Ban />}>
            <IllegalMiningSection data={data.illegalMining} mode={mode} />
          </SectionCard>
        </div>
      </main>

      <Footer />
    </div>
  );
}

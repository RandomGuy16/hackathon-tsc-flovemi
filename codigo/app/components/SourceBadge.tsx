'use client';

import React from 'react';
import { Database, Calendar } from 'lucide-react';

interface SourceBadgeProps {
  source: string;
  date?: string;
  confidence?: 'alta' | 'media' | 'baja';
}

const CONFIDENCE_COLORS = {
  alta: 'bg-emerald-100 text-emerald-700 ring-emerald-200',
  media: 'bg-amber-100 text-amber-700 ring-amber-200',
  baja: 'bg-rose-100 text-rose-700 ring-rose-200',
};

export default function SourceBadge({ source, date, confidence = 'media' }: SourceBadgeProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
      <div className="flex items-center gap-2">
        <Database className="h-3.5 w-3.5 text-slate-400" />
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">
          Fuente: {source}
        </span>
      </div>
      {date && (
        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
          <Calendar className="h-3 w-3" />
          <span>{date}</span>
        </div>
      )}
      <span
        className={`rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-wider ring-1 ring-inset ${CONFIDENCE_COLORS[confidence]}`}
      >
        Confianza {confidence}
      </span>
    </div>
  );
}

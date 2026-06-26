'use client';

import React, { useState } from 'react';
import { ChevronDown, BookOpen } from 'lucide-react';

interface MethodologyCardProps {
  title?: string;
  children: React.ReactNode;
}

export default function MethodologyCard({
  title = '¿Cómo se interpreta esta sección?',
  children,
}: MethodologyCardProps) {
  const [open, setOpen] = useState(true);

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-3 bg-slate-50 px-5 py-3 text-left transition-colors hover:bg-slate-100"
      >
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-amber-700" />
          <span className="text-[11px] font-black uppercase tracking-widest text-slate-700">
            {title}
          </span>
        </div>
        <ChevronDown
          className={`h-4 w-4 text-slate-400 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      <div
        className={`grid transition-[grid-template-rows] duration-300 ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
      >
        <div className="overflow-hidden">
          <div className="p-5 text-xs font-medium leading-relaxed text-slate-600">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

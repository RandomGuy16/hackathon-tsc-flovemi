'use client';

import React from 'react';
import Link from 'next/link';
import { Mountain } from 'lucide-react';
import { UserMode } from '@/lib/types';
import { useUserMode } from '@/app/context/UserModeContext';
import { LayoutGrid, Newspaper, ShieldCheck } from 'lucide-react';

const modes: { value: UserMode; label: string; icon: React.ElementType }[] = [
  { value: 'citizen',    label: 'Ciudadano',  icon: ShieldCheck },
  { value: 'journalist', label: 'Periodista', icon: Newspaper   },
  { value: 'official',   label: 'Funcionario',icon: LayoutGrid  },
];

const Header: React.FC = () => {
  const { mode: currentMode, setMode: onModeChange } = useUserMode();

  return (
    <header className="sticky top-0 z-[100] w-full border-b border-slate-200/60 bg-white/90 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-6">
        <Link href="/" className="group flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-700 text-white shadow-sm transition-transform group-hover:scale-105">
            <Mountain className="h-4 w-4" />
          </div>
          <span className="font-outfit text-xl font-black tracking-tight text-slate-900">
            Minera<span className="text-amber-700">Watch</span>
          </span>
        </Link>

        <nav className="flex items-center gap-0.5 rounded-xl bg-slate-100 p-1 ring-1 ring-slate-200/50">
          {modes.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              onClick={() => onModeChange(value)}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-200 focus-visible:outline-2 focus-visible:outline-amber-600 ${
                currentMode === value
                  ? 'bg-white text-amber-700 shadow-sm ring-1 ring-slate-200'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon
                className={`h-3.5 w-3.5 transition-colors ${
                  currentMode === value ? 'text-amber-700' : 'text-slate-400'
                }`}
              />
              <span className="hidden sm:block">{label}</span>
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;

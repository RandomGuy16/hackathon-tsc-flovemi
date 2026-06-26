'use client';

import React from 'react';
import Link from 'next/link';
import { UserMode } from '@/lib/types';
import { useUserMode } from '@/app/context/UserModeContext';

const Header: React.FC = () => {
  const { mode: currentMode, setMode: onModeChange } = useUserMode();

  const modes: { value: UserMode; label: string }[] = [
    { value: 'citizen', label: 'Ciudadano' },
    { value: 'journalist', label: 'Periodista' },
    { value: 'official', label: 'Funcionario' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <span className="font-serif text-2xl font-bold tracking-tight text-slate-900">
            Minera<span className="text-blue-600">Watch</span>
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <span className="hidden text-xs font-semibold tracking-wider text-slate-400 uppercase md:block">
            Modo de Vista
          </span>
          <nav className="flex items-center space-x-1 rounded-full bg-slate-100 p-1">
            {modes.map((mode) => (
              <button
                key={mode.value}
                onClick={() => onModeChange(mode.value)}
                className={`rounded-full px-4 py-1.5 text-xs font-bold uppercase transition-all sm:text-sm ${
                  currentMode === mode.value
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                }`}
              >
                {mode.label}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;

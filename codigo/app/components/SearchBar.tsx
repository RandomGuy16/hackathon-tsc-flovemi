'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Building2 } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

const EJEMPLOS = [
  { label: '20100047218', value: '20100047218' },
  { label: 'Los Quenuales', value: 'MINERA LOS QUENUALES' },
  { label: 'Antamina', value: 'ANTAMINA' },
];

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder = 'Buscar empresa minera por nombre o RUC...',
}) => {
  const [query, setQuery] = useState('');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Buscar automáticamente 500ms después de que el usuario deje de escribir
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onSearch(query);
    }, 500);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, onSearch]);

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  const handleExample = (value: string) => {
    setQuery(value);
    onSearch(value);
  };

  return (
    <div className="w-full max-w-3xl">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSearch(query);
        }}
        className="relative"
      >
        <div className="group relative flex items-center overflow-hidden rounded-[1.25rem] bg-white p-1.5 shadow-[0_20px_50px_rgba(0,0,0,0.15)] transition-all duration-300 focus-within:-translate-y-0.5 focus-within:shadow-[0_20px_60px_rgba(180,83,9,0.18)]">
          <div className="absolute left-6 z-10 text-slate-400 transition-colors group-focus-within:text-amber-700">
            <Search className="h-6 w-6" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            autoComplete="off"
            className="h-16 w-full bg-transparent pl-14 pr-14 text-xl font-bold text-slate-900 outline-none placeholder:text-slate-300 sm:text-2xl"
            aria-label="Buscar empresa minera"
          />
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-6 z-10 rounded-xl p-2 text-slate-300 transition-colors hover:bg-slate-50 hover:text-slate-600"
              aria-label="Limpiar búsqueda"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </form>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-slate-400/80">
          <Building2 className="h-3 w-3" />
          Sugerencias:
        </div>
        {EJEMPLOS.map(({ label, value }) => (
          <button
            key={label}
            type="button"
            onClick={() => handleExample(value)}
            className="rounded-full border border-slate-200 bg-white/50 px-4 py-1.5 text-[11px] font-black uppercase tracking-wide text-slate-600 transition-all hover:border-amber-400 hover:bg-white hover:text-amber-700 active:scale-95"
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchBar;

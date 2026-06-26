'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

const EJEMPLOS = [
  { label: 'Southern Copper', value: 'southern copper' },
  { label: 'Antamina', value: 'antamina' },
  { label: 'Buenaventura', value: 'buenaventura' },
];

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, placeholder = 'Buscar empresa minera por nombre o RUC...' }) => {
  const [query, setQuery] = useState('');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Buscar automáticamente 500ms después de que el usuario deje de escribir
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onSearch(query);
    }, 500);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query, onSearch]);

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  const handleExample = (value: string) => {
    setQuery(value);
    // Disparar inmediatamente al hacer click en ejemplo
    onSearch(value);
  };

  return (
    <div className="w-full max-w-2xl">
      <form onSubmit={(e) => { e.preventDefault(); onSearch(query); }} className="relative">
        <div className="group relative flex items-center">
          <div className="absolute left-4 text-slate-400 transition-colors group-focus-within:text-blue-500">
            <Search className="h-5 w-5" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            autoComplete="off"
            className="h-14 w-full rounded-2xl border-2 border-slate-200 bg-white pl-12 pr-12 text-lg font-medium text-slate-900 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
          />
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </form>

      <div className="mt-3 flex items-center justify-center gap-3">
        <span className="text-xs font-semibold text-slate-400 uppercase">Prueba:</span>
        {EJEMPLOS.map((e) => (
          <button
            key={e.value}
            type="button"
            onClick={() => handleExample(e.value)}
            className="text-xs font-bold text-blue-600 hover:underline"
          >
            {e.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchBar;

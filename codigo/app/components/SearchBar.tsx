'use client';

import React, { useState } from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, placeholder = "Buscar empresa por nombre o RUC..." }) => {
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSearch} className="relative w-full max-w-2xl">
      <div className="group relative flex items-center">
        <div className="absolute left-4 text-slate-400 transition-colors group-focus-within:text-blue-500">
          <Search className="h-5 w-5" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="h-14 w-full rounded-2xl border-2 border-slate-200 bg-white pl-12 pr-12 text-lg font-medium text-slate-900 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="absolute right-4 text-slate-400 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
      <div className="mt-2 flex justify-center gap-3">
        <span className="text-xs font-semibold text-slate-400 uppercase">Ejemplos:</span>
        <button 
          type="button"
          onClick={() => setQuery('20100047218')}
          className="text-xs font-bold text-blue-600 hover:underline"
        >
          20100047218
        </button>
        <button 
          type="button"
          onClick={() => setQuery('MINERA LOS QUENUALES')}
          className="text-xs font-bold text-blue-600 hover:underline"
        >
          LOS QUENUALES
        </button>
      </div>
    </form>
  );
};

export default SearchBar;

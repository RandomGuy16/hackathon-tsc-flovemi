import React from 'react';
import Link from 'next/link';
import { Building2, MapPin, ChevronRight } from 'lucide-react';
import { CompanySearchData } from '@/lib/types';

interface SearchResultItemProps {
  company: CompanySearchData;
}

const SearchResultItem: React.FC<SearchResultItemProps> = ({ company }) => {
  return (
    <Link
      href={`/empresa/${company.ruc}`}
      className="group flex flex-col justify-between gap-6 rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-amber-300 hover:shadow-2xl hover:shadow-slate-200/50 active:scale-[0.98]"
    >
      <div className="flex flex-col gap-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-amber-700 transition-all duration-300 group-hover:bg-amber-700 group-hover:text-white">
            <Building2 className="h-6 w-6" />
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 text-slate-300 transition-all duration-300 group-hover:bg-amber-50 group-hover:text-amber-600 group-hover:translate-x-0.5">
            <ChevronRight className="h-5 w-5" />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="font-outfit text-xl font-extrabold leading-tight text-slate-900 transition-colors group-hover:text-amber-900">
            {company.razonSocial}
          </h3>
          <div className="flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-wider text-slate-400">
            <span className="rounded bg-slate-100 px-2 py-0.5 text-slate-500">RUC {company.ruc}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 border-t border-slate-100 pt-5">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
          <MapPin className="h-3.5 w-3.5 text-slate-400" />
          <span className="truncate">
            {[company.district, company.province, company.region]
              .filter(Boolean)
              .join(', ')}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default SearchResultItem;

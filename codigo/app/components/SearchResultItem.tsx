import React from 'react';
import Link from 'next/link';
import { Building2, MapPin } from 'lucide-react';
import { CompanySearchData } from '@/lib/types';

interface SearchResultItemProps {
  company: CompanySearchData;
}

const SearchResultItem: React.FC<SearchResultItemProps> = ({ company }) => {
  return (
    <Link 
      href={`/empresa/${company.ruc}`}
      className="group flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-4 transition-all hover:border-blue-300 hover:shadow-md active:scale-[0.98]"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-slate-100 p-2 text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-600">
            <Building2 className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-serif text-lg font-bold text-slate-900 group-hover:text-blue-600">
              {company.razonSocial}
            </h3>
            <p className="text-sm font-mono text-slate-500">RUC: {company.ruc}</p>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
        <MapPin className="h-3.5 w-3.5" />
        <span>{company.region}, {company.province}, {company.district}</span>
      </div>
    </Link>
  );
};

export default SearchResultItem;

'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface SectionCardProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  initiallyExpanded?: boolean;
}

const SectionCard: React.FC<SectionCardProps> = ({
  title,
  icon,
  children,
  initiallyExpanded = true,
}) => {
  const [isExpanded, setIsExpanded] = useState(initiallyExpanded);

  return (
    <div className="group flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-amber-200 hover:shadow-2xl hover:shadow-slate-200/50">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="relative flex items-center justify-between p-6 text-left transition-colors hover:bg-slate-50/50"
        aria-expanded={isExpanded}
      >
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-500 transition-all duration-300 group-hover:scale-110 group-hover:bg-amber-700 group-hover:text-white">
            {React.isValidElement(icon)
              ? React.cloneElement(icon as React.ReactElement<{ className?: string }>, { className: 'h-6 w-6' })
              : icon}
          </div>
          <h3 className="font-outfit text-lg font-extrabold tracking-tight text-slate-900">{title}</h3>
        </div>
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-full bg-slate-50 transition-all duration-300 ${
            isExpanded ? 'rotate-180 bg-amber-50 text-amber-600' : 'text-slate-400'
          }`}
        >
          <ChevronDown className="h-4 w-4" />
        </div>
      </button>

      {/* CSS grid trick for smooth height animation */}
      <div
        className={`grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <div className="border-t border-slate-100 px-6 pb-8 pt-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SectionCard;

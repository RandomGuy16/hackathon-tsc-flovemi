'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

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
  initiallyExpanded = true 
}) => {
  const [isExpanded, setIsExpanded] = useState(initiallyExpanded);

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between p-5 text-left hover:bg-slate-50"
      >
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
            {icon}
          </div>
          <h3 className="font-serif text-lg font-bold text-slate-900">{title}</h3>
        </div>
        <div className="text-slate-400">
          {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </div>
      </button>
      
      {isExpanded && (
        <div className="border-t border-slate-100 p-5 pt-0">
          <div className="mt-5">{children}</div>
        </div>
      )}
    </div>
  );
};

export default SectionCard;

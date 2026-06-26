import React from 'react';
import { ProjectStatus } from '@/lib/types';

interface ProjectStatusChartProps {
  data: { status: ProjectStatus; count: number }[];
}

const statusConfig: Record<ProjectStatus, { label: string; bar: string; dot: string; text: string }> = {
  de_acuerdo: {
    label: 'En Regla',
    bar: 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.4)]',
    dot: 'bg-emerald-500',
    text: 'text-emerald-600',
  },
  paralizado: {
    label: 'Paralizado',
    bar: 'bg-rose-500 shadow-[0_0_12px_rgba(239,68,68,0.4)]',
    dot: 'bg-rose-500',
    text: 'text-rose-600',
  },
  en_tramite: {
    label: 'En Trámite',
    bar: 'bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.4)]',
    dot: 'bg-amber-500',
    text: 'text-amber-600',
  },
  cerrado: {
    label: 'Cerrado',
    bar: 'bg-slate-400 shadow-[0_0_12px_rgba(148,163,184,0.4)]',
    dot: 'bg-slate-400',
    text: 'text-slate-600',
  },
};

const ProjectStatusChart: React.FC<ProjectStatusChartProps> = ({ data }) => {
  const total = data.reduce((acc, d) => acc + d.count, 0);
  if (total === 0) return null;

  return (
    <div className="flex flex-col gap-5">
      {/* Premium Stacked bar */}
      <div className="flex h-3 w-full gap-1 overflow-hidden rounded-full bg-slate-200/50 p-0.5 ring-1 ring-slate-200/20">
        {data.map((d, i) => (
          <div
            key={i}
            className={`${statusConfig[d.status].bar} h-full transition-all duration-1000 ease-out first:rounded-l-full last:rounded-r-full`}
            style={{ width: `${(d.count / total) * 100}%` }}
            title={`${statusConfig[d.status].label}: ${d.count}`}
          />
        ))}
      </div>

      {/* Modern Legend */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-3">
        {data.map((d, i) => (
          <div key={i} className="group flex items-center justify-between gap-2 p-2 rounded-xl hover:bg-white transition-all hover:shadow-sm">
            <div className="flex items-center gap-2.5">
               <div className={`h-2.5 w-2.5 flex-shrink-0 rounded-full ${statusConfig[d.status].dot}`} />
               <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                 {statusConfig[d.status].label}
               </span>
            </div>
            <span className={`font-mono text-xs font-black ${statusConfig[d.status].text}`}>{d.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectStatusChart;

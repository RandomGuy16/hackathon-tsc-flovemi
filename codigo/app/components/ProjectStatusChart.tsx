import React from 'react';
import { ProjectStatus } from '@/lib/types';

interface ProjectStatusChartProps {
  data: { status: ProjectStatus; count: number }[];
}

const ProjectStatusChart: React.FC<ProjectStatusChartProps> = ({ data }) => {
  const statusConfig = {
    de_acuerdo: { label: 'De Acuerdo', color: 'bg-emerald-500' },
    paralizado: { label: 'Paralizado', color: 'bg-rose-500' },
    en_tramite: { label: 'En Trámite', color: 'bg-amber-500' },
    cerrado: { label: 'Cerrado', color: 'bg-slate-500' },
  };

  const total = data.reduce((acc, d) => acc + d.count, 0);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex h-4 w-full gap-1 overflow-hidden rounded-full bg-slate-100">
        {data.map((d, i) => (
          <div
            key={i}
            className={`${statusConfig[d.status].color} h-full transition-all`}
            style={{ width: `${(d.count / total) * 100}%` }}
            title={`${statusConfig[d.status].label}: ${d.count}`}
          />
        ))}
      </div>
      
      <div className="grid grid-cols-2 gap-x-4 gap-y-2">
        {data.map((d, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className={`h-2 w-2 rounded-full ${statusConfig[d.status].color}`} />
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">
              {statusConfig[d.status].label}
            </span>
            <span className="ml-auto text-[10px] font-black text-slate-900">{d.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectStatusChart;

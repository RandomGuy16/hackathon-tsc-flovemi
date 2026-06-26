import React from 'react';
import { RiskLevel } from '@/lib/types';
import RiskBadge from './RiskBadge';
import { ShieldAlert, TriangleAlert, ShieldCheck } from 'lucide-react';

interface RiskScoreProps {
  score: number;
  level: RiskLevel;
}

const RiskScore: React.FC<RiskScoreProps> = ({ score, level }) => {
  const config = {
    BAJO: { color: 'var(--color-risk-low)', icon: ShieldCheck, text: 'text-emerald-500' },
    MEDIO: { color: 'var(--color-risk-medium)', icon: TriangleAlert, text: 'text-amber-500' },
    ALTO: { color: 'var(--color-risk-high)', icon: ShieldAlert, text: 'text-rose-500' },
  };

  const { color, icon: Icon, text } = config[level];

  return (
    <div className="flex flex-col items-center gap-5 rounded-[2rem] border border-slate-200 bg-white px-10 py-8 shadow-2xl shadow-slate-200/50">
      <div className="relative h-40 w-40">
        <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
          {/* Track */}
          <path
            className="fill-none stroke-slate-100"
            strokeWidth="4"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          {/* Progress */}
          <path
            className="fill-none transition-all duration-1000 ease-out"
            stroke={color}
            strokeWidth="4"
            strokeDasharray={`${score}, 100`}
            strokeLinecap="round"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-outfit text-5xl font-black text-slate-900 leading-none">
            {score}
          </span>
          <span className="mt-1 font-mono text-[10px] font-bold uppercase tracking-widest text-slate-400">
            ÍNDICE
          </span>
        </div>
      </div>

      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center gap-2">
          <Icon className={`h-4 w-4 ${text}`} />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
            Nivel de Vigilancia
          </span>
        </div>
        <RiskBadge level={level} className="scale-110" />
      </div>
    </div>
  );
};

export default RiskScore;

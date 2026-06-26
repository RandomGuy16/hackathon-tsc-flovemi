import React from 'react';
import { RiskLevel } from '@/lib/types';
import RiskBadge from './RiskBadge';

interface RiskScoreProps {
  score: number;
  level: RiskLevel;
}

const RiskScore: React.FC<RiskScoreProps> = ({ score, level }) => {
  const getProgressColor = () => {
    if (level === 'ALTO') return 'bg-rose-500';
    if (level === 'MEDIO') return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  return (
    <div className="flex flex-col items-center gap-2 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="relative h-24 w-24">
        {/* Simple SVG Circular Progress */}
        <svg className="h-full w-full" viewBox="0 0 36 36">
          <path
            className="stroke-slate-100 fill-none"
            strokeWidth="3"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          <path
            className={`fill-none stroke-current transition-all duration-1000 ease-out ${getProgressColor()}`}
            strokeWidth="3"
            strokeDasharray={`${score}, 100`}
            strokeLinecap="round"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-black text-slate-900">{score}</span>
        </div>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
          Score de Riesgo
        </span>
        <RiskBadge level={level} className="mt-1" />
      </div>
    </div>
  );
};

export default RiskScore;

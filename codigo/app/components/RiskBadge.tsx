import React from 'react';
import { ShieldCheck, TriangleAlert, ShieldAlert } from 'lucide-react';
import { RiskLevel } from '@/lib/types';

interface RiskBadgeProps {
  level: RiskLevel;
  className?: string;
}

const RiskBadge: React.FC<RiskBadgeProps> = ({ level, className = '' }) => {
  const config = {
    BAJO: {
      color: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      icon: <ShieldCheck className="h-4 w-4" />,
      label: 'BAJO',
    },
    MEDIO: {
      color: 'bg-amber-100 text-amber-700 border-amber-200',
      icon: <TriangleAlert className="h-4 w-4" />,
      label: 'MEDIO',
    },
    ALTO: {
      color: 'bg-rose-100 text-rose-700 border-rose-200',
      icon: <ShieldAlert className="h-4 w-4" />,
      label: 'ALTO',
    },
  };

  const { color, icon, label } = config[level];

  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide ${color} ${className}`}
      role="status"
      aria-label={`Nivel de riesgo: ${label}`}
    >
      {icon}
      <span>{label}</span>
    </div>
  );
};

export default RiskBadge;

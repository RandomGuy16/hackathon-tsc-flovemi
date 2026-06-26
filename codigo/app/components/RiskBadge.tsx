import React from 'react';
import { ShieldCheck, TriangleAlert, ShieldAlert } from 'lucide-react';
import { RiskLevel } from '@/lib/types';

interface RiskBadgeProps {
  level: RiskLevel;
  className?: string;
}

const config: Record<RiskLevel, { bg: string; icon: React.ReactNode; label: string; text: string; iconColor: string }> = {
  BAJO: {
    bg: 'bg-emerald-50 border-emerald-200/50',
    icon: <ShieldCheck className="h-3.5 w-3.5" />,
    label: 'RIESGO BAJO',
    text: 'text-emerald-700',
    iconColor: 'text-emerald-600',
  },
  MEDIO: {
    bg: 'bg-amber-50 border-amber-200/50',
    icon: <TriangleAlert className="h-3.5 w-3.5" />,
    label: 'RIESGO MEDIO',
    text: 'text-amber-700',
    iconColor: 'text-amber-600',
  },
  ALTO: {
    bg: 'bg-rose-50 border-rose-200/50',
    icon: <ShieldAlert className="h-3.5 w-3.5" />,
    label: 'RIESGO ALTO',
    text: 'text-rose-700',
    iconColor: 'text-rose-600',
  },
};

const RiskBadge: React.FC<RiskBadgeProps> = ({ level, className = '' }) => {
  const { bg, icon, label, text, iconColor } = config[level];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[10px] font-black tracking-wider uppercase ${bg} ${text} ${className}`}
      role="status"
      aria-label={`Nivel de riesgo: ${label}`}
    >
      <span className={`flex-shrink-0 ${iconColor}`}>{icon}</span>
      {label}
    </span>
  );
};

export default RiskBadge;

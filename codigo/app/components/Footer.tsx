import React from 'react';
import { Mountain } from 'lucide-react';

const sources = ['OEFA', 'MINEM', 'SUNAT', 'OSCE', 'Defensoría', 'PNDA', 'INFOBRAS'];

const Footer: React.FC = () => {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white">
      {/* Interoperability bar */}
      <div className="border-b border-slate-100 bg-slate-50 py-4">
        <div className="container mx-auto flex flex-col items-center gap-3 px-6 sm:flex-row">
          <span className="flex-shrink-0 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
            Interoperabilidad
          </span>
          <div className="flex flex-wrap justify-center gap-2 sm:justify-start">
            {sources.map((s) => (
              <span
                key={s}
                className="rounded border border-slate-200 bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="py-5">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-6 sm:flex-row">
          <div className="flex items-center gap-2.5">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-amber-700 text-white">
              <Mountain className="h-3 w-3" />
            </div>
            <span className="font-outfit text-sm font-black tracking-tight text-slate-900">
              Minera<span className="text-amber-700">Watch</span>
            </span>
            <span className="text-slate-300">·</span>
            <p className="hidden text-xs text-slate-500 sm:block">
              Plataforma de vigilancia ciudadana para el sector extractivo peruano.
            </p>
          </div>
          <div className="flex items-center gap-3 text-[10px] text-slate-400">
            <span>© 2026 MineraWatch</span>
            <span className="h-3 w-px bg-slate-200" />
            <span className="uppercase tracking-wider">PUCP Vibecoding 2026</span>
            <span className="h-3 w-px bg-slate-200" />
            <span>Hecho en Perú</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

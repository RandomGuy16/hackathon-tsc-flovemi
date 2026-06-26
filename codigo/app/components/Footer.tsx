import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-slate-50 py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex flex-col items-center md:items-start">
            <span className="font-serif text-xl font-bold tracking-tight text-slate-900">
              Minera<span className="text-blue-600">Watch</span>
            </span>
            <p className="mt-2 max-w-xs text-center text-sm text-slate-500 md:text-left">
              Plataforma de transparencia y vigilancia para la actividad minera en el Perú.
            </p>
          </div>
          
          <div className="flex gap-8">
            <div className="flex flex-col gap-2">
              <span className="text-xs font-black tracking-widest text-slate-400 uppercase">Información</span>
              <a href="#" className="text-sm font-semibold text-slate-600 hover:text-blue-600">Metodología</a>
              <a href="#" className="text-sm font-semibold text-slate-600 hover:text-blue-600">Fuentes de Datos</a>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-xs font-black tracking-widest text-slate-400 uppercase">Contacto</span>
              <a href="#" className="text-sm font-semibold text-slate-600 hover:text-blue-600">Reportar Error</a>
              <a href="#" className="text-sm font-semibold text-slate-600 hover:text-blue-600">Prensa</a>
            </div>
          </div>
        </div>
        
        <div className="mt-12 flex flex-col items-center justify-between border-t border-slate-200 pt-8 md:flex-row">
          <p className="text-xs font-medium text-slate-400">
            © 2026 MineraWatch. Datos abiertos para una ciudadanía informada.
          </p>
          <div className="mt-4 flex gap-4 md:mt-0">
             <span className="text-[10px] font-bold text-slate-300 uppercase tracking-tighter">Gobierno Abierto</span>
             <span className="text-[10px] font-bold text-slate-300 uppercase tracking-tighter">Perú Transparente</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

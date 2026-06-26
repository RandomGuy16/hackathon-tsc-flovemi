'use client';

import React from 'react';
import { AlertCircle } from 'lucide-react';

export default function VerificationNotice() {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-rose-100 bg-rose-50/70 p-4">
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" />
      <p className="text-[11px] font-semibold leading-relaxed text-rose-900">
        <span className="font-black">Verificación recomendada:</span> antes de usar esta
        información en una nota o denuncia, confirme el dato en la fuente oficial. Los registros
        pueden cambiar por resoluciones administrativas, apelaciones o actualizaciones posteriores.
      </p>
    </div>
  );
}

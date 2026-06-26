// Datos de PCM/PNDA (datosabiertos.gob.pe) — tabla social_conflicts en Supabase
export type EstadoConflicto = 'activo' | 'inactivo' | 'resuelto'

export type ConflictoSocial = {
  id: string
  region: string
  provincia: string
  distrito: string
  descripcion: string
  estado: EstadoConflicto
  empresaRucRelacionado: string | null
  reportadoEn: string
}

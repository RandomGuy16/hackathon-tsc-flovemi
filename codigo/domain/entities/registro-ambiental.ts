// Sanciones OEFA via latinfo.dev /pe/oefa/sanctions/ruc/{ruc}
// Calidad del aire via OEFA API key + tabla air_quality en Supabase
export type SancionAmbiental = {
  autoridad: string
  fecha: string
  descripcion: string
  monto: number | null
  estado: string // 'firme' | 'apelada' | 'impugnada' — solo 'firme' suma al score
}

export type RegistroCalidadAire = {
  id: string
  region: string
  nombreEstacion: string
  año: number
  parametro: string
  valor: number
  unidad: string
}

export type RegistroAmbiental = {
  empresaRuc: string
  cantidadSanciones: number
  sancionesFirmes: number // las 'firme' que suman al score de Legalidad
  sanciones: SancionAmbiental[]
  calidadAire: RegistroCalidadAire[]
}

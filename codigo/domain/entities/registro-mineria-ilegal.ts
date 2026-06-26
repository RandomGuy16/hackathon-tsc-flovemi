// Registros de minería ilegal/informal — fuente: MINEM / GFHL
export type EstadoRegularizacion =
  | 'sin_tramite'
  | 'en_tramite'
  | 'regularizado'
  | 'desestimado'

export type RegistroMineriaIlegal = {
  id: string
  empresaRuc: string | null
  ubicacion: string
  region: string
  provincia: string | null
  distrito: string | null
  motivo: string
  estadoRegularizacion: EstadoRegularizacion
  detectadoEn: string | null
  latitud: number | null
  longitud: number | null
}

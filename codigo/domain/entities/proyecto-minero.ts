// Datos de proyectos mineros activos — fuente: MINEM / reportes oficiales
export type EstadoProyectoMinero =
  | 'de_acuerdo'
  | 'paralizado'
  | 'en_tramite'
  | 'cerrado'

export type ProyectoMinero = {
  id: string
  empresaRuc: string | null
  nombre: string
  estado: EstadoProyectoMinero
  ubicacion: string
  proceso: string
  tipoMineral: string
  mesesRestantesEstimados: number | null
  region: string
  provincia: string | null
  distrito: string | null
  latitud: number | null
  longitud: number | null
}

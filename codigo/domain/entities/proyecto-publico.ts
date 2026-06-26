// Datos de INFOBRAS/MEF — tabla public_projects en Supabase
export type ProyectoPublico = {
  id: string
  region: string
  nombre: string
  presupuesto: number
  avanceFisico: number // 0.0 a 1.0
  ejecutor: string
  latitud: number | null
  longitud: number | null
}

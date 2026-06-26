export type Empresa = {
  ruc: string
  razonSocial: string
  estado: 'activa' | 'inactiva'
  region: string
  provincia: string | null
  distrito: string | null
  latitud: number | null
  longitud: number | null
}

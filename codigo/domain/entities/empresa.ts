export type Empresa = {
  ruc: string
  razonSocial: string
  estado: string
  region: string
  provincia: string | null
  distrito: string | null
  latitud: number | null
  longitud: number | null
  condicion?: string | null
  domicilioFiscal?: string | null
  locales?: Array<{ ubigeo: string; lugar: string; direccion: string }> | null
}


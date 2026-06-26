// Datos OSCE via latinfo.dev:
// /pe/osce/sanctioned/ruc/{ruc}  → impedida de contratar
// /pe/osce/fines/ruc/{ruc}       → multas
// /pe/osce/penalidades/ruc/{ruc} → penalidades
// /pe/licitaciones                → contratos públicos adjudicados
export type SancionLegal = {
  autoridad: string
  fecha: string
  descripcion: string
}

export type MultaLegal = {
  autoridad: string
  fecha: string
  monto: number
  moneda: string
}

export type Licitacion = {
  codigo: string
  titulo: string
  fecha: string
  monto: number | null
  moneda: string | null
}

export type RegistroLegal = {
  empresaRuc: string
  impedidaDeContratar: boolean
  sancionesOsce: SancionLegal[]
  multasOsce: MultaLegal[]
  penalidades: SancionLegal[]
  licitaciones: Licitacion[]
}

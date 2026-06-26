import type { Empresa } from './empresa'
import type { Sancion } from './sancion'
import type { DeudaFiscal } from './deuda-fiscal'
import type { Accidente } from './accidente'
import type { Contrato } from './contrato'

export type FichaEmpresa = {
  empresa: Empresa
  sanciones: Sancion[]
  deudas: DeudaFiscal[]
  accidentes: Accidente[]
  contratos: Contrato[]
}

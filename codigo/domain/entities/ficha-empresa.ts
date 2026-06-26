import type { Empresa } from './empresa'
import type { RegistroSeguridad } from './registro-seguridad'
import type { RegistroAmbiental } from './registro-ambiental'
import type { RegistroLegal } from './registro-legal'
import type { DeudaFiscal } from './deuda-fiscal'
import type { ConflictoSocial } from './conflicto-social'
import type { ProyectoPublico } from './proyecto-publico'
import type { ScoreRiesgo } from './score-riesgo'

// Respuesta completa del dashboard — mapea a GET /api/companies/[ruc]/dashboard
export type FichaEmpresa = {
  empresa: Empresa
  scoreRiesgo: ScoreRiesgo
  seguridad: RegistroSeguridad[]
  ambiental: RegistroAmbiental | null
  legal: RegistroLegal | null
  deudas: DeudaFiscal[]
  conflictos: ConflictoSocial[]
  proyectosPublicos: ProyectoPublico[]
}

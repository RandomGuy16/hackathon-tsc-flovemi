import type { Empresa } from './empresa'
import type { ConflictoSocial } from './conflicto-social'
import type { ProyectoPublico } from './proyecto-publico'

// Respuesta de GET /api/regions/[region]
export type ResumenRegion = {
  region: string
  empresas: Empresa[]
  conflictos: ConflictoSocial[]
  proyectos: ProyectoPublico[]
}

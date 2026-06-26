import type { Empresa } from './empresa'
import type { ConflictoSocial } from './conflicto-social'
import type { ProyectoPublico } from './proyecto-publico'
import type { ProyectoMinero } from './proyecto-minero'
import type { RegistroMineriaIlegal } from './registro-mineria-ilegal'

// Respuesta de GET /api/regions/[region]
export type ResumenRegion = {
  region:                  string
  empresas:                Empresa[]
  conflictos:              ConflictoSocial[]
  proyectos:               ProyectoPublico[]
  proyectosMineros:        ProyectoMinero[]
  registrosMineriaIlegal:  RegistroMineriaIlegal[]
}

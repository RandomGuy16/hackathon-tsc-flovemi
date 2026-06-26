import type { RegistroLegal } from '../entities/registro-legal'

export interface IRegistroLegalRepository {
  obtenerPorRuc(ruc: string): Promise<RegistroLegal | null>
}

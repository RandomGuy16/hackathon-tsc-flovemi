import type { RegistroMineriaIlegal } from '../entities/registro-mineria-ilegal'

export interface IRegistroMineriaIlegalRepository {
  obtenerPorRegion(region: string): Promise<RegistroMineriaIlegal[]>
}

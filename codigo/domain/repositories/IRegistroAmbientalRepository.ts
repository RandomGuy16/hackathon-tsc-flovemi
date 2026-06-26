import type { RegistroAmbiental, RegistroCalidadAire } from '../entities/registro-ambiental'

export interface IRegistroAmbientalRepository {
  obtenerPorRuc(ruc: string): Promise<RegistroAmbiental | null>
  obtenerCalidadAirePorRegion(region: string): Promise<RegistroCalidadAire[]>
}

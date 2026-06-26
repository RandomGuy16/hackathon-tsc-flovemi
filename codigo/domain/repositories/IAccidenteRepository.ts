import type { Accidente } from '../entities/accidente'

export interface IAccidenteRepository {
  obtenerPorRuc(ruc: string): Promise<Accidente[]>
}

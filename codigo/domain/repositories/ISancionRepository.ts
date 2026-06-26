import type { Sancion } from '../entities/sancion'

export interface ISancionRepository {
  obtenerPorRuc(ruc: string): Promise<Sancion[]>
}

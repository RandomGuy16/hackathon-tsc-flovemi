import type { ProyectoPublico } from '../entities/proyecto-publico'

export interface IProyectoPublicoRepository {
  obtenerPorRegion(region: string): Promise<ProyectoPublico[]>
}

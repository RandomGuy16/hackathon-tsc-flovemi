import type { ProyectoMinero } from '../entities/proyecto-minero'

export interface IProyectoMineroRepository {
  obtenerPorRuc(ruc: string): Promise<ProyectoMinero[]>
  obtenerPorRegion(region: string): Promise<ProyectoMinero[]>
}

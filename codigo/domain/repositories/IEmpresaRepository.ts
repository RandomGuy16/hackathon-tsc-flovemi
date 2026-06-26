import type { Empresa } from '../entities/empresa'

export interface IEmpresaRepository {
  buscar(termino: string): Promise<Empresa[]>
  obtenerPorRuc(ruc: string): Promise<Empresa>
  buscarPorRegion(region: string): Promise<Empresa[]>
}

import type { IEmpresaRepository } from '../repositories/IEmpresaRepository'
import type { Empresa } from '../entities/empresa'

export class BuscarEmpresa {
  constructor(private readonly empresaRepo: IEmpresaRepository) {}

  async ejecutar(termino: string): Promise<Empresa[]> {
    if (!termino || termino.trim().length < 2) {
      throw new Error('El término de búsqueda debe tener al menos 2 caracteres')
    }
    return this.empresaRepo.buscar(termino.trim())
  }
}

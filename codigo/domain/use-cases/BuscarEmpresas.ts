import type { IEmpresaRepository } from '../repositories/IEmpresaRepository'
import type { Empresa } from '../entities/empresa'

export class BuscarEmpresas {
  constructor(private readonly empresaRepo: IEmpresaRepository) {}

  async ejecutar(termino: string): Promise<Empresa[]> {
    if (!termino || termino.trim().length < 3) {
      throw new Error('El término de búsqueda debe tener al menos 3 caracteres')
    }
    return this.empresaRepo.buscar(termino.trim())
  }
}

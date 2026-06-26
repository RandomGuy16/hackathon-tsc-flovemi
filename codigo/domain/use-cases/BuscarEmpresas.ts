import type { IEmpresaRepository } from '../repositories/IEmpresaRepository'
import type { Empresa } from '../entities/empresa'
import { BUSQUEDA_MIN_CHARS } from '../config/constantes'
import { BusquedaInvalidaError } from '../errors'

export class BuscarEmpresas {
  constructor(private readonly empresaRepo: IEmpresaRepository) {}

  async ejecutar(termino: string): Promise<Empresa[]> {
    const limpio = termino?.trim() ?? ''
    if (limpio.length < BUSQUEDA_MIN_CHARS) {
      throw new BusquedaInvalidaError(
        `El término de búsqueda debe tener al menos ${BUSQUEDA_MIN_CHARS} caracteres`,
      )
    }
    return this.empresaRepo.buscar(limpio)
  }
}

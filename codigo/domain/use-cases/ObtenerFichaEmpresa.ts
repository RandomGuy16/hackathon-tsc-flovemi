import type { IEmpresaRepository } from '../repositories/IEmpresaRepository'
import type { ISancionRepository } from '../repositories/ISancionRepository'
import type { IDeudaRepository } from '../repositories/IDeudaRepository'
import type { IAccidenteRepository } from '../repositories/IAccidenteRepository'
import type { IContratoRepository } from '../repositories/IContratoRepository'
import type { FichaEmpresa } from '../entities/ficha-empresa'

export class ObtenerFichaEmpresa {
  constructor(
    private readonly empresaRepo: IEmpresaRepository,
    private readonly sancionRepo: ISancionRepository,
    private readonly deudaRepo: IDeudaRepository,
    private readonly accidenteRepo: IAccidenteRepository,
    private readonly contratoRepo: IContratoRepository,
  ) {}

  async ejecutar(ruc: string): Promise<FichaEmpresa> {
    if (!/^\d{11}$/.test(ruc)) {
      throw new Error('El RUC debe tener 11 dígitos')
    }

    // RNF-04: las secciones son independientes — si una falla, las demás siguen
    const [empresa, sanciones, deudas, accidentes, contratos] = await Promise.allSettled([
      this.empresaRepo.obtenerPorRuc(ruc),
      this.sancionRepo.obtenerPorRuc(ruc),
      this.deudaRepo.obtenerPorRuc(ruc),
      this.accidenteRepo.obtenerPorRuc(ruc),
      this.contratoRepo.obtenerPorRuc(ruc),
    ])

    return {
      empresa: empresa.status === 'fulfilled'
        ? empresa.value
        : { ruc, razonSocial: 'No disponible', estado: 'inactiva', region: 'No disponible' },
      sanciones: sanciones.status === 'fulfilled' ? sanciones.value : [],
      deudas: deudas.status === 'fulfilled' ? deudas.value : [],
      accidentes: accidentes.status === 'fulfilled' ? accidentes.value : [],
      contratos: contratos.status === 'fulfilled' ? contratos.value : [],
    }
  }
}

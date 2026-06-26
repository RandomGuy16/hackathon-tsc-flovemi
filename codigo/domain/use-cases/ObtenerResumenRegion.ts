import type { IEmpresaRepository } from '../repositories/IEmpresaRepository'
import type { IConflictoSocialRepository } from '../repositories/IConflictoSocialRepository'
import type { IProyectoPublicoRepository } from '../repositories/IProyectoPublicoRepository'
import type { ResumenRegion } from '../entities/resumen-region'

export class ObtenerResumenRegion {
  constructor(
    private readonly empresaRepo: IEmpresaRepository,
    private readonly conflictoRepo: IConflictoSocialRepository,
    private readonly proyectoRepo: IProyectoPublicoRepository,
  ) {}

  async ejecutar(region: string): Promise<ResumenRegion> {
    if (!region || region.trim().length === 0) {
      throw new Error('La región es requerida')
    }

    // RF-04: secciones independientes
    const [empresas, conflictos, proyectos] = await Promise.allSettled([
      this.empresaRepo.buscarPorRegion(region),
      this.conflictoRepo.obtenerPorRegion(region),
      this.proyectoRepo.obtenerPorRegion(region),
    ])

    return {
      region,
      empresas: empresas.status === 'fulfilled' ? empresas.value : [],
      conflictos: conflictos.status === 'fulfilled' ? conflictos.value : [],
      proyectos: proyectos.status === 'fulfilled' ? proyectos.value : [],
    }
  }
}

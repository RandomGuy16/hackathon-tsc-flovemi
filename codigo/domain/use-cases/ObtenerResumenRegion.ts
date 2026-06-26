import type { IEmpresaRepository } from '../repositories/IEmpresaRepository'
import type { IConflictoSocialRepository } from '../repositories/IConflictoSocialRepository'
import type { IProyectoPublicoRepository } from '../repositories/IProyectoPublicoRepository'
import type { IProyectoMineroRepository } from '../repositories/IProyectoMineroRepository'
import type { IRegistroMineriaIlegalRepository } from '../repositories/IRegistroMineriaIlegalRepository'
import type { ResumenRegion } from '../entities/resumen-region'
import { RegionRequeridaError } from '../errors'

export class ObtenerResumenRegion {
  constructor(
    private readonly empresaRepo:  IEmpresaRepository,
    private readonly conflictoRepo: IConflictoSocialRepository,
    private readonly proyectoRepo:  IProyectoPublicoRepository,
    private readonly mineroRepo:    IProyectoMineroRepository,
    private readonly ilegalRepo:    IRegistroMineriaIlegalRepository,
  ) {}

  async ejecutar(region: string): Promise<ResumenRegion> {
    const limpia = region?.trim() ?? ''
    if (!limpia) throw new RegionRequeridaError('La región es requerida')

    // RF-04: secciones independientes
    const [empresas, conflictos, proyectos, proyectosMineros, mineriaIlegal] =
      await Promise.allSettled([
        this.empresaRepo.buscarPorRegion(limpia),
        this.conflictoRepo.obtenerPorRegion(limpia),
        this.proyectoRepo.obtenerPorRegion(limpia),
        this.mineroRepo.obtenerPorRegion(limpia),
        this.ilegalRepo.obtenerPorRegion(limpia),
      ])

    return {
      region: limpia,
      empresas:               empresas.status          === 'fulfilled' ? empresas.value          : [],
      conflictos:             conflictos.status        === 'fulfilled' ? conflictos.value        : [],
      proyectos:              proyectos.status         === 'fulfilled' ? proyectos.value         : [],
      proyectosMineros:       proyectosMineros.status  === 'fulfilled' ? proyectosMineros.value  : [],
      registrosMineriaIlegal: mineriaIlegal.status     === 'fulfilled' ? mineriaIlegal.value     : [],
    }
  }
}

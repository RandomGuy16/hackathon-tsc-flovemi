import type { IEmpresaRepository } from '../repositories/IEmpresaRepository'
import type { IRegistroSeguridadRepository } from '../repositories/IRegistroSeguridadRepository'
import type { IRegistroAmbientalRepository } from '../repositories/IRegistroAmbientalRepository'
import type { IRegistroLegalRepository } from '../repositories/IRegistroLegalRepository'
import type { IDeudaRepository } from '../repositories/IDeudaRepository'
import type { IConflictoSocialRepository } from '../repositories/IConflictoSocialRepository'
import type { IProyectoPublicoRepository } from '../repositories/IProyectoPublicoRepository'
import type { FichaEmpresa } from '../entities/ficha-empresa'
import { CalcularScoreRiesgo } from './CalcularScoreRiesgo'

export class ObtenerFichaEmpresa {
  private readonly calcularScore = new CalcularScoreRiesgo()

  constructor(
    private readonly empresaRepo: IEmpresaRepository,
    private readonly seguridadRepo: IRegistroSeguridadRepository,
    private readonly ambientalRepo: IRegistroAmbientalRepository,
    private readonly legalRepo: IRegistroLegalRepository,
    private readonly deudaRepo: IDeudaRepository,
    private readonly conflictoRepo: IConflictoSocialRepository,
    private readonly proyectoRepo: IProyectoPublicoRepository,
  ) {}

  async ejecutar(ruc: string): Promise<FichaEmpresa> {
    if (!/^\d{11}$/.test(ruc)) {
      throw new Error('El RUC debe tener 11 dígitos')
    }

    // RF-04: secciones independientes — si una falla las demás continúan
    const [empresa, seguridad, ambiental, legal, deudas, conflictos] = await Promise.allSettled([
      this.empresaRepo.obtenerPorRuc(ruc),
      this.seguridadRepo.obtenerPorRuc(ruc),
      this.ambientalRepo.obtenerPorRuc(ruc),
      this.legalRepo.obtenerPorRuc(ruc),
      this.deudaRepo.obtenerPorRuc(ruc),
      this.conflictoRepo.obtenerPorRuc(ruc),
    ])

    const empresaData = empresa.status === 'fulfilled'
      ? empresa.value
      : { ruc, razonSocial: 'No disponible', estado: 'inactiva' as const, region: 'No disponible', provincia: null, distrito: null, latitud: null, longitud: null }

    const seguridadData = seguridad.status === 'fulfilled' ? seguridad.value : []
    const ambientalData = ambiental.status === 'fulfilled' ? ambiental.value : null
    const legalData = legal.status === 'fulfilled' ? legal.value : null
    const deudasData = deudas.status === 'fulfilled' ? deudas.value : []
    const conflictosData = conflictos.status === 'fulfilled' ? conflictos.value : []

    // Proyectos públicos son por región — segunda consulta con la región de la empresa
    const proyectosData = empresaData.region !== 'No disponible'
      ? await this.proyectoRepo.obtenerPorRegion(empresaData.region).catch(() => [])
      : []

    const scoreRiesgo = this.calcularScore.ejecutar({
      seguridad: seguridadData,
      ambiental: ambientalData,
      legal: legalData,
      deudas: deudasData,
      conflictos: conflictosData,
    })

    return {
      empresa: empresaData,
      scoreRiesgo,
      seguridad: seguridadData,
      ambiental: ambientalData,
      legal: legalData,
      deudas: deudasData,
      conflictos: conflictosData,
      proyectosPublicos: proyectosData,
    }
  }
}

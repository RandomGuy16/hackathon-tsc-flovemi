import type { IEmpresaRepository } from '../repositories/IEmpresaRepository'
import type { IRegistroSeguridadRepository } from '../repositories/IRegistroSeguridadRepository'
import type { IRegistroAmbientalRepository } from '../repositories/IRegistroAmbientalRepository'
import type { IRegistroLegalRepository } from '../repositories/IRegistroLegalRepository'
import type { IDeudaRepository } from '../repositories/IDeudaRepository'
import type { IConflictoSocialRepository } from '../repositories/IConflictoSocialRepository'
import type { IProyectoPublicoRepository } from '../repositories/IProyectoPublicoRepository'
import type { IProyectoMineroRepository } from '../repositories/IProyectoMineroRepository'
import type { IRegistroMineriaIlegalRepository } from '../repositories/IRegistroMineriaIlegalRepository'
import type { FichaEmpresa } from '../entities/ficha-empresa'
import type { Empresa } from '../entities/empresa'
import { CalcularScoreRiesgo } from './CalcularScoreRiesgo'
import { RUC_REGEX, EMPRESA_SIN_DATOS } from '../config/constantes'
import { RucInvalidoError } from '../errors'

export class ObtenerFichaEmpresa {
  constructor(
    private readonly empresaRepo:     IEmpresaRepository,
    private readonly seguridadRepo:   IRegistroSeguridadRepository,
    private readonly ambientalRepo:   IRegistroAmbientalRepository,
    private readonly legalRepo:       IRegistroLegalRepository,
    private readonly deudaRepo:       IDeudaRepository,
    private readonly conflictoRepo:   IConflictoSocialRepository,
    private readonly proyectoRepo:    IProyectoPublicoRepository,
    private readonly mineroRepo:      IProyectoMineroRepository,
    private readonly ilegalRepo:      IRegistroMineriaIlegalRepository,
    private readonly calcularScore:   CalcularScoreRiesgo,
  ) {}

  async ejecutar(ruc: string): Promise<FichaEmpresa> {
    if (!RUC_REGEX.test(ruc)) {
      throw new RucInvalidoError('El RUC debe tener 11 dígitos numéricos')
    }

    // ─── Paso 1: datos por RUC (en paralelo) ─────────────────────────────────
    // RF-04: secciones independientes — si una falla las demás continúan
    const [empresa, seguridad, ambiental, legal, deudas] = await Promise.allSettled([
      this.empresaRepo.obtenerPorRuc(ruc),
      this.seguridadRepo.obtenerPorRuc(ruc),
      this.ambientalRepo.obtenerPorRuc(ruc),
      this.legalRepo.obtenerPorRuc(ruc),
      this.deudaRepo.obtenerPorRuc(ruc),
    ])

    const empresaData: Empresa =
      empresa.status === 'fulfilled'
        ? empresa.value
        : { ruc, ...EMPRESA_SIN_DATOS }

    const seguridadData  = seguridad.status === 'fulfilled' ? seguridad.value : []
    const ambientalData  = ambiental.status === 'fulfilled' ? ambiental.value : null
    const legalData      = legal.status     === 'fulfilled' ? legal.value     : null
    const deudasData     = deudas.status    === 'fulfilled' ? deudas.value    : []

    // ─── Paso 2: datos por región (en paralelo, necesitan empresa.region) ────
    const region = empresaData.region
    const hayRegion = region && region !== EMPRESA_SIN_DATOS.region

    const [conflictos, proyectos, calidadAire, proyectosMineros, mineriaIlegal] =
      await Promise.allSettled([
        hayRegion ? this.conflictoRepo.obtenerPorRegion(region) : Promise.resolve([]),
        hayRegion ? this.proyectoRepo.obtenerPorRegion(region)  : Promise.resolve([]),
        hayRegion ? this.ambientalRepo.obtenerCalidadAirePorRegion(region) : Promise.resolve([]),
        hayRegion ? this.mineroRepo.obtenerPorRegion(region)    : Promise.resolve([]),
        hayRegion ? this.ilegalRepo.obtenerPorRegion(region)    : Promise.resolve([]),
      ])

    const conflictosData      = conflictos.status      === 'fulfilled' ? conflictos.value      : []
    const proyectosData       = proyectos.status       === 'fulfilled' ? proyectos.value       : []
    const calidadAireData     = calidadAire.status     === 'fulfilled' ? calidadAire.value     : []
    const proyectosMinData    = proyectosMineros.status === 'fulfilled' ? proyectosMineros.value : []
    const mineriaIlegalData   = mineriaIlegal.status   === 'fulfilled' ? mineriaIlegal.value   : []

    // Enriquecer ambiental con calidad de aire (no disponible por RUC, sí por región)
    const ambientalCompleto = ambientalData
      ? { ...ambientalData, calidadAire: calidadAireData }
      : calidadAireData.length > 0
        ? { empresaRuc: ruc, cantidadSanciones: 0, sancionesFirmes: 0, sanciones: [], calidadAire: calidadAireData }
        : null

    const scoreRiesgo = this.calcularScore.ejecutar({
      seguridad:  seguridadData,
      ambiental:  ambientalCompleto,
      legal:      legalData,
      deudas:     deudasData,
      conflictos: conflictosData,
    })

    return {
      empresa:               empresaData,
      scoreRiesgo,
      seguridad:             seguridadData,
      ambiental:             ambientalCompleto,
      legal:                 legalData,
      deudas:                deudasData,
      conflictos:            conflictosData,
      proyectosPublicos:     proyectosData,
      proyectosMineros:      proyectosMinData,
      registrosMineriaIlegal: mineriaIlegalData,
    }
  }
}

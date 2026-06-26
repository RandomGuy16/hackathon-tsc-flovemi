import type { RegistroSeguridad } from '../entities/registro-seguridad'
import type { RegistroAmbiental } from '../entities/registro-ambiental'
import type { RegistroLegal } from '../entities/registro-legal'
import type { DeudaFiscal } from '../entities/deuda-fiscal'
import type { ConflictoSocial } from '../entities/conflicto-social'
import { ScoreRiesgo } from '../entities/score-riesgo'
import { SCORE_PUNTOS } from '../config/constantes'

export type EntradaScoreRiesgo = {
  seguridad:  RegistroSeguridad[]
  ambiental:  RegistroAmbiental | null
  legal:      RegistroLegal | null
  deudas:     DeudaFiscal[]
  conflictos: ConflictoSocial[]
}

export class CalcularScoreRiesgo {
  ejecutar(entrada: EntradaScoreRiesgo): ScoreRiesgo {
    return new ScoreRiesgo({
      seguridad:     this.calcularSeguridad(entrada.seguridad),
      legalidad:     this.calcularLegalidad(entrada.ambiental, entrada.legal, entrada.deudas),
      impactoSocial: this.calcularImpactoSocial(entrada.conflictos),
    })
  }

  private calcularSeguridad(registros: RegistroSeguridad[]): number {
    const p = SCORE_PUNTOS.seguridad
    const mortales     = registros.reduce((s, r) => s + r.accidentesMortales, 0)
    const enfermedades = registros.reduce((s, r) => s + r.enfermedadesOcupacionales, 0)
    let puntos = 0
    if      (mortales >= p.mortalesAlto.umbral)       puntos += p.mortalesAlto.puntos
    else if (mortales >= p.mortalesMedio.umbral)       puntos += p.mortalesMedio.puntos
    if      (enfermedades >= p.enfermedadesAlto.umbral)  puntos += p.enfermedadesAlto.puntos
    else if (enfermedades >= p.enfermedadesMedio.umbral) puntos += p.enfermedadesMedio.puntos
    return Math.min(100, puntos)
  }

  private calcularLegalidad(
    ambiental: RegistroAmbiental | null,
    legal: RegistroLegal | null,
    deudas: DeudaFiscal[],
  ): number {
    const p = SCORE_PUNTOS.legalidad
    let puntos = 0
    const firmes = ambiental?.sancionesFirmes ?? 0
    if      (firmes >= p.oefaFirmesAlto.umbral)  puntos += p.oefaFirmesAlto.puntos
    else if (firmes >= p.oefaFirmesMedio.umbral)  puntos += p.oefaFirmesMedio.puntos
    const totalMultas = legal?.multasOsce.reduce((s, m) => s + m.monto, 0) ?? 0
    if      (totalMultas > p.multaOsceAlto.umbral)  puntos += p.multaOsceAlto.puntos
    else if (totalMultas > p.multaOsceMedio.umbral)  puntos += p.multaOsceMedio.puntos
    if ((legal?.penalidades.length ?? 0) > 0) puntos += p.penalidades.puntos
    if (legal?.impedidaDeContratar)           puntos += p.impedida.puntos
    if (deudas.length > 0)                    puntos += p.deudaSunat.puntos
    return Math.min(100, puntos)
  }

  private calcularImpactoSocial(conflictos: ConflictoSocial[]): number {
    const p = SCORE_PUNTOS.impactoSocial
    const activos = conflictos.filter(c => c.estado === 'activo').length
    if (activos >= p.conflictoMuchos.umbral) return p.conflictoMuchos.puntos
    if (activos >= p.conflictoUno.umbral)    return p.conflictoUno.puntos
    return 0
  }
}

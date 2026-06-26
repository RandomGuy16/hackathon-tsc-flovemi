import type { RegistroSeguridad } from '../entities/registro-seguridad'
import type { RegistroAmbiental } from '../entities/registro-ambiental'
import type { RegistroLegal } from '../entities/registro-legal'
import type { DeudaFiscal } from '../entities/deuda-fiscal'
import type { ConflictoSocial } from '../entities/conflicto-social'
import { ScoreRiesgo } from '../entities/score-riesgo'

export type EntradaScoreRiesgo = {
  seguridad: RegistroSeguridad[]
  ambiental: RegistroAmbiental | null
  legal: RegistroLegal | null
  deudas: DeudaFiscal[]
  conflictos: ConflictoSocial[]
}

export class CalcularScoreRiesgo {
  ejecutar(entrada: EntradaScoreRiesgo): ScoreRiesgo {
    return new ScoreRiesgo({
      seguridad: this.calcularSeguridad(entrada.seguridad),
      legalidad: this.calcularLegalidad(entrada.ambiental, entrada.legal, entrada.deudas),
      impactoSocial: this.calcularImpactoSocial(entrada.conflictos),
    })
  }

  private calcularSeguridad(registros: RegistroSeguridad[]): number {
    const mortales = registros.reduce((s, r) => s + r.accidentesMortales, 0)
    const enfermedades = registros.reduce((s, r) => s + r.enfermedadesOcupacionales, 0)
    let puntos = 0
    if (mortales >= 3) puntos += 50
    else if (mortales >= 1) puntos += 30
    if (enfermedades >= 10) puntos += 30
    else if (enfermedades >= 3) puntos += 15
    return Math.min(100, puntos)
  }

  private calcularLegalidad(
    ambiental: RegistroAmbiental | null,
    legal: RegistroLegal | null,
    deudas: DeudaFiscal[],
  ): number {
    let puntos = 0
    const firmes = ambiental?.sancionesFirmes ?? 0
    if (firmes >= 3) puntos += 40
    else if (firmes >= 1) puntos += 20
    const totalMultas = legal?.multasOsce.reduce((s, m) => s + m.monto, 0) ?? 0
    if (totalMultas > 100_000) puntos += 30
    else if (totalMultas > 0) puntos += 15
    if ((legal?.penalidades.length ?? 0) > 0) puntos += 15
    if (legal?.impedidaDeContratar) puntos += 30
    if (deudas.length > 0) puntos += 20
    return Math.min(100, puntos)
  }

  private calcularImpactoSocial(conflictos: ConflictoSocial[]): number {
    const activos = conflictos.filter(c => c.estado === 'activo').length
    if (activos >= 2) return 60
    if (activos === 1) return 30
    return 0
  }
}

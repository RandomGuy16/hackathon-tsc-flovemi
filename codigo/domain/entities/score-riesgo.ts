import { SCORE_PESOS, SCORE_RANGOS } from '../config/constantes'

export type NivelRiesgo = 'BAJO' | 'MEDIO' | 'ALTO'

export type DesgloseScore = {
  seguridad:     number // 0–100, peso definido en SCORE_PESOS
  legalidad:     number
  impactoSocial: number
}

export class ScoreRiesgo {
  readonly valor:    number
  readonly nivel:    NivelRiesgo
  readonly desglose: DesgloseScore

  constructor(desglose: DesgloseScore) {
    this.desglose = desglose
    this.valor = Math.round(
      desglose.seguridad     * SCORE_PESOS.seguridad +
      desglose.legalidad     * SCORE_PESOS.legalidad +
      desglose.impactoSocial * SCORE_PESOS.impactoSocial,
    )
    if (this.valor <= SCORE_RANGOS.BAJO.max)  this.nivel = 'BAJO'
    else if (this.valor <= SCORE_RANGOS.MEDIO.max) this.nivel = 'MEDIO'
    else this.nivel = 'ALTO'
  }
}

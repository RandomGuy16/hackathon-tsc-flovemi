// score final = (seguridad × 40%) + (legalidad × 35%) + (impactoSocial × 25%)
// BAJO 0–30 · MEDIO 31–60 · ALTO 61–100
export type NivelRiesgo = 'BAJO' | 'MEDIO' | 'ALTO'

export type DesgloseScore = {
  seguridad: number     // 0–100, peso 40%
  legalidad: number     // 0–100, peso 35%
  impactoSocial: number // 0–100, peso 25%
}

export class ScoreRiesgo {
  readonly valor: number
  readonly nivel: NivelRiesgo
  readonly desglose: DesgloseScore

  constructor(desglose: DesgloseScore) {
    this.desglose = desglose
    this.valor = Math.round(
      desglose.seguridad * 0.40 +
      desglose.legalidad * 0.35 +
      desglose.impactoSocial * 0.25,
    )
    if (this.valor <= 30) this.nivel = 'BAJO'
    else if (this.valor <= 60) this.nivel = 'MEDIO'
    else this.nivel = 'ALTO'
  }
}

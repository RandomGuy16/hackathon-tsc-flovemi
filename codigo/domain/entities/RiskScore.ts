export type RiskLevel = "BAJO" | "MEDIO" | "ALTO";

export type RiskScoreBreakdown = {
  safety: number;
  environmental: number;
  legal: number;
  social: number;
  investment: number;
};

export class RiskScore {
  readonly value: number;
  readonly level: RiskLevel;
  readonly breakdown: RiskScoreBreakdown;

  constructor(breakdown: RiskScoreBreakdown) {
    this.breakdown = breakdown;
    this.value =
      breakdown.safety +
      breakdown.environmental +
      breakdown.legal +
      breakdown.social +
      breakdown.investment;

    if (this.value <= 30) {
      this.level = "BAJO";
    } else if (this.value <= 60) {
      this.level = "MEDIO";
    } else {
      this.level = "ALTO";
    }
  }
}

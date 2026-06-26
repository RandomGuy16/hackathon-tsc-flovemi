import { RiskScore, RiskScoreBreakdown } from "../entities/RiskScore";

export interface CalculateRiskScore {
  execute(breakdown: RiskScoreBreakdown): RiskScore;
}

import { LatinfoAdapter } from "../../infrastructure/adapters/LatinfoAdapter";

export class GetCompanyDashboard {
  constructor(private latinfoAdapter: LatinfoAdapter) {}

  async execute(ruc: string) {
    if (!ruc || ruc.length !== 11 || !/^\d+$/.test(ruc)) {
      throw new Error("Formato de RUC inválido. Debe tener exactamente 11 dígitos.");
    }

    // 1. Fetch data using LatinfoAdapter (with cache & fallback integrated)
    const info = await this.latinfoAdapter.getCompanyData(ruc);

    // 2. Calculate Risk Score based on the rules (RF-03 & RF-05)
    // - Security: 40% (0 points currently since no MINEM safety data is configured yet)
    // - Legality: 35%
    // - Social: 25% (0 points currently)
    let safetyScore = 0;
    let socialScore = 0;
    
    // Legality Score calculation:
    // +100 points if has OSCE sanctions, OR has OEFA sanctions with status "firme"
    let legalScore = 0;
    const hasOsceSanctions = info.legal.osceSanctions.length > 0;
    
    // RF-05: OEFA sanctions only count if status is "firme"
    const hasFirmeOefaSanctions = info.environmental.sanctions.some(
      (sancion: any) => sancion.status === "firme"
    );

    if (hasOsceSanctions || hasFirmeOefaSanctions) {
      legalScore = 100;
    }

    // Weighted composite score formula
    const riskScore = Math.round(
      (safetyScore * 0.40) + (legalScore * 0.35) + (socialScore * 0.25)
    );

    // Map risk score to label (Low, Medium, High)
    let riskLevel = "BAJO";
    if (riskScore > 60) {
      riskLevel = "ALTO";
    } else if (riskScore > 30) {
      riskLevel = "MEDIO";
    }

    return {
      ruc: info.ruc,
      razonSocial: info.razonSocial,
      summary: {
        riskScore,
        riskLevel,
        lastSyncedAt: new Date().toISOString()
      },
      safety: {
        fatalAccidents: 0,
        occupationalDiseases: 0,
        osinergminFinesCount: 0,
        finesList: [],
        source: "MINEM (Sin datos locales)"
      },
      environmental: info.environmental,
      legal: info.legal,
      social: {
        activeConflicts: 0,
        conflicts: []
      },
      investment: {
        publicProjects: [],
        totalBudget: 0
      }
    };
  }
}

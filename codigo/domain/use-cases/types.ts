import { Company } from "../entities/Company";
import { SafetyRecord } from "../entities/SafetyRecord";
import { EnvironmentalRecord } from "../entities/EnvironmentalRecord";
import { LegalRecord } from "../entities/LegalRecord";
import { SocialConflict } from "../entities/SocialConflict";
import { PublicProject } from "../entities/PublicProject";
import { RiskScore } from "../entities/RiskScore";

export type CompanyDashboard = {
  company: Company;
  summary: {
    riskScore: RiskScore;
    lastSyncedAt: string | null;
  };
  safety: SafetyRecord[];
  environmental: EnvironmentalRecord | null;
  legal: LegalRecord | null;
  social: SocialConflict[];
  investment: PublicProject[];
};

export type RegionSummary = {
  region: string;
  companies: Company[];
  conflicts: SocialConflict[];
  projects: PublicProject[];
};

import { Company } from "../entities/Company";
import { SafetyRecord } from "../entities/SafetyRecord";
import { EnvironmentalRecord } from "../entities/EnvironmentalRecord";
import { LegalRecord } from "../entities/LegalRecord";
import { SocialConflict } from "../entities/SocialConflict";
import { PublicProject } from "../entities/PublicProject";
import { MiningProject } from "../entities/MiningProject";
import { IllegalMiningRecord } from "../entities/IllegalMiningRecord";
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
  miningProjects: MiningProject[];
  illegalMining: IllegalMiningRecord[];
};

export type RegionSummary = {
  region: string;
  companies: Company[];
  conflicts: SocialConflict[];
  projects: PublicProject[];
  miningProjects: MiningProject[];
  illegalMining: IllegalMiningRecord[];
};

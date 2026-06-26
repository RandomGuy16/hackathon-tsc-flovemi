export type MiningProjectStatus =
  | "de_acuerdo"
  | "paralizado"
  | "en_tramite"
  | "cerrado";

export type MiningProject = {
  id: string;
  companyRuc: string | null;
  name: string;
  status: MiningProjectStatus;
  location: string;
  process: string;
  mineralType: string;
  estimatedMonthsRemaining: number | null;
  region: string;
  province: string | null;
  district: string | null;
  latitude: number | null;
  longitude: number | null;
};

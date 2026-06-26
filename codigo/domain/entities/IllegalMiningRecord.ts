export type RegularizationStatus =
  | "sin_tramite"
  | "en_tramite"
  | "regularizado"
  | "desestimado";

export type IllegalMiningRecord = {
  id: string;
  companyRuc: string | null;
  location: string;
  region: string;
  province: string | null;
  district: string | null;
  reason: string;
  regularizationStatus: RegularizationStatus;
  detectedAt: string | null;
  latitude: number | null;
  longitude: number | null;
};

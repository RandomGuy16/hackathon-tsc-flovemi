export type SocialConflict = {
  id: string;
  region: string;
  province: string;
  district: string;
  description: string;
  status: "activo" | "inactivo" | "resuelto";
  relatedCompanyRuc: string | null;
  reportedAt: string;
};

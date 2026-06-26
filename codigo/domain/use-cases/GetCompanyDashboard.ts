import { CompanyDashboard } from "./types";

export interface GetCompanyDashboard {
  execute(ruc: string): Promise<CompanyDashboard | null>;
}

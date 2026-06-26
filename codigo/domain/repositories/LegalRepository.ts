import { LegalRecord } from "../entities/LegalRecord";

export interface LegalRepository {
  findByCompanyRuc(ruc: string): Promise<LegalRecord | null>;
}

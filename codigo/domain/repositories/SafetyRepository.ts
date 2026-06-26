import { SafetyRecord } from "../entities/SafetyRecord";

export interface SafetyRepository {
  findByCompanyRuc(ruc: string): Promise<SafetyRecord[]>;
}

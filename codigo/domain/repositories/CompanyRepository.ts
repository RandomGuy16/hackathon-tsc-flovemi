import { Company } from "../entities/Company";

export interface CompanyRepository {
  searchByName(name: string): Promise<Company[]>;
  findByRuc(ruc: string): Promise<Company | null>;
  findByRegion(region: string): Promise<Company[]>;
}

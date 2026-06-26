import { Company } from "../entities/Company";

export interface SearchCompanies {
  execute(query: string): Promise<Company[]>;
}

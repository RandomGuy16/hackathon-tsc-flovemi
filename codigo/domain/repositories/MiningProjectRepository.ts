import { MiningProject } from "../entities/MiningProject";

export interface MiningProjectRepository {
  findByCompanyRuc(ruc: string): Promise<MiningProject[]>;
  findByRegion(region: string): Promise<MiningProject[]>;
}

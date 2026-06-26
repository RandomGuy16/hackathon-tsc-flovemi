import { SocialConflict } from "../entities/SocialConflict";

export interface SocialConflictRepository {
  findByRegion(region: string): Promise<SocialConflict[]>;
  findByCompanyRuc(ruc: string): Promise<SocialConflict[]>;
}

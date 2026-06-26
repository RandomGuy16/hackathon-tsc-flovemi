import { PublicProject } from "../entities/PublicProject";

export interface PublicProjectRepository {
  findByRegion(region: string): Promise<PublicProject[]>;
}

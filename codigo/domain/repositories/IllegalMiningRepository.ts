import { IllegalMiningRecord } from "../entities/IllegalMiningRecord";

export interface IllegalMiningRepository {
  findByCompanyRuc(ruc: string): Promise<IllegalMiningRecord[]>;
  findByRegion(region: string): Promise<IllegalMiningRecord[]>;
}

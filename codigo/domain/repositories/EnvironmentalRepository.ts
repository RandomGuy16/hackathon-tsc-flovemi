import { EnvironmentalRecord } from "../entities/EnvironmentalRecord";
import { AirQualityRecord } from "../entities/AirQualityRecord";

export interface EnvironmentalRepository {
  findByCompanyRuc(ruc: string): Promise<EnvironmentalRecord | null>;
  findAirQualityByRegion(region: string): Promise<AirQualityRecord[]>;
}

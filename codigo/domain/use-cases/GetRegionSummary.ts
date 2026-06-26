import { RegionSummary } from "./types";

export interface GetRegionSummary {
  execute(region: string): Promise<RegionSummary | null>;
}

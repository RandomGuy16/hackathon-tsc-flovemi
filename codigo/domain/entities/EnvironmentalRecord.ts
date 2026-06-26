import { AirQualityRecord } from "./AirQualityRecord";

export type EnvironmentalSanction = {
  authority: string;
  date: string;
  description: string;
  amount: number | null;
};

export type EnvironmentalRecord = {
  companyRuc: string;
  sanctionsCount: number;
  sanctions: EnvironmentalSanction[];
  airQuality: AirQualityRecord[];
};

export type SafetyRecord = {
  id: string;
  companyRuc: string;
  year: number;
  fatalAccidents: number;
  occupationalDiseases: number;
  sourceUrl: string | null;
};

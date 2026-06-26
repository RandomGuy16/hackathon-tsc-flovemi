export type PublicProject = {
  id: string;
  region: string;
  name: string;
  budget: number;
  physicalProgress: number;
  executor: string;
  latitude: number | null;
  longitude: number | null;
};

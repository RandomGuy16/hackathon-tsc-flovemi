import {
  CompanyDashboard,
  CompanySearchResponse,
  RegionSummary,
} from "./types";

export const mockSearchResponse: CompanySearchResponse = {
  data: [
    {
      ruc: "20100047218",
      razonSocial: "MINERA LOS QUENUALES S.A.",
      region: "La Libertad",
      province: "Viru",
      district: "Viru",
    },
  ],
};

export const mockCompanyDashboard: CompanyDashboard = {
  ruc: "20100047218",
  razonSocial: "MINERA LOS QUENUALES S.A.",
  summary: {
    riskLevel: "ALTO",
    riskScore: 70,
    lastSyncedAt: "2026-06-26T10:00:00Z",
  },
  safety: {
    fatalAccidents: 3,
    occupationalDiseases: 12,
    source: "MINEM",
  },
  environmental: {
    sanctionsCount: 2,
    sanctions: [
      {
        authority: "OEFA",
        date: "2024-03-15",
        description: "Incumplimiento de norma ambiental",
        amount: 15000,
      },
    ],
    airQuality: [
      {
        stationName: "Estación Virú",
        year: 2024,
        parameter: "PM2.5",
        value: 35.5,
        unit: "µg/m³",
      },
    ],
  },
  legal: {
    osceSanctions: [],
    osceFines: [],
    tenders: [],
  },
  social: {
    activeConflicts: 1,
    conflicts: [
      {
        region: "La Libertad",
        province: "Viru",
        district: "Viru",
        description: "Conflicto por uso de agua",
        status: "activo",
        reportedAt: "2025-01-20",
      },
    ],
  },
  investment: {
    publicProjects: [
      {
        name: "Mejoramiento vial Virú",
        budget: 5000000,
        physicalProgress: 0.35,
        executor: "Municipalidad Provincial de Virú",
      },
    ],
    totalBudget: 5000000,
  },
  miningProjects: [
    {
      id: "proj-001",
      name: "Proyecto Andino",
      status: "de_acuerdo",
      location: "La Libertad",
      process: "exploracion",
      mineralType: "cobre",
      estimatedMonthsRemaining: 18,
    },
    {
      id: "proj-002",
      name: "Proyecto Norte",
      status: "paralizado",
      location: "La Libertad",
      process: "cierre",
      mineralType: "oro",
      estimatedMonthsRemaining: null,
    },
  ],
  illegalMining: [
    {
      id: "illegal-001",
      location: "Virú",
      reason: "Sin permiso de extracción en zona de amortiguamiento",
      regularizationStatus: "en_tramite",
      detectedAt: "2024-08-15",
    },
  ],
};

export const mockRegionSummary: RegionSummary = {
  region: "La Libertad",
  companies: [
    {
      ruc: "20100047218",
      razonSocial: "MINERA LOS QUENUALES S.A.",
      latitude: -8.641,
      longitude: -78.748,
      riskLevel: "ALTO",
    },
  ],
  conflicts: [
    {
      description: "Conflicto por uso de agua",
      latitude: -8.641,
      longitude: -78.748,
      status: "activo",
    },
  ],
  projects: [
    {
      name: "Mejoramiento vial Virú",
      budget: 5000000,
      latitude: -8.641,
      longitude: -78.748,
    },
  ],
  miningProjects: [
    {
      id: "proj-001",
      name: "Proyecto Andino",
      status: "de_acuerdo",
      location: "La Libertad",
      process: "exploracion",
      mineralType: "cobre",
      estimatedMonthsRemaining: 18,
    },
  ],
  illegalMining: [
    {
      id: "illegal-001",
      location: "Virú",
      reason: "Sin permiso de extracción",
      regularizationStatus: "en_tramite",
    },
  ],
};

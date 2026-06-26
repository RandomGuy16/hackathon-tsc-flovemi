import {
  CompanyDashboard,
  CompanySearchResponse,
  RegionSummary,
} from "./types";
import {
  mockCompanyDashboard,
  mockRegionSummary,
  mockSearchResponse,
} from "./mocks";

const FORCE_MOCKS = process.env.NEXT_PUBLIC_USE_MOCKS === "true";

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export async function searchCompanies(
  query: string
): Promise<CompanySearchResponse> {
  if (FORCE_MOCKS) {
    return Promise.resolve(mockSearchResponse);
  }
  try {
    const result = await fetchJson<CompanySearchResponse>(
      `/api/companies?search=${encodeURIComponent(query)}`
    );
    // Fallback a mocks si la API real no devuelve resultados
    if (!result?.data?.length) {
      return mockSearchResponse;
    }
    return result;
  } catch {
    return mockSearchResponse;
  }
}

export async function getCompanyDashboard(
  ruc: string
): Promise<CompanyDashboard> {
  if (FORCE_MOCKS) {
    return Promise.resolve({
      ...mockCompanyDashboard,
      ruc,
    });
  }
  try {
    const result = await fetchJson<CompanyDashboard>(`/api/companies/${ruc}/dashboard`);
    // Fallback a mocks si el dashboard real está vacío o incompleto
    if (!result?.razonSocial) {
      return { ...mockCompanyDashboard, ruc };
    }
    return result;
  } catch {
    return { ...mockCompanyDashboard, ruc };
  }
}

export async function getRegionSummary(
  region: string
): Promise<RegionSummary> {
  if (FORCE_MOCKS) {
    return Promise.resolve(mockRegionSummary);
  }
  try {
    const result = await fetchJson<RegionSummary>(
      `/api/regions/${encodeURIComponent(region)}`
    );
    // Fallback a mocks si la región real no tiene datos
    if (!result?.companies?.length) {
      return mockRegionSummary;
    }
    return result;
  } catch {
    return mockRegionSummary;
  }
}

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

const USE_MOCKS = process.env.NEXT_PUBLIC_USE_MOCKS === "true";

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
  if (USE_MOCKS) {
    return Promise.resolve(mockSearchResponse);
  }
  return fetchJson<CompanySearchResponse>(
    `/api/companies?search=${encodeURIComponent(query)}`
  );
}

export async function getCompanyDashboard(
  ruc: string
): Promise<CompanyDashboard> {
  if (USE_MOCKS) {
    return Promise.resolve({
      ...mockCompanyDashboard,
      ruc,
    });
  }
  return fetchJson<CompanyDashboard>(`/api/companies/${ruc}/dashboard`);
}

export async function getRegionSummary(
  region: string
): Promise<RegionSummary> {
  if (USE_MOCKS) {
    return Promise.resolve(mockRegionSummary);
  }
  return fetchJson<RegionSummary>(
    `/api/regions/${encodeURIComponent(region)}`
  );
}

from pydantic import BaseModel, Field
from typing import List, Optional, Any

# ─── /api/companies?search= ───────────────────────────────────────────────────

class CompanySearchItem(BaseModel):
    ruc: str
    razonSocial: str
    region: str
    province: Optional[str] = None
    district: Optional[str] = None

class CompanySearchResponse(BaseModel):
    data: List[CompanySearchItem]

# ─── /api/companies/[ruc]/dashboard ──────────────────────────────────────────

class DashboardSummary(BaseModel):
    riskLevel: str
    riskScore: int
    lastSyncedAt: str

class DashboardSafety(BaseModel):
    fatalAccidents: int
    occupationalDiseases: int
    source: str = "MINEM"

class EnvironmentalSanction(BaseModel):
    authority: str
    date: str
    description: str
    amount: Optional[float] = None

class AirQualityRecord(BaseModel):
    stationName: str
    year: int
    parameter: str
    value: float
    unit: str

class DashboardEnvironmental(BaseModel):
    sanctionsCount: int
    sanctions: List[EnvironmentalSanction]
    airQuality: List[AirQualityRecord]

class OsceSanction(BaseModel):
    authority: str
    date: str
    description: str

class OsceFine(BaseModel):
    authority: str
    date: str
    amount: float
    currency: str

class TenderRecord(BaseModel):
    code: str
    title: str
    date: str
    amount: Optional[float] = None
    currency: Optional[str] = None

class SunatDebt(BaseModel):
    amount: float
    status: str
    authority: str = "SUNAT"
    resolutionsCount: int = 1

class DashboardLegal(BaseModel):
    osceSanctions: List[OsceSanction]
    osceFines: List[OsceFine]
    tenders: List[TenderRecord]
    sunatStatus: str
    sunatCondition: str
    sunatAddress: str
    sunatLocales: List[Any]
    sunatDebts: List[SunatDebt]

class SocialConflictRecord(BaseModel):
    region: str
    province: Optional[str] = None
    district: Optional[str] = None
    description: str
    status: str
    reportedAt: Optional[str] = None

class DashboardSocial(BaseModel):
    activeConflicts: int
    conflicts: List[SocialConflictRecord]

class PublicProjectRecord(BaseModel):
    name: str
    budget: float
    physicalProgress: float
    executor: str

class DashboardInvestment(BaseModel):
    publicProjects: List[PublicProjectRecord]
    totalBudget: float

class MiningProjectRecord(BaseModel):
    id: str
    name: str
    status: str
    location: str
    process: str
    mineralType: str
    estimatedMonthsRemaining: Optional[int] = None

class IllegalMiningRecord(BaseModel):
    id: str
    location: str
    reason: str
    regularizationStatus: str
    detectedAt: Optional[str] = None

class CompanyDashboardResponse(BaseModel):
    ruc: str
    razonSocial: str
    summary: DashboardSummary
    safety: DashboardSafety
    environmental: DashboardEnvironmental
    legal: DashboardLegal
    social: DashboardSocial
    investment: DashboardInvestment
    miningProjects: List[MiningProjectRecord]
    illegalMining: List[IllegalMiningRecord]

# ─── /api/regions/[region] ────────────────────────────────────────────────────

class RegionCompany(BaseModel):
    ruc: str
    razonSocial: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    riskLevel: Optional[str] = None

class RegionConflict(BaseModel):
    description: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    status: str

class RegionProject(BaseModel):
    name: str
    budget: float
    latitude: Optional[float] = None
    longitude: Optional[float] = None

class RegionSummaryResponse(BaseModel):
    region: str
    companies: List[RegionCompany]
    conflicts: List[RegionConflict]
    projects: List[RegionProject]
    miningProjects: List[MiningProjectRecord]
    illegalMining: List[IllegalMiningRecord]

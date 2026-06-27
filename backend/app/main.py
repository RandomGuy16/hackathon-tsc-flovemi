from fastapi import FastAPI, HTTPException, Query, Path
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.dto.schemas import CompanySearchResponse, CompanyDashboardResponse, RegionSummaryResponse
from app.services.company_service import CompanyService
from app.services.dashboard_service import DashboardService
from app.services.region_service import RegionService
from app.services.crawler import MiningCrawler

app = FastAPI(
    title="MineraWatch API",
    description="FastAPI service replacing direct Supabase calls and Next.js routes",
    version="1.0.0"
)

# Configure CORS
origins = [origin.strip() for origin in settings.cors_origins.split(",") if origin.strip()]
if "*" in origins or not origins:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
else:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

# Instantiate services
company_service = CompanyService()
dashboard_service = DashboardService()
region_service = RegionService()

@app.get("/health")
def health_check():
    return {"status": "ok", "message": "MineraWatch backend is running"}

@app.get("/api/companies", response_model=CompanySearchResponse)
async def search_companies(
    search: str = Query(..., min_length=3, description="Search term (min 3 characters)")
):
    try:
        companies = await company_service.buscar(search)
        return {"data": companies}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error searching companies: {str(e)}")

@app.get("/api/companies/{ruc}/dashboard", response_model=CompanyDashboardResponse)
async def get_company_dashboard(
    ruc: str = Path(..., pattern=r"^\d{11}$", description="11-digit RUC")
):
    try:
        dashboard = await dashboard_service.obtener_ficha(ruc)
        return dashboard
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error compiling company dashboard: {str(e)}")

@app.get("/api/regions/{region}", response_model=RegionSummaryResponse)
async def get_region_summary(
    region: str = Path(..., description="Name of the region (e.g. La Libertad)")
):
    try:
        summary = await region_service.obtener_resumen(region)
        return summary
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error compiling region summary: {str(e)}")

@app.post("/api/tasks/crawl-mining")
async def trigger_mining_crawler():
    try:
        crawler = MiningCrawler()
        result = await crawler.run_crawl()
        return {"status": "success", "result": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Crawler task failed: {str(e)}")


import asyncio
from typing import List
from app.services.supabase_client import get_supabase_client
from app.services.dashboard_service import normalizar_texto, get_proyectos_consolidados_local

class RegionService:
    async def obtener_resumen(self, region: str) -> dict:
        supabase = get_supabase_client()

        # 1. Definir tareas asíncronas para cada consulta en paralelo
        async def fetch_companies():
            try:
                res = await asyncio.to_thread(
                    lambda: supabase.table("companies").select("*").ilike("region", region).execute()
                )
                return [
                    {
                        "ruc": r.get("ruc"),
                        "razonSocial": r.get("razon_social") or "",
                        "latitude": r.get("latitude"),
                        "longitude": r.get("longitude"),
                        "riskLevel": None
                    }
                    for r in res.data
                ] if res.data else []
            except Exception as e:
                print(f"[RegionService] Error fetching companies: {e}")
                return []

        async def fetch_conflicts():
            try:
                res = await asyncio.to_thread(
                    lambda: supabase.table("social_conflicts").select("*").ilike("region", region).execute()
                )
                return [
                    {
                        "description": r.get("description") or "",
                        "latitude": r.get("latitude"),
                        "longitude": r.get("longitude"),
                        "status": r.get("status") or "activo"
                    }
                    for r in res.data
                ] if res.data else []
            except Exception as e:
                print(f"[RegionService] Error fetching conflicts: {e}")
                return []

        async def fetch_projects():
            try:
                res = await asyncio.to_thread(
                    lambda: supabase.table("public_projects").select("*").ilike("region", region).execute()
                )
                return [
                    {
                        "name": r.get("name") or "",
                        "budget": float(r.get("budget") or 0),
                        "latitude": r.get("latitude"),
                        "longitude": r.get("longitude")
                    }
                    for r in res.data
                ] if res.data else []
            except Exception as e:
                print(f"[RegionService] Error fetching public projects: {e}")
                return []

        async def fetch_mining_projects():
            try:
                res = await asyncio.to_thread(
                    lambda: supabase.table("mining_projects").select("*").ilike("region", region).execute()
                )
                if res.data:
                    return [
                        {
                            "id": r.get("id"),
                            "name": r.get("name"),
                            "status": r.get("status"),
                            "location": r.get("location") or "",
                            "process": r.get("process") or "",
                            "mineralType": r.get("mineral_type") or "",
                            "estimatedMonthsRemaining": r.get("estimated_months_remaining")
                        }
                        for r in res.data
                    ]
            except Exception as e:
                print(f"[RegionService] Supabase mining projects fetch failed, trying local fallback: {e}")

            # Local fallback
            local_proyectos = get_proyectos_consolidados_local()
            region_norm = normalizar_texto(region)
            return [
                {
                    "id": p.get("id"),
                    "name": p.get("nombre"),
                    "status": p.get("estado"),
                    "location": p.get("ubicacion") or "",
                    "process": p.get("proceso") or "",
                    "mineralType": p.get("tipoMineral") or "",
                    "estimatedMonthsRemaining": p.get("mesesRestantesEstimados")
                }
                for p in local_proyectos
                if normalizar_texto(p.get("region", "")) == region_norm
            ]

        async def fetch_illegal_mining():
            try:
                res = await asyncio.to_thread(
                    lambda: supabase.table("illegal_mining").select("*").ilike("region", region).execute()
                )
                return [
                    {
                        "id": r.get("id"),
                        "location": r.get("location") or "",
                        "reason": r.get("reason") or "",
                        "regularizationStatus": r.get("regularization_status"),
                        "detectedAt": r.get("detected_at")
                    }
                    for r in res.data
                ] if res.data else []
            except Exception as e:
                print(f"[RegionService] Error fetching illegal mining: {e}")
                return []

        # 2. Ejecutar todas en paralelo
        companies, conflicts, projects, mining_projects, illegal_mining = await asyncio.gather(
            fetch_companies(),
            fetch_conflicts(),
            fetch_projects(),
            fetch_mining_projects(),
            fetch_illegal_mining()
        )

        # 3. Retornar DTO formateado
        return {
            "region": region,
            "companies": companies,
            "conflicts": conflicts,
            "projects": projects,
            "miningProjects": mining_projects,
            "illegalMining": illegal_mining
        }

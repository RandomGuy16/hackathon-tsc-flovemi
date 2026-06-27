from datetime import datetime, timedelta, timezone
from typing import List, Optional
from app.services.supabase_client import get_supabase_client
from app.services.latinfo_client import LatinfoClient

EMPRESAS_SEMILLA_LOCAL = [
    {
        "ruc": "20100047218",
        "razonSocial": "MINERA LOS QUENUALES S.A.",
        "estado": "activa",
        "region": "La Libertad",
        "provincia": "Viru",
        "distrito": "Viru",
        "latitud": -8.641,
        "longitud": -78.748
    },
    {
        "ruc": "20340596821",
        "razonSocial": "COMPAÑIA MINERA BARRICK MISQUICHILCA S.A.",
        "estado": "activa",
        "region": "Ancash",
        "provincia": "Huaraz",
        "distrito": "Janghas",
        "latitud": -9.531,
        "longitud": -77.528
    },
    {
        "ruc": "20100030595",
        "razonSocial": "SOUTHERN PERU COPPER CORPORATION",
        "estado": "activa",
        "region": "Moquegua",
        "provincia": "Ilo",
        "distrito": "Pacocha",
        "latitud": -17.643,
        "longitud": -71.341
    },
    {
        "ruc": "20552265531",
        "razonSocial": "MINERA LAS BAMBAS S.A.",
        "estado": "activa",
        "region": "Apurimac",
        "provincia": "Cotabambas",
        "distrito": "Challhuahuacho",
        "latitud": -14.043,
        "longitud": -72.718
    },
    {
        "ruc": "20100079411",
        "razonSocial": "COMPAÑIA DE MINAS BUENAVENTURA S.A.A.",
        "estado": "activa",
        "region": "Huancavelica",
        "provincia": "Castrovirreyna",
        "distrito": "Castrovirreyna",
        "latitud": -13.279,
        "longitud": -75.319
    }
]

def map_row_empresa(row: dict) -> dict:
    return {
        "ruc": row.get("ruc"),
        "razonSocial": row.get("razon_social") or "",
        "estado": row.get("estado") or "activa",
        "region": row.get("region") or "",
        "provincia": row.get("province"),
        "distrito": row.get("district"),
        "latitud": row.get("latitude"),
        "longitud": row.get("longitude"),
        "condicion": row.get("condicion"),
        "domicilioFiscal": row.get("domicilio_fiscal"),
        "locales": row.get("locales"),
    }

def map_kyb_empresa(kyb: dict) -> dict:
    identity = kyb.get("identity") or {}
    public_entity = kyb.get("public_entity") or {}
    return {
        "ruc": kyb.get("ruc"),
        "razonSocial": identity.get("razon_social") or "",
        "estado": "activa" if (identity.get("estado") or "INACTIVA").upper() == "ACTIVO" else "inactiva",
        "region": public_entity.get("departamento") or "",
        "provincia": public_entity.get("provincia"),
        "distrito": public_entity.get("distrito"),
        "latitud": None,
        "longitud": None,
        "condicion": identity.get("condicion"),
        "domicilioFiscal": identity.get("domicilio_fiscal") or kyb.get("domicilio_fiscal"),
        "locales": identity.get("locales") or kyb.get("locales"),
    }

def persistir_kyb(supabase_client, kyb: dict):
    try:
        identity = kyb.get("identity") or {}
        public_entity = kyb.get("public_entity") or {}
        # Persistir en companies
        supabase_client.table("companies").upsert({
            "ruc": kyb.get("ruc"),
            "razon_social": identity.get("razon_social"),
            "region": public_entity.get("departamento"),
            "province": public_entity.get("provincia"),
            "district": public_entity.get("distrito"),
        }, on_conflict="ruc").execute()

        # Persistir en latinfo_cache
        supabase_client.table("latinfo_cache").upsert({
            "ruc": kyb.get("ruc"),
            "payload": kyb,
            "fetched_at": datetime.now(timezone.utc).isoformat(),
            "source_status": "ok",
        }, on_conflict="ruc").execute()
    except Exception as e:
        print(f"[CompanyService] Error persisting KYB in Supabase: {e}")

class CompanyService:
    def __init__(self):
        self.latinfo = LatinfoClient()

    async def buscar(self, termino: str) -> List[dict]:
        try:
            # 1. Intentar buscar en latinfo.dev
            res = await self.latinfo.buscar_por_nombre(termino)
            if isinstance(res, list):
                return [
                    {
                        "ruc": r.get("id"),
                        "razonSocial": r.get("razon_social"),
                        "region": "",
                        "province": None,
                        "district": None,
                    }
                    for r in res
                ]
        except Exception as e:
            print(f"[CompanyService] Latinfo search failed, trying Supabase fallback: {e}")

        # Fallback 1: Buscar en la tabla 'companies' de Supabase
        try:
            supabase = get_supabase_client()
            res = supabase.table("companies").select("*").or_(f"razon_social.ilike.%{termino}%,ruc.eq.{termino}").execute()
            if res.data:
                return [
                    {
                        "ruc": r.get("ruc"),
                        "razonSocial": r.get("razon_social"),
                        "region": r.get("region") or "",
                        "province": r.get("province"),
                        "district": r.get("district"),
                    }
                    for r in res.data
                ]
        except Exception as e:
            print(f"[CompanyService] Supabase search fallback failed: {e}")

        # Fallback 2: Semilla local
        print("[CompanyService] Using local seed fallback for search...")
        termino_limpio = (termino or "").lower().strip()
        return [
            {
                "ruc": e["ruc"],
                "razonSocial": e["razonSocial"],
                "region": e["region"],
                "province": e["provincia"],
                "district": e["distrito"],
            }
            for e in EMPRESAS_SEMILLA_LOCAL
            if termino_limpio in e["razonSocial"].lower() or termino_limpio in e["ruc"]
        ]

    async def obtener_por_ruc(self, ruc: str) -> dict:
        supabase = None
        try:
            supabase = get_supabase_client()
        except Exception as e:
            print(f"[CompanyService] Could not initialize Supabase client: {e}")

        if supabase:
            try:
                # 1. Intentar leer de latinfo_cache con un TTL de 30 minutos
                ttl_limit = (datetime.now(timezone.utc) - timedelta(minutes=30)).isoformat()
                res = supabase.table("latinfo_cache").select("payload").eq("ruc", ruc).gt("fetched_at", ttl_limit).execute()
                if res.data:
                    payload = res.data[0].get("payload")
                    if payload:
                        return map_kyb_empresa(payload)

                # 2. Si no hay cache, intentar leer de la tabla 'companies'
                res_company = supabase.table("companies").select("*").eq("ruc", ruc).execute()
                if res_company.data:
                    return map_row_empresa(res_company.data[0])
            except Exception as e:
                print(f"[CompanyService] Error reading cache/companies: {e}")

        # 3. Llamar a latinfo.dev y guardar en BD si tiene éxito
        try:
            kyb = await self.latinfo.obtener_kyb(ruc)
            if supabase:
                persistir_kyb(supabase, kyb)
            return map_kyb_empresa(kyb)
        except Exception as e:
            print(f"[CompanyService] Latinfo fetch failed for RUC {ruc}: {e}")

            # Fallback a semilla local
            for e in EMPRESAS_SEMILLA_LOCAL:
                if e["ruc"] == ruc:
                    print(f"[CompanyService] Local seed fallback successful for RUC {ruc}")
                    return e
            raise ValueError(f"Company with RUC {ruc} not found in any source.")

    async def buscar_por_region(self, region: str) -> List[dict]:
        try:
            supabase = get_supabase_client()
            res = supabase.table("companies").select("*").ilike("region", region).execute()
            return [map_row_empresa(r) for r in res.data] if res.data else []
        except Exception as e:
            print(f"[CompanyService] Error fetching companies by region: {e}")
            return [e for e in EMPRESAS_SEMILLA_LOCAL if e["region"].lower() == region.lower()]

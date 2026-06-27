import asyncio
import os
import json
from datetime import datetime, timezone
from typing import Optional, List
from app.services.supabase_client import get_supabase_client
from app.services.latinfo_client import LatinfoClient
from app.services.company_service import CompanyService, map_kyb_empresa

# Local seed fallbacks
PROYECTOS_CONSOLIDADOS_PATH = "/home/aroon/Projects/hackathon-tsc-flovemi/codigo/public/proyectos_consolidados.json"

def normalizar_texto(str_val: str) -> str:
    if not str_val:
        return ""
    import unicodedata
    # Remove accents and normalize
    nfkd_form = unicodedata.normalize('NFKD', str_val)
    return "".join([c for c in nfkd_form if not unicodedata.combining(c)]).lower().strip()

def get_proyectos_consolidados_local() -> list:
    if os.path.exists(PROYECTOS_CONSOLIDADOS_PATH):
        try:
            with open(PROYECTOS_CONSOLIDADOS_PATH, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception as e:
            print(f"[DashboardService] Error reading local projects file: {e}")
    return []

class DashboardService:
    def __init__(self):
        self.company_service = CompanyService()
        self.latinfo = LatinfoClient()

    async def obtener_ficha(self, ruc: str) -> dict:
        # 1. Obtener datos de la empresa y el KYB de latinfo/cache
        # Para evitar llamadas duplicadas a la API o DB, obtenemos el KYB completo de latinfo/cache directamente
        supabase = get_supabase_client()
        kyb = None
        empresa_data = None

        try:
            # Intentar leer desde latinfo_cache
            from app.services.company_service import leer_cache_kyb, persistir_kyb
            kyb = await asyncio.to_thread(leer_cache_kyb, supabase, ruc)
            if kyb:
                empresa_data = map_kyb_empresa(kyb)
        except Exception as e:
            print(f"[DashboardService] Cache read failed: {e}")

        if not kyb:
            try:
                # Si no está en caché, intentar obtener de latinfo.dev
                kyb = await self.latinfo.obtener_kyb(ruc)
                # Persistir en caché
                await asyncio.to_thread(persistir_kyb, supabase, kyb)
                empresa_data = map_kyb_empresa(kyb)
            except Exception as e:
                print(f"[DashboardService] Latinfo fetch failed: {e}")
                # Fallback a empresa básica (semilla o tabla de companies)
                try:
                    empresa_data = await self.company_service.obtener_por_ruc(ruc)
                except Exception as ex:
                    print(f"[DashboardService] Company fetch fallback failed: {ex}")
                    empresa_data = {
                        "ruc": ruc,
                        "razonSocial": "No disponible",
                        "estado": "inactiva",
                        "region": "No disponible",
                        "provincia": None,
                        "distrito": None,
                        "latitud": None,
                        "longitud": None,
                        "condicion": None,
                        "domicilioFiscal": None,
                        "locales": []
                    }

        # 2. Consultar datos en paralelo usando asyncio.gather y asyncio.to_thread
        region = empresa_data.get("region", "")
        hay_region = bool(region and region != "No disponible")

        # Definir tareas de Supabase
        async def fetch_safety():
            try:
                res = await asyncio.to_thread(
                    lambda: supabase.table("safety_records").select("*").eq("company_ruc", ruc).execute()
                )
                return [
                    {
                        "año": r.get("year"),
                        "accidentesMortales": r.get("fatal_accidents") or 0,
                        "enfermedadesOcupacionales": r.get("occupational_diseases") or 0,
                    }
                    for r in res.data
                ] if res.data else []
            except Exception as e:
                print(f"[DashboardService] Error fetching safety records: {e}")
                return []

        async def fetch_ambiental():
            try:
                res = await asyncio.to_thread(
                    lambda: supabase.table("oefa_sanctions").select("*").eq("company_ruc", ruc).order("sanction_date", desc=True).execute()
                )
                sanciones = [
                    {
                        "autoridad": r.get("authority") or "OEFA",
                        "fecha": r.get("sanction_date") or "",
                        "descripcion": r.get("description") or "",
                        "monto": r.get("amount"),
                        "estado": r.get("status") or "firme",
                    }
                    for r in res.data
                ] if res.data else []
                
                return {
                    "empresaRuc": ruc,
                    "cantidadSanciones": len(sanciones),
                    "sancionesFirmes": sum(1 for s in sanciones if s["estado"] == "firme"),
                    "sanciones": sanciones,
                    "calidadAire": []
                }
            except Exception as e:
                print(f"[DashboardService] Error fetching environmental sanctions: {e}")
                return {
                    "empresaRuc": ruc,
                    "cantidadSanciones": 0,
                    "sancionesFirmes": 0,
                    "sanciones": [],
                    "calidadAire": []
                }

        async def fetch_conflictos():
            if not hay_region:
                return []
            try:
                res = await asyncio.to_thread(
                    lambda: supabase.table("social_conflicts").select("*").ilike("region", region).execute()
                )
                return [
                    {
                        "region": r.get("region"),
                        "provincia": r.get("province"),
                        "distrito": r.get("district"),
                        "descripcion": r.get("description") or "",
                        "estado": r.get("status") or "activo",
                        "reportadoEn": r.get("reported_at"),
                    }
                    for r in res.data
                ] if res.data else []
            except Exception as e:
                print(f"[DashboardService] Error fetching social conflicts: {e}")
                return []

        async def fetch_proyectos_publicos():
            if not hay_region:
                return []
            try:
                res = await asyncio.to_thread(
                    lambda: supabase.table("public_projects").select("*").ilike("region", region).execute()
                )
                return [
                    {
                        "nombre": r.get("name") or "",
                        "presupuesto": float(r.get("budget") or 0),
                        "avanceFisico": float(r.get("physical_progress") or 0),
                        "ejecutor": r.get("executor") or "",
                    }
                    for r in res.data
                ] if res.data else []
            except Exception as e:
                print(f"[DashboardService] Error fetching public projects: {e}")
                return []

        async def fetch_calidad_aire():
            if not hay_region:
                return []
            try:
                res = await asyncio.to_thread(
                    lambda: supabase.table("air_quality").select("*").ilike("region", region).order("year", desc=True).limit(20).execute()
                )
                return [
                    {
                        "nombreEstacion": r.get("station_name") or "",
                        "año": r.get("year"),
                        "parametro": r.get("parameter"),
                        "valor": r.get("value"),
                        "unidad": r.get("unit") or "",
                    }
                    for r in res.data
                ] if res.data else []
            except Exception as e:
                print(f"[DashboardService] Error fetching air quality: {e}")
                return []

        async def fetch_proyectos_mineros():
            # Intentar desde Supabase
            if hay_region:
                try:
                    res = await asyncio.to_thread(
                        lambda: supabase.table("mining_projects").select("*").ilike("region", region).execute()
                    )
                    if res.data:
                        return [
                            {
                                "id": r.get("id"),
                                "nombre": r.get("name"),
                                "estado": r.get("status"),
                                "ubicacion": r.get("location") or "",
                                "proceso": r.get("process") or "",
                                "tipoMineral": r.get("mineral_type") or "",
                                "mesesRestantesEstimados": r.get("estimated_months_remaining"),
                                "region": r.get("region") or "",
                            }
                            for r in res.data
                        ]
                except Exception as e:
                    print(f"[DashboardService] Supabase mining projects fetch failed, trying fallback: {e}")

            # Fallback a consolidado local
            local_proyectos = get_proyectos_consolidados_local()
            region_norm = normalizar_texto(region)
            return [
                {
                    "id": p.get("id"),
                    "nombre": p.get("nombre"),
                    "estado": p.get("estado"),
                    "ubicacion": p.get("ubicacion") or "",
                    "proceso": p.get("proceso") or "",
                    "tipoMineral": p.get("tipoMineral") or "",
                    "mesesRestantesEstimados": p.get("mesesRestantesEstimados"),
                    "region": p.get("region") or "",
                }
                for p in local_proyectos
                if normalizar_texto(p.get("region", "")) == region_norm
            ]

        async def fetch_mineria_ilegal():
            if not hay_region:
                return []
            try:
                res = await asyncio.to_thread(
                    lambda: supabase.table("illegal_mining").select("*").ilike("region", region).execute()
                )
                return [
                    {
                        "id": r.get("id"),
                        "ubicacion": r.get("location") or "",
                        "motivo": r.get("reason") or "",
                        "estadoRegularizacion": r.get("regularization_status"),
                        "detectadoEn": r.get("detected_at"),
                    }
                    for r in res.data
                ] if res.data else []
            except Exception as e:
                print(f"[DashboardService] Error fetching illegal mining records: {e}")
                return []

        # Ejecutar todas las consultas en paralelo
        seguridad_data, ambiental_data, conflictos_data, proyectos_pub_data, calidad_aire_data, proyectos_min_data, mineria_ilegal_data = await asyncio.gather(
            fetch_safety(),
            fetch_ambiental(),
            fetch_conflictos(),
            fetch_proyectos_publicos(),
            fetch_calidad_aire(),
            fetch_proyectos_mineros(),
            fetch_mineria_ilegal()
        )

        # Enriquecer ambiental con calidad de aire
        if ambiental_data:
            ambiental_data["calidadAire"] = calidad_aire_data

        # 3. Extraer datos legales y deudas de la respuesta de Latinfo
        legal_data = {
            "empresaRuc": ruc,
            "impedidaDeContratar": False,
            "sancionesOsce": [],
            "multasOsce": [],
            "penalidades": [],
            "licitaciones": []
        }
        deudas_data = []

        if kyb:
            sanctions = kyb.get("sanctions") or {}
            contracts_with_state = kyb.get("contracts_with_state") or {}
            debts = kyb.get("debts") or {}

            # OSCE sancionados
            osce_sanc = sanctions.get("osce_sanctioned")
            if osce_sanc:
                legal_data["impedidaDeContratar"] = True
                legal_data["sancionesOsce"].append({
                    "autoridad": "OSCE",
                    "fecha": osce_sanc.get("date_start") or "",
                    "descripcion": osce_sanc.get("detail") or ""
                })

            # OSCE multas
            osce_fines = sanctions.get("osce_fines")
            if osce_fines:
                try:
                    amount = float(osce_fines.get("amount") or "0")
                except ValueError:
                    amount = 0.0
                legal_data["multasOsce"].append({
                    "autoridad": "OSCE",
                    "fecha": osce_fines.get("date_start") or "",
                    "monto": amount,
                    "moneda": "PEN"
                })

            # OSCE penalidades
            for p in sanctions.get("osce_penalidades") or []:
                legal_data["penalidades"].append({
                    "autoridad": p.get("entidad_contratante") or "OSCE",
                    "fecha": p.get("fecha_penalidad") or "",
                    "descripcion": p.get("descripcion") or ""
                })

            # Licitaciones
            for c in contracts_with_state.get("sample") or []:
                tender = c.get("tender") or {}
                value = tender.get("value") or {}
                legal_data["licitaciones"].append({
                    "codigo": tender.get("id") or c.get("id"),
                    "titulo": tender.get("title") or "",
                    "fecha": c.get("date") or "",
                    "monto": value.get("amount"),
                    "moneda": value.get("currency")
                })

            # SUNAT Coactiva
            coactiva = debts.get("sunat_coactiva")
            if coactiva:
                deudas_data.append({
                    "empresaRuc": ruc,
                    "monto": coactiva.get("monto") or 0.0,
                    "estado": coactiva.get("estado") or "PENDIENTE",
                    "dependencia": coactiva.get("dependencia") or "SUNAT",
                    "nroResoluciones": coactiva.get("nro_resoluciones") or 1
                })

        # 4. Calcular Score de Riesgo
        score_riesgo = self.calcular_score_riesgo(
            seguridad_data,
            ambiental_data,
            legal_data,
            deudas_data,
            conflictos_data
        )

        # 5. Mapear al DTO final
        total_presupuesto = sum(p["presupuesto"] for p in proyectos_pub_data)

        return {
            "ruc": empresa_data.get("ruc"),
            "razonSocial": empresa_data.get("razonSocial"),
            "summary": {
                "riskLevel": score_riesgo["nivel"],
                "riskScore": score_riesgo["valor"],
                "lastSyncedAt": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")
            },
            "safety": {
                "fatalAccidents": sum(r["accidentesMortales"] for r in seguridad_data),
                "occupationalDiseases": sum(r["enfermedadesOcupacionales"] for r in seguridad_data),
                "source": "MINEM"
            },
            "environmental": {
                "sanctionsCount": ambiental_data.get("cantidadSanciones") if ambiental_data else 0,
                "sanctions": [
                    {
                        "authority": s["autoridad"],
                        "date": s["fecha"],
                        "description": s["descripcion"],
                        "amount": s["monto"]
                    }
                    for s in (ambiental_data.get("sanciones") or [])
                ] if ambiental_data else [],
                "airQuality": [
                    {
                        "stationName": a["nombreEstacion"],
                        "year": a["año"],
                        "parameter": a["parametro"],
                        "value": a["valor"],
                        "unit": a["unidad"]
                    }
                    for a in (ambiental_data.get("calidadAire") or [])
                ] if ambiental_data else []
            },
            "legal": {
                "osceSanctions": [
                    {
                        "authority": s["autoridad"],
                        "date": s["fecha"],
                        "description": s["descripcion"]
                    }
                    for s in legal_data["sancionesOsce"]
                ],
                "osceFines": [
                    {
                        "authority": f["autoridad"],
                        "date": f["fecha"],
                        "amount": f["monto"],
                        "currency": f["moneda"]
                    }
                    for f in legal_data["multasOsce"]
                ],
                "tenders": [
                    {
                        "code": l["codigo"],
                        "title": l["titulo"],
                        "date": l["fecha"],
                        "amount": l["monto"],
                        "currency": l["moneda"]
                    }
                    for l in legal_data["licitaciones"]
                ],
                "sunatStatus": empresa_data.get("estado", "inactiva").upper(),
                "sunatCondition": empresa_data.get("condicion") or "HABIDO",
                "sunatAddress": empresa_data.get("domicilioFiscal") or "",
                "sunatLocales": empresa_data.get("locales") or [],
                "sunatDebts": [
                    {
                        "amount": d["monto"],
                        "status": d["estado"],
                        "authority": d["dependencia"],
                        "resolutionsCount": d["nroResoluciones"]
                    }
                    for d in deudas_data
                ]
            },
            "social": {
                "activeConflicts": sum(1 for c in conflictos_data if c["estado"] == "activo"),
                "conflicts": [
                    {
                        "region": c["region"],
                        "province": c["provincia"],
                        "district": c["distrito"],
                        "description": c["descripcion"],
                        "status": c["estado"],
                        "reportedAt": c["reportadoEn"]
                    }
                    for c in conflictos_data
                ]
            },
            "investment": {
                "publicProjects": [
                    {
                        "name": p["nombre"],
                        "budget": p["presupuesto"],
                        "physicalProgress": p["avanceFisico"],
                        "executor": p["ejecutor"]
                    }
                    for p in proyectos_pub_data
                ],
                "totalBudget": total_presupuesto
            },
            "miningProjects": [
                {
                    "id": p["id"],
                    "name": p["nombre"],
                    "status": p["estado"],
                    "location": p["ubicacion"],
                    "process": p["proceso"],
                    "mineralType": p["tipoMineral"],
                    "estimatedMonthsRemaining": p["mesesRestantesEstimados"]
                }
                for p in proyectos_min_data
            ],
            "illegalMining": [
                {
                    "id": m["id"],
                    "location": m["ubicacion"],
                    "reason": m["motivo"],
                    "regularizationStatus": m["estadoRegularizacion"],
                    "detectedAt": m["detectadoEn"]
                }
                for m in mineria_ilegal_data
            ]
        }

    def calcular_score_riesgo(
        self,
        seguridad_records: list,
        ambiental_record: Optional[dict],
        legal_record: Optional[dict],
        deudas_records: list,
        conflictos_records: list
    ) -> dict:
        # 1. Seguridad (40%)
        mortales = sum(r["accidentesMortales"] for r in seguridad_records)
        enfermedades = sum(r["enfermedadesOcupacionales"] for r in seguridad_records)
        
        seguridad_puntos = 0
        if mortales >= 3:
            seguridad_puntos += 50
        elif mortales >= 1:
            seguridad_puntos += 30
            
        if enfermedades >= 10:
            seguridad_puntos += 30
        elif enfermedades >= 3:
            seguridad_puntos += 15
            
        seguridad_score = min(100, seguridad_puntos)
        
        # 2. Legalidad (35%)
        legalidad_puntos = 0
        
        # Sanciones OEFA firmes
        firmes = ambiental_record.get("sancionesFirmes", 0) if ambiental_record else 0
        if firmes >= 3:
            legalidad_puntos += 40
        elif firmes >= 1:
            legalidad_puntos += 20
            
        # Multas OSCE
        total_multas = 0
        if legal_record and "multasOsce" in legal_record:
            total_multas = sum(f["monto"] for f in legal_record["multasOsce"])
        if total_multas > 100000:
            legalidad_puntos += 30
        elif total_multas > 0:
            legalidad_puntos += 15
            
        # Penalidades OSCE
        penalidades_count = len(legal_record.get("penalidades", [])) if legal_record else 0
        if penalidades_count > 0:
            legalidad_puntos += 15
            
        # Impedida de contratar
        impedida = legal_record.get("impedidaDeContratar", False) if legal_record else False
        if impedida:
            legalidad_puntos += 30
            
        # Deuda coactiva SUNAT
        if len(deudas_records) > 0:
            legalidad_puntos += 20
            
        legalidad_score = min(100, legalidad_puntos)
        
        # 3. Impacto Social (25%)
        activos = sum(1 for c in conflictos_records if c["estado"] == "activo")
        impacto_score = 0
        if activos >= 2:
            impacto_score = 60
        elif activos >= 1:
            impacto_score = 30
            
        # Calcular promedio ponderado
        valor = round(seguridad_score * 0.40 + legalidad_score * 0.35 + impacto_score * 0.25)
        
        if valor <= 30:
            nivel = "BAJO"
        elif valor <= 60:
            nivel = "MEDIO"
        else:
            nivel = "ALTO"
            
        return {
            "valor": valor,
            "nivel": nivel,
            "desglose": {
                "seguridad": seguridad_score,
                "legalidad": legalidad_score,
                "impactoSocial": impacto_score
            }
        }

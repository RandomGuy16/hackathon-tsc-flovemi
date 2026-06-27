import httpx
from app.config import settings

class LatinfoClient:
    def __init__(self):
        self.api_key = settings.latinfo_api_key
        # Clean up base url in case it has the /pe/kyb/ suffix from the .env
        base = settings.latinfo_base_url
        if "/pe/kyb" in base:
            self.base_url = "https://api.latinfo.dev"
        else:
            self.base_url = base.rstrip("/")

    def _headers(self):
        headers = {}
        if self.api_key:
            headers["Authorization"] = f"Bearer {self.api_key}"
        return headers

    async def obtener_kyb(self, ruc: str) -> dict:
        url = f"{self.base_url}/pe/kyb/{ruc}"
        async with httpx.AsyncClient() as client:
            res = await client.get(url, headers=self._headers(), timeout=15.0)
            if res.status_code == 404:
                raise httpx.HTTPStatusError("Not found", request=res.request, response=res)
            res.raise_for_status()
            json_data = res.json()
            if isinstance(json_data, dict) and "error" in json_data:
                raise ValueError(f"Latinfo API error: {json_data['error']}")
            return json_data

    async def buscar_por_nombre(self, q: str) -> list:
        url = f"{self.base_url}/pe/sunat/padron/search"
        async with httpx.AsyncClient() as client:
            res = await client.get(url, headers=self._headers(), params={"q": q}, timeout=15.0)
            res.raise_for_status()
            json_data = res.json()
            if isinstance(json_data, dict) and "error" in json_data:
                raise ValueError(f"Latinfo API error: {json_data['error']}")
            return json_data if isinstance(json_data, list) else []

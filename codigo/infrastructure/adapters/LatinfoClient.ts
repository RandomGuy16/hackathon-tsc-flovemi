import { LATINFO_CACHE_TTL_MIN } from '../../domain/config/constantes'

// URL base configurable via env — útil para tests o staging
const BASE_URL = process.env.LATINFO_BASE_URL ?? 'https://api.latinfo.dev'
// Next.js ISR: revalidar caché según el mismo TTL que usamos en Supabase
const REVALIDATE_SECONDS = LATINFO_CACHE_TTL_MIN * 60

// ─── Tipos raw de la API (basados en respuesta real verificada) ───────────────

export type LatinfoKybResponse = {
  ruc:    string
  type:   string
  identity: {
    ruc:          string
    razon_social: string
    estado:       string  // 'ACTIVO' | 'BAJA DE OFICIO' | ...
    condicion:    string  // 'HABIDO' | 'NO HABIDO'
    ubigeo:       string
  }
  public_entity: {
    departamento: string  // región en Perú (e.g. 'LA LIBERTAD')
    provincia:    string
    distrito:     string
    estado:       string
  } | null
  sanctions: {
    osce_sanctioned: {
      date_start: string
      date_end:   string
      resolution: string
      detail:     string
    } | null
    osce_fines: {               // objeto único: la multa más reciente
      date_start:      string
      date_end:        string
      resolution:      string
      infraction_code: string
      detail:          string
      amount:          string   // viene como string, parsear a float
    } | null
    osce_penalidades: Array<{
      id_contrato:         string
      tipo_penalidad:      string
      entidad_contratante: string
      fecha_penalidad:     string
      descripcion:         string
      monto:               string  // viene como string
    }>
  }
  debts: {
    sunat_coactiva: { monto: number; estado: string } | null
  }
  contracts_with_state: {
    total:  number
    sample: Array<{
      id:     string
      date:   string
      tender: { id: string; title: string; value?: { amount: number; currency: string } }
      buyer:  { name: string }
    }>
  } | null
  risk_score: number
  risk_flags: string[]
}

// Respuesta real: array directo, cada item tiene id=RUC
export type LatinfoSearchItem = {
  id:           string   // RUC
  razon_social: string
  estado:       string   // 'ACTIVO' | 'BAJA DE OFICIO' | ...
}
export type LatinfoSearchResponse = LatinfoSearchItem[]

// ─── Cliente HTTP ─────────────────────────────────────────────────────────────

export class LatinfoClient {
  private headers() {
    return { Authorization: `Bearer ${process.env.LATINFO_API_KEY}` }
  }

  private async get<T>(path: string): Promise<T> {
    const res = await fetch(`${BASE_URL}${path}`, {
      headers: this.headers(),
      next: { revalidate: REVALIDATE_SECONDS },
    })
    if (!res.ok) throw new Error(`latinfo HTTP ${res.status}: ${path}`)
    const json = await res.json()
    if (json?.error) throw new Error(`latinfo API error: ${JSON.stringify(json.error)}`)
    return json as T
  }

  // Ficha completa — incluye OSCE, SUNAT coactiva y contratos con el Estado
  obtenerKyb(ruc: string) {
    return this.get<LatinfoKybResponse>(`/pe/kyb/${ruc}`)
  }

  // Búsqueda por nombre o RUC — SUNAT padrón
  buscarPorNombre(q: string) {
    return this.get<LatinfoSearchResponse>(
      `/pe/sunat/padron/search?q=${encodeURIComponent(q)}`,
    )
  }
}

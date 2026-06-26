// Cliente HTTP para latinfo.dev — endpoint principal: /pe/kyb/{ruc}
// Tipos basados en la respuesta real verificada contra la API.
const BASE_URL = 'https://api.latinfo.dev'

// Respuesta real de /pe/kyb/{ruc}
export type LatinfoKybResponse = {
  ruc: string
  type: string
  identity: {
    ruc: string
    razon_social: string
    estado: string        // 'ACTIVO' | 'BAJA DE OFICIO' | ...
    condicion: string     // 'HABIDO' | 'NO HABIDO'
    ubigeo: string
  }
  public_entity: {
    departamento: string  // ← región (e.g. 'LIMA', 'LA LIBERTAD')
    provincia: string
    distrito: string
    estado: string
  } | null
  sanctions: {
    osce_sanctioned: {
      date_start: string
      date_end: string
      resolution: string
      detail: string
    } | null
    osce_fines: {          // multa más reciente (objeto único, no array)
      date_start: string
      date_end: string
      resolution: string
      infraction_code: string
      detail: string
      amount: string       // viene como string
    } | null
    osce_penalidades: Array<{
      id_contrato: string
      tipo_penalidad: string
      entidad_contratante: string
      fecha_penalidad: string
      descripcion: string
      monto: string        // viene como string
    }>
  }
  debts: {
    sunat_coactiva: {
      monto: number
      estado: string
    } | null
  }
  contracts_with_state: {
    total: number
    sample: Array<{
      id: string
      date: string
      tender: {
        id: string
        title: string
        value?: { amount: number; currency: string }
      }
      buyer: { name: string }
    }>
  } | null
  risk_score: number      // score calculado por latinfo (0-100)
  risk_flags: string[]
}

export type LatinfoSearchRaw = {
  data: Array<{
    ruc: string
    razon_social: string
    region?: string
    provincia?: string
    distrito?: string
  }>
}

export class LatinfoClient {
  private headers() {
    return { Authorization: `Bearer ${process.env.LATINFO_API_KEY}` }
  }

  private async get<T>(path: string): Promise<T> {
    const res = await fetch(`${BASE_URL}${path}`, {
      headers: this.headers(),
      next: { revalidate: 300 },
    })
    if (!res.ok) throw new Error(`latinfo ${res.status}: ${path}`)
    const json = await res.json()
    if (json?.error) throw new Error(`latinfo error: ${JSON.stringify(json.error)}`)
    return json
  }

  // Endpoint principal — incluye OSCE, SUNAT coactiva, contratos con estado
  obtenerKyb(ruc: string) {
    return this.get<LatinfoKybResponse>(`/pe/kyb/${ruc}`)
  }

  // Búsqueda de empresas por nombre/RUC
  buscarPorNombre(q: string) {
    return this.get<LatinfoSearchRaw>(`/pe/sunat/padron/search?q=${encodeURIComponent(q)}`)
  }

  // Licitaciones recomendadas (OECE) — endpoint verificado
  obtenerLicitaciones(ruc: string) {
    return this.get<{ data: Array<{ id: string; titulo: string; fecha: string; monto?: number; moneda?: string }> }>(
      `/pe/oece/tenders/recomendadas/${ruc}`,
    )
  }
}

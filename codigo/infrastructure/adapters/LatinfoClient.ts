// Cliente HTTP para latinfo.dev (https://api.latinfo.dev)
// Documenta los tipos raw que devuelve la API — ajustar si difieren.
const BASE_URL = 'https://api.latinfo.dev'

export type LatinfoEmpresaRaw = {
  ruc: string
  razon_social: string
  estado?: string
  region?: string
  provincia?: string
  distrito?: string
  lat?: number
  lng?: number
}

export type LatinfoSancionOefaRaw = {
  descripcion: string
  fecha: string
  monto: number | null
  estado: string // 'firme' | 'apelada' | 'impugnada' | ...
  autoridad?: string
}

export type LatinfoMultaOsceRaw = {
  monto: number
  moneda: string
  fecha: string
  autoridad?: string
}

export type LatinfoPenalidadRaw = {
  descripcion: string
  fecha: string
  autoridad?: string
}

export type LatinfoDeudaRaw = {
  monto: number
  estado: string
}

export type LatinfoLicitacionRaw = {
  codigo: string
  titulo: string
  fecha: string
  monto: number | null
  moneda: string | null
}

export class LatinfoClient {
  private baseUrl = BASE_URL

  private headers() {
    return { Authorization: `Bearer ${process.env.LATINFO_API_KEY}` }
  }

  private async get<T>(path: string): Promise<T> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      headers: this.headers(),
      next: { revalidate: 300 }, // cache Next.js 5 min
    })
    if (!res.ok) throw new Error(`latinfo ${res.status}: ${path}`)
    return res.json()
  }

  buscarPorNombre(q: string) {
    return this.get<{ data: LatinfoEmpresaRaw[] }>(
      `/pe/sunat/padron/search?q=${encodeURIComponent(q)}`,
    )
  }

  obtenerPorRuc(ruc: string) {
    return this.get<LatinfoEmpresaRaw>(`/pe/ruc/${ruc}`)
  }

  obtenerDeudaCoactiva(ruc: string) {
    return this.get<{ data: LatinfoDeudaRaw[] }>(`/pe/sunat/coactiva/ruc/${ruc}`)
  }

  obtenerSancionadoOsce(ruc: string) {
    return this.get<{ inhabilitado: boolean }>(`/pe/osce/sanctioned/ruc/${ruc}`)
  }

  obtenerMultasOsce(ruc: string) {
    return this.get<{ data: LatinfoMultaOsceRaw[] }>(`/pe/osce/fines/ruc/${ruc}`)
  }

  obtenerPenalidadesOsce(ruc: string) {
    return this.get<{ data: LatinfoPenalidadRaw[] }>(`/pe/osce/penalidades/ruc/${ruc}`)
  }

  obtenerSancionesOefa(ruc: string) {
    return this.get<{ data: LatinfoSancionOefaRaw[] }>(`/pe/oefa/sanctions/ruc/${ruc}`)
  }

  obtenerLicitaciones(ruc: string) {
    return this.get<{ data: LatinfoLicitacionRaw[] }>(`/pe/licitaciones?ruc=${ruc}`)
  }
}

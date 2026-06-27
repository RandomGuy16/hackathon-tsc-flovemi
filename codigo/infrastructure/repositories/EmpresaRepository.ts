import { createClient } from '../supabase/server'
import { LatinfoClient, type LatinfoKybResponse } from '../adapters/LatinfoClient'
import type { IEmpresaRepository } from '../../domain/repositories/IEmpresaRepository'
import type { Empresa } from '../../domain/entities/empresa'
import { LATINFO_CACHE_TTL_MIN } from '../../domain/config/constantes'

export class EmpresaRepository implements IEmpresaRepository {
  private latinfo = new LatinfoClient()

  async buscar(termino: string): Promise<Empresa[]> {
    try {
      const res = await this.latinfo.buscarPorNombre(termino)
      // Respuesta real: array directo con {id (RUC), razon_social, estado}
      return (Array.isArray(res) ? res : []).map(r => ({
        ruc: r.id,
        razonSocial: r.razon_social,
        estado: r.estado?.toUpperCase() === 'ACTIVO' ? 'activa' : 'inactiva',
        region: '',
        provincia: null,
        distrito: null,
        latitud: null,
        longitud: null,
      }))
    } catch (error) {
      console.warn('[EmpresaRepository] Falló la búsqueda en latinfo.dev, intentando fallback en Supabase:', error)

      // Fallback 1: Buscar en Supabase (companies) si está disponible
      try {
        const supabase = await createClient()
        const { data } = await supabase
          .from('companies')
          .select('*')
          .or(`razon_social.ilike.%${termino}%,ruc.eq.${termino}`)

        if (data && data.length > 0) {
          return data.map(mapRowEmpresa)
        }
      } catch (dbError) {
        console.warn('[EmpresaRepository] Falló el fallback de Supabase:', dbError)
      }

      // Fallback 2: Buscar en dataset semilla local en memoria (evita 500 en Vercel si no hay keys)
      console.log('[EmpresaRepository] Intentando fallback en dataset semilla local...')
      const terminoLimpio = (termino ?? '').toLowerCase().trim()
      return EMPRESAS_SEMILLA_LOCAL.filter(
        e => e.razonSocial.toLowerCase().includes(terminoLimpio) || e.ruc.includes(terminoLimpio)
      )
    }
  }


  async obtenerPorRuc(ruc: string): Promise<Empresa> {
    let supabase = null;
    try {
      supabase = await createClient();
    } catch (e) {
      console.warn('[EmpresaRepository] No se pudo inicializar cliente de Supabase:', e);
    }

    if (supabase) {
      try {
        // 1. Intentar desde la cache completa latinfo_cache
        const kyb = await leerCacheKyb(supabase, ruc)
        if (kyb) return mapKybEmpresa(kyb)

        // 2. Si no hay cache, intentar desde companies
        const { data: cached } = await supabase
          .from('companies')
          .select('*')
          .eq('ruc', ruc)
          .single()

        if (cached) return mapRowEmpresa(cached)
      } catch (e) {
        console.warn('[EmpresaRepository] Error al leer cache/companies en Supabase:', e);
      }
    }


    try {
      // 2. Llamar a latinfo.dev y persistir resultado
      const kyb = await this.latinfo.obtenerKyb(ruc)
      if (supabase) {
        try {
          await persistirKyb(supabase, kyb)
        } catch (e) {
          console.warn('[EmpresaRepository] No se pudo persistir el Kyb en Supabase:', e);
        }
      }
      return mapKybEmpresa(kyb)
    } catch (error) {
      console.warn(`[EmpresaRepository] Falló obtención en latinfo.dev para RUC ${ruc}:`, error)
      
      // Fallback: Buscar en dataset semilla local en memoria
      const local = EMPRESAS_SEMILLA_LOCAL.find(e => e.ruc === ruc)
      if (local) {
        console.log(`[EmpresaRepository] Fallback exitoso a semilla local para RUC ${ruc}`)
        return local
      }
      
      throw error // Lanzar error original si de verdad no hay datos de la empresa en ningún lado
    }
  }

  async buscarPorRegion(region: string): Promise<Empresa[]> {
    const supabase = await createClient()
    const { data } = await supabase
      .from('companies')
      .select('*')
      .ilike('region', region)
    return (data ?? []).map(mapRowEmpresa)
  }
}

// ─── Helpers exportados — reutilizados por otros repositorios ─────────────────

export function mapRowEmpresa(row: Record<string, unknown>): Empresa {
  return {
    ruc: row.ruc as string,
    razonSocial: (row.razon_social as string) ?? '',
    estado: (row.estado as string) ?? 'activa',
    region: (row.region as string) ?? '',
    provincia: (row.province as string) ?? null,
    distrito: (row.district as string) ?? null,
    latitud: (row.latitude as number) ?? null,
    longitud: (row.longitude as number) ?? null,
    condicion: (row.condicion as string) ?? null,
    domicilioFiscal: (row.domicilio_fiscal as string) ?? null,
    locales: (row.locales as Empresa['locales']) ?? null,
  }
}

export function mapKybEmpresa(kyb: LatinfoKybResponse): Empresa {
  return {
    ruc: kyb.ruc,
    razonSocial: kyb.identity.razon_social,
    estado: kyb.identity.estado || 'INACTIVA',
    region: kyb.public_entity?.departamento ?? '',
    provincia: kyb.public_entity?.provincia ?? null,
    distrito: kyb.public_entity?.distrito ?? null,
    latitud: null,
    longitud: null,
    condicion: kyb.identity.condicion || null,
    domicilioFiscal: kyb.identity.domicilio_fiscal || kyb.domicilio_fiscal || null,
    locales: kyb.identity.locales || kyb.locales || null,
  }
}

/** Persiste el KYB en companies y en latinfo_cache (para fallback y TTL) */
export async function persistirKyb(
  supabase: Awaited<ReturnType<typeof createClient>>,
  kyb: LatinfoKybResponse,
) {
  await Promise.all([
    supabase.from('companies').upsert({
      ruc: kyb.ruc,
      razon_social: kyb.identity.razon_social,
      region: kyb.public_entity?.departamento,
      province: kyb.public_entity?.provincia,
      district: kyb.public_entity?.distrito,
    }, { onConflict: 'ruc' }),
    supabase.from('latinfo_cache').upsert({
      ruc: kyb.ruc,
      payload: kyb as unknown as Record<string, unknown>,
      fetched_at: new Date().toISOString(),
      source_status: 'ok',
    }, { onConflict: 'ruc' }),
  ])
}

/** Lee el payload KYB de latinfo_cache respetando el TTL — null si expiró o no existe */
export async function leerCacheKyb(
  supabase: Awaited<ReturnType<typeof createClient>>,
  ruc: string,
): Promise<LatinfoKybResponse | null> {
  const ttlDesde = new Date(Date.now() - LATINFO_CACHE_TTL_MIN * 60 * 1000).toISOString()
  const { data } = await supabase
    .from('latinfo_cache')
    .select('payload')
    .eq('ruc', ruc)
    .gt('fetched_at', ttlDesde)
    .single()
  return (data?.payload as LatinfoKybResponse) ?? null
}

const EMPRESAS_SEMILLA_LOCAL: Empresa[] = [
  {
    ruc: "20100047218",
    razonSocial: "MINERA LOS QUENUALES S.A.",
    estado: "activa",
    region: "La Libertad",
    provincia: "Viru",
    distrito: "Viru",
    latitud: -8.641,
    longitud: -78.748
  },
  {
    ruc: "20340596821",
    razonSocial: "COMPAÑIA MINERA BARRICK MISQUICHILCA S.A.",
    estado: "activa",
    region: "Ancash",
    provincia: "Huaraz",
    distrito: "Janghas",
    latitud: -9.531,
    longitud: -77.528
  },
  {
    ruc: "20100030595",
    razonSocial: "SOUTHERN PERU COPPER CORPORATION",
    estado: "activa",
    region: "Moquegua",
    provincia: "Ilo",
    distrito: "Pacocha",
    latitud: -17.643,
    longitud: -71.341
  },
  {
    ruc: "20552265531",
    razonSocial: "MINERA LAS BAMBAS S.A.",
    estado: "activa",
    region: "Apurimac",
    provincia: "Cotabambas",
    distrito: "Challhuahuacho",
    latitud: -14.043,
    longitud: -72.718
  },
  {
    ruc: "20100079411",
    razonSocial: "COMPAÑIA DE MINAS BUENAVENTURA S.A.A.",
    estado: "activa",
    region: "Huancavelica",
    provincia: "Castrovirreyna",
    distrito: "Castrovirreyna",
    latitud: -13.279,
    longitud: -75.319
  }
]


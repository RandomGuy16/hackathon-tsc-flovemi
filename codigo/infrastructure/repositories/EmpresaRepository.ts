import { createClient } from '../supabase/server'
import { LatinfoClient, type LatinfoKybResponse } from '../adapters/LatinfoClient'
import type { IEmpresaRepository } from '../../domain/repositories/IEmpresaRepository'
import type { Empresa } from '../../domain/entities/empresa'
import { LATINFO_CACHE_TTL_MIN } from '../../domain/config/constantes'

export class EmpresaRepository implements IEmpresaRepository {
  private latinfo = new LatinfoClient()

  async buscar(termino: string): Promise<Empresa[]> {
    const limpio = termino.trim()
    const esRuc = /^\d{11}$/.test(limpio)

    if (esRuc) {
      try {
        const empresa = await this.obtenerPorRuc(limpio)
        if (empresa && empresa.ruc) {
          return [empresa]
        }
      } catch (err) {
        // Ignorar error y proceder con la búsqueda estándar
      }
    }

    const res = await this.latinfo.buscarPorNombre(limpio)
    // Respuesta real: array directo con {id (RUC), razon_social, estado}
    return (Array.isArray(res) ? res : []).map(r => ({
      ruc:        r.id,
      razonSocial: r.razon_social,
      estado:     r.estado?.toUpperCase() === 'ACTIVO' ? 'activa' : 'inactiva',
      region:     '',
      provincia:  null,
      distrito:   null,
      latitud:    null,
      longitud:   null,
    }))
  }

  async obtenerPorRuc(ruc: string): Promise<Empresa> {
    const supabase = await createClient()

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

    // 3. Llamar a latinfo.dev y persistir resultado
    const liveKyb = await this.latinfo.obtenerKyb(ruc)
    await persistirKyb(supabase, liveKyb)
    return mapKybEmpresa(liveKyb)
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
    ruc:        row.ruc       as string,
    razonSocial: (row.razon_social as string) ?? '',
    estado:     (row.estado as string) ?? 'activa',
    region:     (row.region   as string) ?? '',
    provincia:  (row.province as string) ?? null,
    distrito:   (row.district as string) ?? null,
    latitud:    (row.latitude as number) ?? null,
    longitud:   (row.longitude as number) ?? null,
    condicion:  (row.condicion as string) ?? null,
    domicilioFiscal: (row.domicilio_fiscal as string) ?? null,
    locales:    (row.locales as Empresa['locales']) ?? null,
  }
}

export function mapKybEmpresa(kyb: LatinfoKybResponse): Empresa {
  return {
    ruc:        kyb.ruc,
    razonSocial: kyb.identity.razon_social,
    estado:     kyb.identity.estado || 'INACTIVA',
    region:     kyb.public_entity?.departamento ?? '',
    provincia:  kyb.public_entity?.provincia    ?? null,
    distrito:   kyb.public_entity?.distrito     ?? null,
    latitud:    null,
    longitud:   null,
    condicion:  kyb.identity.condicion || null,
    domicilioFiscal: kyb.identity.domicilio_fiscal || kyb.domicilio_fiscal || null,
    locales:    kyb.identity.locales || kyb.locales || null,
  }
}

/** Persiste el KYB en companies y en latinfo_cache (para fallback y TTL) */
export async function persistirKyb(
  supabase: Awaited<ReturnType<typeof createClient>>,
  kyb: LatinfoKybResponse,
) {
  await Promise.all([
    supabase.from('companies').upsert({
      ruc:          kyb.ruc,
      razon_social: kyb.identity.razon_social,
      region:       kyb.public_entity?.departamento,
      province:     kyb.public_entity?.provincia,
      district:     kyb.public_entity?.distrito,
    }, { onConflict: 'ruc' }),
    supabase.from('latinfo_cache').upsert({
      ruc:          kyb.ruc,
      payload:      kyb as unknown as Record<string, unknown>,
      fetched_at:   new Date().toISOString(),
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

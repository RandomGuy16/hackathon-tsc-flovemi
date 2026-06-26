import { createClient } from '../supabase/server'
import { LatinfoClient } from '../adapters/LatinfoClient'
import type { IEmpresaRepository } from '../../domain/repositories/IEmpresaRepository'
import type { Empresa } from '../../domain/entities/empresa'

export class EmpresaRepository implements IEmpresaRepository {
  private latinfo = new LatinfoClient()

  async buscar(termino: string): Promise<Empresa[]> {
    const res = await this.latinfo.buscarPorNombre(termino)
    return (res.data ?? []).map(r => ({
      ruc: r.ruc,
      razonSocial: r.razon_social,
      estado: 'activa',
      region: r.region ?? '',
      provincia: r.provincia ?? null,
      distrito: r.distrito ?? null,
      latitud: null,
      longitud: null,
    }))
  }

  async obtenerPorRuc(ruc: string): Promise<Empresa> {
    const supabase = await createClient()

    // Primero buscar en cache local (companies table)
    const { data: cached } = await supabase
      .from('companies')
      .select('*')
      .eq('ruc', ruc)
      .single()

    if (cached) return this.mapRow(cached)

    // Llamar a latinfo.dev /pe/kyb/{ruc}
    const kyb = await this.latinfo.obtenerKyb(ruc)

    const region = kyb.public_entity?.departamento ?? ''
    const provincia = kyb.public_entity?.provincia ?? null
    const distrito = kyb.public_entity?.distrito ?? null
    const estadoActiva = kyb.identity.estado?.toUpperCase() === 'ACTIVO'

    // Persistir en Supabase y en latinfo_cache
    await Promise.all([
      supabase.from('companies').upsert({
        ruc: kyb.ruc,
        razon_social: kyb.identity.razon_social,
        region,
        province: provincia,
        district: distrito,
      }),
      supabase.from('latinfo_cache').upsert({
        ruc: kyb.ruc,
        payload: kyb as unknown as Record<string, unknown>,
        fetched_at: new Date().toISOString(),
        source_status: 'ok',
      }),
    ])

    return {
      ruc: kyb.ruc,
      razonSocial: kyb.identity.razon_social,
      estado: estadoActiva ? 'activa' : 'inactiva',
      region,
      provincia,
      distrito,
      latitud: null,
      longitud: null,
    }
  }

  async buscarPorRegion(region: string): Promise<Empresa[]> {
    const supabase = await createClient()
    const { data } = await supabase
      .from('companies')
      .select('*')
      .ilike('region', region)
    return (data ?? []).map(r => this.mapRow(r))
  }

  private mapRow(row: Record<string, unknown>): Empresa {
    return {
      ruc: row.ruc as string,
      razonSocial: (row.razon_social as string) ?? '',
      estado: 'activa',
      region: (row.region as string) ?? '',
      provincia: (row.province as string) ?? null,
      distrito: (row.district as string) ?? null,
      latitud: (row.latitude as number) ?? null,
      longitud: (row.longitude as number) ?? null,
    }
  }
}

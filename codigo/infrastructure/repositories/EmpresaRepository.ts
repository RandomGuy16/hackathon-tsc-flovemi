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
      latitud: r.lat ?? null,
      longitud: r.lng ?? null,
    }))
  }

  async obtenerPorRuc(ruc: string): Promise<Empresa> {
    const supabase = await createClient()

    // Primero intentar cache local en Supabase
    const { data: cached } = await supabase
      .from('companies')
      .select('*')
      .eq('ruc', ruc)
      .single()

    if (cached) return this.mapRow(cached)

    // Si no existe en cache, consultar latinfo.dev
    const raw = await this.latinfo.obtenerPorRuc(ruc)

    // Persistir en companies para consultas futuras
    await supabase.from('companies').upsert({
      ruc: raw.ruc,
      razon_social: raw.razon_social,
      region: raw.region,
      province: raw.provincia,
      district: raw.distrito,
      latitude: raw.lat,
      longitude: raw.lng,
    })

    return {
      ruc: raw.ruc,
      razonSocial: raw.razon_social,
      estado: raw.estado?.toLowerCase().includes('activo') ? 'activa' : 'inactiva',
      region: raw.region ?? '',
      provincia: raw.provincia ?? null,
      distrito: raw.distrito ?? null,
      latitud: raw.lat ?? null,
      longitud: raw.lng ?? null,
    }
  }

  async buscarPorRegion(region: string): Promise<Empresa[]> {
    const supabase = await createClient()
    const { data } = await supabase
      .from('companies')
      .select('*')
      .eq('region', region)
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

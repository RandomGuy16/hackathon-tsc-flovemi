import { createClient } from '../supabase/server'
import type { IProyectoMineroRepository } from '../../domain/repositories/IProyectoMineroRepository'
import type { ProyectoMinero } from '../../domain/entities/proyecto-minero'

// Fuente: tabla mining_projects en Supabase (seed desde datos MINEM / INGEMMET)
export class ProyectoMineroRepository implements IProyectoMineroRepository {
  async obtenerPorRuc(ruc: string): Promise<ProyectoMinero[]> {
    const supabase = await createClient()
    const { data } = await supabase
      .from('mining_projects')
      .select('*')
      .eq('company_ruc', ruc)
    return (data ?? []).map(mapRow)
  }

  async obtenerPorRegion(region: string): Promise<ProyectoMinero[]> {
    const supabase = await createClient()
    const { data } = await supabase
      .from('mining_projects')
      .select('*')
      .ilike('region', region)
    return (data ?? []).map(mapRow)
  }
}

function mapRow(r: Record<string, unknown>): ProyectoMinero {
  return {
    id:                        r.id as string,
    empresaRuc:                (r.company_ruc as string) ?? null,
    nombre:                    r.name as string,
    estado:                    r.status as ProyectoMinero['estado'],
    ubicacion:                 (r.location as string) ?? '',
    proceso:                   (r.process as string) ?? '',
    tipoMineral:               (r.mineral_type as string) ?? '',
    mesesRestantesEstimados:   (r.estimated_months_remaining as number) ?? null,
    region:                    (r.region as string) ?? '',
    provincia:                 (r.province as string) ?? null,
    distrito:                  (r.district as string) ?? null,
    latitud:                   (r.latitude as number) ?? null,
    longitud:                  (r.longitude as number) ?? null,
  }
}

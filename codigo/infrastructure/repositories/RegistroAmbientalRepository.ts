import { createClient } from '../supabase/server'
import type { IRegistroAmbientalRepository } from '../../domain/repositories/IRegistroAmbientalRepository'
import type { RegistroAmbiental, RegistroCalidadAire } from '../../domain/entities/registro-ambiental'
import { AIR_QUALITY_LIMIT } from '../../domain/config/constantes'

// OEFA sanciones: endpoint de latinfo.dev no disponible aún.
// Calidad de aire: tabla air_quality en Supabase (seed desde OEFA CSV).
export class RegistroAmbientalRepository implements IRegistroAmbientalRepository {
  async obtenerPorRuc(_ruc: string): Promise<RegistroAmbiental | null> {
    // Retorna null hasta que se siembre oefa_sanctions en Supabase (RF-04 lo tolera)
    return null
  }

  async obtenerCalidadAirePorRegion(region: string): Promise<RegistroCalidadAire[]> {
    if (!region) return []
    const supabase = await createClient()
    const { data } = await supabase
      .from('air_quality')
      .select('*')
      .ilike('region', region)
      .order('year', { ascending: false })
      .limit(AIR_QUALITY_LIMIT)

    return (data ?? []).map(r => ({
      id: r.id as string,
      region: r.region as string,
      nombreEstacion: (r.station_name as string) ?? '',
      año: r.year as number,
      parametro: r.parameter as string,
      valor: r.value as number,
      unidad: (r.unit as string) ?? '',
    }))
  }
}

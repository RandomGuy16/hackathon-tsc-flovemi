import { createClient } from '../supabase/server'
import type { IRegistroAmbientalRepository } from '../../domain/repositories/IRegistroAmbientalRepository'
import type { RegistroAmbiental, RegistroCalidadAire } from '../../domain/entities/registro-ambiental'
import { AIR_QUALITY_LIMIT } from '../../domain/config/constantes'

// OEFA sanciones: tabla oefa_sanctions en Supabase (seed desde resoluciones OEFA).
// Calidad de aire: tabla air_quality en Supabase (seed desde OEFA CSV).
export class RegistroAmbientalRepository implements IRegistroAmbientalRepository {
  async obtenerPorRuc(ruc: string): Promise<RegistroAmbiental | null> {
    if (!ruc) return null

    const supabase = await createClient()
    const { data } = await supabase
      .from('oefa_sanctions')
      .select('*')
      .eq('company_ruc', ruc)
      .order('sanction_date', { ascending: false })

    const sanciones = (data ?? []).map(r => ({
      autoridad:   (r.authority as string) ?? 'OEFA',
      fecha:       (r.sanction_date as string) ?? '',
      descripcion: (r.description as string) ?? '',
      monto:       (r.amount as number) ?? null,
      estado:      (r.status as string) ?? 'firme',
    }))

    return {
      empresaRuc:        ruc,
      cantidadSanciones: sanciones.length,
      sancionesFirmes:   sanciones.filter(s => s.estado === 'firme').length,
      sanciones:         sanciones,
      calidadAire:       [],
    }
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

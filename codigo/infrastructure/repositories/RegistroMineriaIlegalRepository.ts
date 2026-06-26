import { createClient } from '../supabase/server'
import type { IRegistroMineriaIlegalRepository } from '../../domain/repositories/IRegistroMineriaIlegalRepository'
import type { RegistroMineriaIlegal } from '../../domain/entities/registro-mineria-ilegal'

// Fuente: tabla illegal_mining en Supabase (seed desde datos OSINFOR / ANA)
export class RegistroMineriaIlegalRepository implements IRegistroMineriaIlegalRepository {
  async obtenerPorRegion(region: string): Promise<RegistroMineriaIlegal[]> {
    const supabase = await createClient()
    const { data } = await supabase
      .from('illegal_mining')
      .select('*')
      .ilike('region', region)
    return (data ?? []).map(mapRow)
  }
}

function mapRow(r: Record<string, unknown>): RegistroMineriaIlegal {
  return {
    id:                      r.id as string,
    empresaRuc:              (r.company_ruc as string) ?? null,
    ubicacion:               (r.location as string) ?? '',
    region:                  (r.region as string) ?? '',
    provincia:               (r.province as string) ?? null,
    distrito:                (r.district as string) ?? null,
    motivo:                  (r.reason as string) ?? '',
    estadoRegularizacion:    r.regularization_status as RegistroMineriaIlegal['estadoRegularizacion'],
    detectadoEn:             (r.detected_at as string) ?? null,
    latitud:                 (r.latitude as number) ?? null,
    longitud:                (r.longitude as number) ?? null,
  }
}

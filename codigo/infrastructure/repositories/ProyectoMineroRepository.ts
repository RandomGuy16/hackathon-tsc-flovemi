import type { IProyectoMineroRepository } from '../../domain/repositories/IProyectoMineroRepository'
import type { ProyectoMinero } from '../../domain/entities/proyecto-minero'
import { createClient } from '../supabase/server'
import proyectosRaw from '../../public/proyectos_consolidados.json'

const proyectosLocales = proyectosRaw as ProyectoMinero[]

function normalizarTexto(str: string): string {
  return (str ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
}

export class ProyectoMineroRepository implements IProyectoMineroRepository {
  async obtenerPorRuc(ruc: string): Promise<ProyectoMinero[]> {
    if (!ruc) return []
    
    // 1. Intentar desde Supabase
    try {
      const supabase = await createClient()
      const { data } = await supabase
        .from('mining_projects')
        .select('*')
        .eq('company_ruc', ruc)
      
      if (data && data.length > 0) {
        return data.map(mapRow)
      }
    } catch (e) {
      console.warn('[ProyectoMineroRepository] Falló consulta a Supabase, usando fallback local:', e)
    }

    // 2. Fallback a proyectos consolidados locales
    return proyectosLocales.filter(p => p.empresaRuc === ruc)
  }

  async obtenerPorRegion(region: string): Promise<ProyectoMinero[]> {
    if (!region) return []
    const regionNormalizada = normalizarTexto(region)

    // 1. Intentar desde Supabase
    try {
      const supabase = await createClient()
      const { data } = await supabase
        .from('mining_projects')
        .select('*')
        .ilike('region', region)
      
      if (data && data.length > 0) {
        return data.map(mapRow)
      }
    } catch (e) {
      console.warn('[ProyectoMineroRepository] Falló consulta por región a Supabase, usando fallback local:', e)
    }

    // 2. Fallback a proyectos consolidados locales
    return proyectosLocales.filter(
      p => normalizarTexto(p.region) === regionNormalizada
    )
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

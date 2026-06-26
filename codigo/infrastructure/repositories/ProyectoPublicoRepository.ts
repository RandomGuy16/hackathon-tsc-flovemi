import { createClient } from '../supabase/server'
import type { IProyectoPublicoRepository } from '../../domain/repositories/IProyectoPublicoRepository'
import type { ProyectoPublico } from '../../domain/entities/proyecto-publico'

// Datos INFOBRAS/MEF sembrados en public_projects de Supabase
export class ProyectoPublicoRepository implements IProyectoPublicoRepository {
  async obtenerPorRegion(region: string): Promise<ProyectoPublico[]> {
    const supabase = await createClient()
    const { data } = await supabase
      .from('public_projects')
      .select('*')
      .eq('region', region)

    return (data ?? []).map(r => ({
      id: r.id as string,
      region: r.region as string,
      nombre: r.name as string,
      presupuesto: (r.budget as number) ?? 0,
      avanceFisico: (r.physical_progress as number) ?? 0,
      ejecutor: (r.executor as string) ?? '',
      latitud: (r.latitude as number) ?? null,
      longitud: (r.longitude as number) ?? null,
    }))
  }
}

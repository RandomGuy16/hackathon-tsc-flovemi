import { createClient } from '../supabase/server'
import type { IRegistroSeguridadRepository } from '../../domain/repositories/IRegistroSeguridadRepository'
import type { RegistroSeguridad } from '../../domain/entities/registro-seguridad'

// Datos MINEM cargados vía CSV a safety_records en Supabase
export class RegistroSeguridadRepository implements IRegistroSeguridadRepository {
  async obtenerPorRuc(ruc: string): Promise<RegistroSeguridad[]> {
    const supabase = await createClient()
    const { data } = await supabase
      .from('safety_records')
      .select('*')
      .eq('company_ruc', ruc)
      .order('year', { ascending: false })

    return (data ?? []).map(r => ({
      id: r.id as string,
      empresaRuc: r.company_ruc as string,
      año: r.year as number,
      accidentesMortales: (r.fatal_accidents as number) ?? 0,
      enfermedadesOcupacionales: (r.occupational_diseases as number) ?? 0,
      urlFuente: (r.source_url as string) ?? null,
    }))
  }
}

import { createClient } from '../supabase/server'
import { LatinfoClient } from '../adapters/LatinfoClient'
import type { IRegistroAmbientalRepository } from '../../domain/repositories/IRegistroAmbientalRepository'
import type { RegistroAmbiental, RegistroCalidadAire } from '../../domain/entities/registro-ambiental'

export class RegistroAmbientalRepository implements IRegistroAmbientalRepository {
  private latinfo = new LatinfoClient()

  async obtenerPorRuc(ruc: string): Promise<RegistroAmbiental | null> {
    let sancionesRaw: Awaited<ReturnType<LatinfoClient['obtenerSancionesOefa']>>['data'] = []

    try {
      const res = await this.latinfo.obtenerSancionesOefa(ruc)
      sancionesRaw = res.data ?? []

      // Guardar en cache para fallback
      const supabase = await createClient()
      await supabase.from('latinfo_cache').upsert({
        ruc,
        payload: { oefa_sanctions: sancionesRaw },
        fetched_at: new Date().toISOString(),
        source_status: 'ok',
      })
    } catch {
      // Fallback: leer cache
      const supabase = await createClient()
      const { data: cache } = await supabase
        .from('latinfo_cache')
        .select('payload')
        .eq('ruc', ruc)
        .single()
      sancionesRaw = (cache?.payload as any)?.oefa_sanctions ?? []
    }

    const sanciones = sancionesRaw.map(s => ({
      autoridad: s.autoridad ?? 'OEFA',
      fecha: s.fecha,
      descripcion: s.descripcion,
      monto: s.monto,
      estado: s.estado,
    }))

    const firmes = sanciones.filter(s => s.estado === 'firme').length

    // Calidad del aire también va en el registro ambiental
    const calidadAire = await this.obtenerCalidadAirePorRegion('')

    return {
      empresaRuc: ruc,
      cantidadSanciones: sanciones.length,
      sancionesFirmes: firmes,
      sanciones,
      calidadAire: [], // se completa en el route con la región de la empresa
    }
  }

  async obtenerCalidadAirePorRegion(region: string): Promise<RegistroCalidadAire[]> {
    if (!region) return []
    const supabase = await createClient()
    const { data } = await supabase
      .from('air_quality')
      .select('*')
      .eq('region', region)
      .order('year', { ascending: false })
      .limit(20)

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

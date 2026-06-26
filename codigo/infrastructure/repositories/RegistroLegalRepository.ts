import { createClient } from '../supabase/server'
import { LatinfoClient } from '../adapters/LatinfoClient'
import type { IRegistroLegalRepository } from '../../domain/repositories/IRegistroLegalRepository'
import type { RegistroLegal } from '../../domain/entities/registro-legal'

export class RegistroLegalRepository implements IRegistroLegalRepository {
  private latinfo = new LatinfoClient()

  async obtenerPorRuc(ruc: string): Promise<RegistroLegal | null> {
    // Todas las llamadas OSCE en paralelo — si alguna falla, las demás siguen
    const [sanctioned, fines, penalidades, licitaciones] = await Promise.allSettled([
      this.latinfo.obtenerSancionadoOsce(ruc),
      this.latinfo.obtenerMultasOsce(ruc),
      this.latinfo.obtenerPenalidadesOsce(ruc),
      this.latinfo.obtenerLicitaciones(ruc),
    ])

    // Cachear resultado agregado
    try {
      const supabase = await createClient()
      await supabase.from('latinfo_cache').upsert({
        ruc,
        payload: {
          osce_sanctioned: sanctioned.status === 'fulfilled' ? sanctioned.value : null,
          osce_fines: fines.status === 'fulfilled' ? fines.value : null,
          osce_penalidades: penalidades.status === 'fulfilled' ? penalidades.value : null,
          licitaciones: licitaciones.status === 'fulfilled' ? licitaciones.value : null,
        },
        fetched_at: new Date().toISOString(),
        source_status: 'ok',
      })
    } catch { /* cache no crítico */ }

    return {
      empresaRuc: ruc,
      impedidaDeContratar:
        sanctioned.status === 'fulfilled' ? (sanctioned.value.inhabilitado ?? false) : false,
      sancionesOsce: [], // OSCE no tiene endpoint de sanciones independiente en latinfo.dev
      multasOsce:
        fines.status === 'fulfilled'
          ? (fines.value.data ?? []).map(f => ({
              autoridad: f.autoridad ?? 'OSCE',
              fecha: f.fecha,
              monto: f.monto,
              moneda: f.moneda,
            }))
          : [],
      penalidades:
        penalidades.status === 'fulfilled'
          ? (penalidades.value.data ?? []).map(p => ({
              autoridad: p.autoridad ?? 'OSCE',
              fecha: p.fecha,
              descripcion: p.descripcion,
            }))
          : [],
      licitaciones:
        licitaciones.status === 'fulfilled'
          ? (licitaciones.value.data ?? []).map(l => ({
              codigo: l.codigo,
              titulo: l.titulo,
              fecha: l.fecha,
              monto: l.monto,
              moneda: l.moneda,
            }))
          : [],
    }
  }
}

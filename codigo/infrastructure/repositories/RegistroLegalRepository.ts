import { createClient } from '../supabase/server'
import { LatinfoClient } from '../adapters/LatinfoClient'
import type { IRegistroLegalRepository } from '../../domain/repositories/IRegistroLegalRepository'
import type { RegistroLegal } from '../../domain/entities/registro-legal'

export class RegistroLegalRepository implements IRegistroLegalRepository {
  private latinfo = new LatinfoClient()

  async obtenerPorRuc(ruc: string): Promise<RegistroLegal | null> {
    // Intentar leer de latinfo_cache (guardado por EmpresaRepository.obtenerPorRuc)
    const supabase = await createClient()
    const { data: cache } = await supabase
      .from('latinfo_cache')
      .select('payload, fetched_at')
      .eq('ruc', ruc)
      .single()

    let kyb: Awaited<ReturnType<LatinfoClient['obtenerKyb']>> | null = null

    if (cache?.payload) {
      kyb = cache.payload as typeof kyb
    } else {
      // Cache miss — llamar a la API directamente
      try {
        kyb = await this.latinfo.obtenerKyb(ruc)
      } catch {
        return null
      }
    }

    if (!kyb) return null

    const sanctions = kyb.sanctions
    const contracts = kyb.contracts_with_state

    // osce_fines viene como objeto único (multa más reciente), no array
    const multasOsce = sanctions.osce_fines
      ? [{
          autoridad: 'OSCE',
          fecha: sanctions.osce_fines.date_start ?? '',
          monto: parseFloat(sanctions.osce_fines.amount ?? '0'),
          moneda: 'PEN',
        }]
      : []

    const penalidades = (sanctions.osce_penalidades ?? []).map(p => ({
      autoridad: p.entidad_contratante ?? 'OSCE',
      fecha: p.fecha_penalidad ?? '',
      descripcion: p.descripcion ?? '',
    }))

    const licitaciones = (contracts?.sample ?? []).map(c => ({
      codigo: c.tender?.id ?? c.id,
      titulo: c.tender?.title ?? '',
      fecha: c.date ?? '',
      monto: c.tender?.value?.amount ?? null,
      moneda: c.tender?.value?.currency ?? null,
    }))

    return {
      empresaRuc: ruc,
      impedidaDeContratar: sanctions.osce_sanctioned !== null,
      sancionesOsce: sanctions.osce_sanctioned
        ? [{
            autoridad: 'OSCE',
            fecha: sanctions.osce_sanctioned.date_start ?? '',
            descripcion: sanctions.osce_sanctioned.detail ?? '',
          }]
        : [],
      multasOsce,
      penalidades,
      licitaciones,
    }
  }
}

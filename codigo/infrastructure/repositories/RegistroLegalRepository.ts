import { createClient } from '../supabase/server'
import { LatinfoClient } from '../adapters/LatinfoClient'
import { leerCacheKyb, persistirKyb } from './EmpresaRepository'
import type { IRegistroLegalRepository } from '../../domain/repositories/IRegistroLegalRepository'
import type { RegistroLegal } from '../../domain/entities/registro-legal'

export class RegistroLegalRepository implements IRegistroLegalRepository {
  private latinfo = new LatinfoClient()

  async obtenerPorRuc(ruc: string): Promise<RegistroLegal | null> {
    const supabase = await createClient()

    // Leer caché antes de consumir créditos de la API
    let kyb = await leerCacheKyb(supabase, ruc)
    if (!kyb) {
      try {
        kyb = await this.latinfo.obtenerKyb(ruc)
        await persistirKyb(supabase, kyb)
      } catch {
        return null
      }
    }

    const { sanctions, contracts_with_state } = kyb

    return {
      empresaRuc: ruc,
      impedidaDeContratar: sanctions.osce_sanctioned !== null,
      sancionesOsce: sanctions.osce_sanctioned
        ? [{ autoridad: 'OSCE', fecha: sanctions.osce_sanctioned.date_start ?? '', descripcion: sanctions.osce_sanctioned.detail ?? '' }]
        : [],
      multasOsce: sanctions.osce_fines
        ? [{ autoridad: 'OSCE', fecha: sanctions.osce_fines.date_start ?? '', monto: parseFloat(sanctions.osce_fines.amount ?? '0'), moneda: 'PEN' }]
        : [],
      penalidades: (sanctions.osce_penalidades ?? []).map(p => ({
        autoridad:   p.entidad_contratante ?? 'OSCE',
        fecha:       p.fecha_penalidad     ?? '',
        descripcion: p.descripcion         ?? '',
      })),
      licitaciones: (contracts_with_state?.sample ?? []).map(c => ({
        codigo: c.tender?.id              ?? c.id,
        titulo: c.tender?.title           ?? '',
        fecha:  c.date                    ?? '',
        monto:  c.tender?.value?.amount   ?? null,
        moneda: c.tender?.value?.currency ?? null,
      })),
    }
  }
}

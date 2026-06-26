import { createClient } from '../supabase/server'
import { LatinfoClient } from '../adapters/LatinfoClient'
import { leerCacheKyb, persistirKyb } from './EmpresaRepository'
import type { IDeudaRepository } from '../../domain/repositories/IDeudaRepository'
import type { DeudaFiscal } from '../../domain/entities/deuda-fiscal'

export class DeudaRepository implements IDeudaRepository {
  private latinfo = new LatinfoClient()

  async obtenerPorRuc(ruc: string): Promise<DeudaFiscal[]> {
    const supabase = await createClient()

    // Leer caché antes de consumir créditos de la API
    let kyb = await leerCacheKyb(supabase, ruc)
    if (!kyb) {
      try {
        kyb = await this.latinfo.obtenerKyb(ruc)
        await persistirKyb(supabase, kyb)
      } catch {
        return []
      }
    }

    const coactiva = kyb.debts?.sunat_coactiva
    if (!coactiva) return []

    return [{
      empresaRuc: ruc,
      monto:      coactiva.monto,
      estado:     coactiva.estado ?? 'PENDIENTE',
    }]
  }
}

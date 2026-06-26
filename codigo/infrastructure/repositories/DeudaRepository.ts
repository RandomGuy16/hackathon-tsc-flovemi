import { createClient } from '../supabase/server'
import { LatinfoClient } from '../adapters/LatinfoClient'
import type { IDeudaRepository } from '../../domain/repositories/IDeudaRepository'
import type { DeudaFiscal } from '../../domain/entities/deuda-fiscal'

// Deuda coactiva SUNAT — viene en debts.sunat_coactiva del endpoint /pe/kyb/{ruc}
export class DeudaRepository implements IDeudaRepository {
  private latinfo = new LatinfoClient()

  async obtenerPorRuc(ruc: string): Promise<DeudaFiscal[]> {
    // Leer de latinfo_cache si ya fue guardado por EmpresaRepository
    const supabase = await createClient()
    const { data: cache } = await supabase
      .from('latinfo_cache')
      .select('payload')
      .eq('ruc', ruc)
      .single()

    let kyb: Awaited<ReturnType<LatinfoClient['obtenerKyb']>> | null = null

    if (cache?.payload) {
      kyb = cache.payload as typeof kyb
    } else {
      try {
        kyb = await this.latinfo.obtenerKyb(ruc)
      } catch {
        return []
      }
    }

    const coactiva = kyb?.debts?.sunat_coactiva
    if (!coactiva) return []

    return [{
      empresaRuc: ruc,
      monto: coactiva.monto,
      estado: coactiva.estado,
    }]
  }
}

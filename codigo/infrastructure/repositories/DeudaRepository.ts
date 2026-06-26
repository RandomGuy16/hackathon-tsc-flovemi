import { LatinfoClient } from '../adapters/LatinfoClient'
import type { IDeudaRepository } from '../../domain/repositories/IDeudaRepository'
import type { DeudaFiscal } from '../../domain/entities/deuda-fiscal'

// Deudas coactivas SUNAT via latinfo.dev /pe/sunat/coactiva/ruc/{ruc}
export class DeudaRepository implements IDeudaRepository {
  private latinfo = new LatinfoClient()

  async obtenerPorRuc(ruc: string): Promise<DeudaFiscal[]> {
    const res = await this.latinfo.obtenerDeudaCoactiva(ruc)
    return (res.data ?? []).map(d => ({
      empresaRuc: ruc,
      monto: d.monto,
      estado: d.estado,
    }))
  }
}

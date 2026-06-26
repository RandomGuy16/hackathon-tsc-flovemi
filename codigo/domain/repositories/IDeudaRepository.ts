import type { DeudaFiscal } from '../entities/deuda-fiscal'

export interface IDeudaRepository {
  obtenerPorRuc(ruc: string): Promise<DeudaFiscal[]>
}

import type { Contrato } from '../entities/contrato'

export interface IContratoRepository {
  obtenerPorRuc(ruc: string): Promise<Contrato[]>
}

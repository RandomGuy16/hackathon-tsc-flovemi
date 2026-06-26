import type { RegistroSeguridad } from '../entities/registro-seguridad'

export interface IRegistroSeguridadRepository {
  obtenerPorRuc(ruc: string): Promise<RegistroSeguridad[]>
}

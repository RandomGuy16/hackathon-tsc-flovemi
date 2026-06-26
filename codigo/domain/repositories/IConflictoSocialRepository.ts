import type { ConflictoSocial } from '../entities/conflicto-social'

export interface IConflictoSocialRepository {
  obtenerPorRuc(ruc: string): Promise<ConflictoSocial[]>
  obtenerPorRegion(region: string): Promise<ConflictoSocial[]>
}

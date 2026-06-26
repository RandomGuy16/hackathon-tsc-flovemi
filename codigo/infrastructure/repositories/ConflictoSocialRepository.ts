import { createClient } from '../supabase/server'
import type { IConflictoSocialRepository } from '../../domain/repositories/IConflictoSocialRepository'
import type { ConflictoSocial } from '../../domain/entities/conflicto-social'

// Datos PNDA sembrados en social_conflicts de Supabase
export class ConflictoSocialRepository implements IConflictoSocialRepository {
  async obtenerPorRuc(ruc: string): Promise<ConflictoSocial[]> {
    const supabase = await createClient()
    const { data } = await supabase
      .from('social_conflicts')
      .select('*')
      .eq('related_company_ruc', ruc)
    return (data ?? []).map(r => this.mapRow(r))
  }

  async obtenerPorRegion(region: string): Promise<ConflictoSocial[]> {
    const supabase = await createClient()
    const { data } = await supabase
      .from('social_conflicts')
      .select('*')
      .eq('region', region)
    return (data ?? []).map(r => this.mapRow(r))
  }

  private mapRow(row: Record<string, unknown>): ConflictoSocial {
    return {
      id: row.id as string,
      region: (row.region as string) ?? '',
      provincia: (row.province as string) ?? '',
      distrito: (row.district as string) ?? '',
      descripcion: (row.description as string) ?? '',
      estado: (row.status as ConflictoSocial['estado']) ?? 'inactivo',
      empresaRucRelacionado: (row.related_company_ruc as string) ?? null,
      reportadoEn: (row.reported_at as string) ?? '',
    }
  }
}

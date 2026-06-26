import { NextRequest, NextResponse } from 'next/server'
import { ObtenerResumenRegion } from '../../../../domain/use-cases/ObtenerResumenRegion'
import { EmpresaRepository } from '../../../../infrastructure/repositories/EmpresaRepository'
import { ConflictoSocialRepository } from '../../../../infrastructure/repositories/ConflictoSocialRepository'
import { ProyectoPublicoRepository } from '../../../../infrastructure/repositories/ProyectoPublicoRepository'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ region: string }> },
) {
  const { region } = await params

  try {
    const uc = new ObtenerResumenRegion(
      new EmpresaRepository(),
      new ConflictoSocialRepository(),
      new ProyectoPublicoRepository(),
    )

    const resumen = await uc.ejecutar(decodeURIComponent(region))

    return NextResponse.json({
      region: resumen.region,
      companies: resumen.empresas.map(e => ({
        ruc: e.ruc,
        razonSocial: e.razonSocial,
        latitude: e.latitud,
        longitude: e.longitud,
        riskLevel: null, // score se calcula por empresa individual en /dashboard
      })),
      conflicts: resumen.conflictos.map(c => ({
        description: c.descripcion,
        latitude: null,
        longitude: null,
        status: c.estado,
      })),
      projects: resumen.proyectos.map(p => ({
        name: p.nombre,
        budget: p.presupuesto,
        latitude: p.latitud,
        longitude: p.longitud,
      })),
      miningProjects: [],   // TODO: implementar IProyectoMineroRepository
      illegalMining: [],    // TODO: implementar IRegistroMineriaIlegalRepository
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error interno'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

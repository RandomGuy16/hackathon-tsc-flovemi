import { NextRequest, NextResponse } from 'next/server'
import { ObtenerResumenRegion } from '../../../../domain/use-cases/ObtenerResumenRegion'
import { EmpresaRepository } from '../../../../infrastructure/repositories/EmpresaRepository'
import { ConflictoSocialRepository } from '../../../../infrastructure/repositories/ConflictoSocialRepository'
import { ProyectoPublicoRepository } from '../../../../infrastructure/repositories/ProyectoPublicoRepository'
import { ProyectoMineroRepository } from '../../../../infrastructure/repositories/ProyectoMineroRepository'
import { RegistroMineriaIlegalRepository } from '../../../../infrastructure/repositories/RegistroMineriaIlegalRepository'
import { mapResumenRegionResponse } from '../../_lib/mappers'
import { handleError } from '../../_lib/handleError'

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
      new ProyectoMineroRepository(),
      new RegistroMineriaIlegalRepository(),
    )
    const resumen = await uc.ejecutar(decodeURIComponent(region))
    return NextResponse.json(mapResumenRegionResponse(resumen))
  } catch (err) {
    return handleError(err)
  }
}

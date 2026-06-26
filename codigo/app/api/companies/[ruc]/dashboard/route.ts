import { NextRequest, NextResponse } from 'next/server'
import { ObtenerFichaEmpresa } from '../../../../../domain/use-cases/ObtenerFichaEmpresa'
import { CalcularScoreRiesgo } from '../../../../../domain/use-cases/CalcularScoreRiesgo'
import { EmpresaRepository } from '../../../../../infrastructure/repositories/EmpresaRepository'
import { RegistroSeguridadRepository } from '../../../../../infrastructure/repositories/RegistroSeguridadRepository'
import { RegistroAmbientalRepository } from '../../../../../infrastructure/repositories/RegistroAmbientalRepository'
import { RegistroLegalRepository } from '../../../../../infrastructure/repositories/RegistroLegalRepository'
import { DeudaRepository } from '../../../../../infrastructure/repositories/DeudaRepository'
import { ConflictoSocialRepository } from '../../../../../infrastructure/repositories/ConflictoSocialRepository'
import { ProyectoPublicoRepository } from '../../../../../infrastructure/repositories/ProyectoPublicoRepository'
import { ProyectoMineroRepository } from '../../../../../infrastructure/repositories/ProyectoMineroRepository'
import { RegistroMineriaIlegalRepository } from '../../../../../infrastructure/repositories/RegistroMineriaIlegalRepository'
import { mapFichaEmpresaResponse } from '../../../_lib/mappers'
import { handleError } from '../../../_lib/handleError'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ ruc: string }> },
) {
  const { ruc } = await params
  try {
    const uc = new ObtenerFichaEmpresa(
      new EmpresaRepository(),
      new RegistroSeguridadRepository(),
      new RegistroAmbientalRepository(),
      new RegistroLegalRepository(),
      new DeudaRepository(),
      new ConflictoSocialRepository(),
      new ProyectoPublicoRepository(),
      new ProyectoMineroRepository(),
      new RegistroMineriaIlegalRepository(),
      new CalcularScoreRiesgo(),
    )
    const ficha = await uc.ejecutar(ruc)
    return NextResponse.json(mapFichaEmpresaResponse(ficha))
  } catch (err) {
    return handleError(err)
  }
}

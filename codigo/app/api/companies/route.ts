import { NextRequest, NextResponse } from 'next/server'
import { BuscarEmpresas } from '../../../domain/use-cases/BuscarEmpresas'
import { EmpresaRepository } from '../../../infrastructure/repositories/EmpresaRepository'
import { mapEmpresaResponse } from '../_lib/mappers'
import { handleError } from '../_lib/handleError'

export async function GET(req: NextRequest) {
  const search = req.nextUrl.searchParams.get('search') ?? ''
  try {
    const empresas = await new BuscarEmpresas(new EmpresaRepository()).ejecutar(search)
    return NextResponse.json({ data: empresas.map(mapEmpresaResponse) })
  } catch (err) {
    return handleError(err)
  }
}

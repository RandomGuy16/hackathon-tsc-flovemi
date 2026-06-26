import { NextRequest, NextResponse } from 'next/server'
import { BuscarEmpresas } from '../../../domain/use-cases/BuscarEmpresas'
import { EmpresaRepository } from '../../../infrastructure/repositories/EmpresaRepository'

export async function GET(req: NextRequest) {
  const search = req.nextUrl.searchParams.get('search') ?? ''

  try {
    const uc = new BuscarEmpresas(new EmpresaRepository())
    const empresas = await uc.ejecutar(search)

    return NextResponse.json({
      data: empresas.map(e => ({
        ruc: e.ruc,
        razonSocial: e.razonSocial,
        region: e.region,
        province: e.provincia,
        district: e.distrito,
      })),
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error interno'
    const status = message.includes('3 caracteres') ? 400 : 500
    return NextResponse.json({ error: message }, { status })
  }
}

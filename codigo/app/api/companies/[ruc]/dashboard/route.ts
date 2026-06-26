import { NextRequest, NextResponse } from 'next/server'
import { ObtenerFichaEmpresa } from '../../../../../domain/use-cases/ObtenerFichaEmpresa'
import { EmpresaRepository } from '../../../../../infrastructure/repositories/EmpresaRepository'
import { RegistroSeguridadRepository } from '../../../../../infrastructure/repositories/RegistroSeguridadRepository'
import { RegistroAmbientalRepository } from '../../../../../infrastructure/repositories/RegistroAmbientalRepository'
import { RegistroLegalRepository } from '../../../../../infrastructure/repositories/RegistroLegalRepository'
import { DeudaRepository } from '../../../../../infrastructure/repositories/DeudaRepository'
import { ConflictoSocialRepository } from '../../../../../infrastructure/repositories/ConflictoSocialRepository'
import { ProyectoPublicoRepository } from '../../../../../infrastructure/repositories/ProyectoPublicoRepository'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ ruc: string }> },
) {
  const { ruc } = await params

  try {
    const ambientalRepo = new RegistroAmbientalRepository()

    const uc = new ObtenerFichaEmpresa(
      new EmpresaRepository(),
      new RegistroSeguridadRepository(),
      ambientalRepo,
      new RegistroLegalRepository(),
      new DeudaRepository(),
      new ConflictoSocialRepository(),
      new ProyectoPublicoRepository(),
    )

    const ficha = await uc.ejecutar(ruc)

    // Enriquecer calidad de aire con la región real de la empresa
    const calidadAire = ficha.empresa.region
      ? await ambientalRepo.obtenerCalidadAirePorRegion(ficha.empresa.region)
      : []

    const conflictosActivos = ficha.conflictos.filter(c => c.estado === 'activo').length
    const totalPresupuesto = ficha.proyectosPublicos.reduce((s, p) => s + p.presupuesto, 0)

    return NextResponse.json({
      ruc: ficha.empresa.ruc,
      razonSocial: ficha.empresa.razonSocial,
      summary: {
        riskLevel: ficha.scoreRiesgo.nivel,
        riskScore: ficha.scoreRiesgo.valor,
        lastSyncedAt: new Date().toISOString(),
      },
      safety: {
        fatalAccidents: ficha.seguridad.reduce((s, r) => s + r.accidentesMortales, 0),
        occupationalDiseases: ficha.seguridad.reduce((s, r) => s + r.enfermedadesOcupacionales, 0),
        source: 'MINEM',
      },
      environmental: {
        sanctionsCount: ficha.ambiental?.cantidadSanciones ?? 0,
        sanctions: (ficha.ambiental?.sanciones ?? []).map(s => ({
          authority: s.autoridad,
          date: s.fecha,
          description: s.descripcion,
          amount: s.monto,
        })),
        airQuality: calidadAire.map(a => ({
          stationName: a.nombreEstacion,
          year: a.año,
          parameter: a.parametro,
          value: a.valor,
          unit: a.unidad,
        })),
      },
      legal: {
        osceSanctions: (ficha.legal?.sancionesOsce ?? []).map(s => ({
          authority: s.autoridad,
          date: s.fecha,
          description: s.descripcion,
        })),
        osceFines: (ficha.legal?.multasOsce ?? []).map(f => ({
          authority: f.autoridad,
          date: f.fecha,
          amount: f.monto,
          currency: f.moneda,
        })),
        tenders: (ficha.legal?.licitaciones ?? []).map(l => ({
          code: l.codigo,
          title: l.titulo,
          date: l.fecha,
          amount: l.monto,
          currency: l.moneda,
        })),
      },
      social: {
        activeConflicts: conflictosActivos,
        conflicts: ficha.conflictos.map(c => ({
          region: c.region,
          province: c.provincia,
          district: c.distrito,
          description: c.descripcion,
          status: c.estado,
          reportedAt: c.reportadoEn,
        })),
      },
      investment: {
        publicProjects: ficha.proyectosPublicos.map(p => ({
          name: p.nombre,
          budget: p.presupuesto,
          physicalProgress: p.avanceFisico,
          executor: p.ejecutor,
        })),
        totalBudget: totalPresupuesto,
      },
      miningProjects: [],   // TODO: implementar cuando se agregue IProyectoMineroRepository
      illegalMining: [],    // TODO: implementar cuando se agregue IRegistroMineriaIlegalRepository
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error interno'
    const status = message.includes('11 dígitos') ? 400 : 500
    return NextResponse.json({ error: message }, { status })
  }
}

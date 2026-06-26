import type { FichaEmpresa } from '../../../domain/entities/ficha-empresa'
import type { ResumenRegion } from '../../../domain/entities/resumen-region'
import type { Empresa } from '../../../domain/entities/empresa'
import type { ProyectoMinero } from '../../../domain/entities/proyecto-minero'
import type { RegistroMineriaIlegal } from '../../../domain/entities/registro-mineria-ilegal'

// Mappers dominio (español) → JSON API (formato que consume el frontend en lib/types.ts)

// ─── /api/companies?search= ───────────────────────────────────────────────────

export function mapEmpresaSearchItem(empresa: Empresa) {
  return {
    ruc:        empresa.ruc,
    razonSocial: empresa.razonSocial,
    region:     empresa.region,
    province:   empresa.provincia,
    district:   empresa.distrito,
  }
}

// ─── /api/companies/[ruc]/dashboard ──────────────────────────────────────────

export function mapFichaEmpresaResponse(ficha: FichaEmpresa) {
  const totalPresupuesto = ficha.proyectosPublicos.reduce((s, p) => s + p.presupuesto, 0)

  return {
    ruc:        ficha.empresa.ruc,
    razonSocial: ficha.empresa.razonSocial,
    summary: {
      riskLevel:    ficha.scoreRiesgo.nivel,
      riskScore:    ficha.scoreRiesgo.valor,
      lastSyncedAt: new Date().toISOString(),
    },
    safety: {
      fatalAccidents:      ficha.seguridad.reduce((s, r) => s + r.accidentesMortales, 0),
      occupationalDiseases: ficha.seguridad.reduce((s, r) => s + r.enfermedadesOcupacionales, 0),
      source: 'MINEM',
    },
    environmental: {
      sanctionsCount: ficha.ambiental?.cantidadSanciones ?? 0,
      sanctions: (ficha.ambiental?.sanciones ?? []).map(s => ({
        authority:   s.autoridad,
        date:        s.fecha,
        description: s.descripcion,
        amount:      s.monto ?? null,
      })),
      airQuality: (ficha.ambiental?.calidadAire ?? []).map(a => ({
        stationName: a.nombreEstacion,
        year:        a.año,
        parameter:   a.parametro,
        value:       a.valor,
        unit:        a.unidad,
      })),
    },
    legal: {
      osceSanctions: (ficha.legal?.sancionesOsce ?? []).map(s => ({
        authority:   s.autoridad,
        date:        s.fecha,
        description: s.descripcion,
      })),
      osceFines: (ficha.legal?.multasOsce ?? []).map(f => ({
        authority: f.autoridad,
        date:      f.fecha,
        amount:    f.monto,
        currency:  f.moneda,
      })),
      tenders: (ficha.legal?.licitaciones ?? []).map(l => ({
        code:     l.codigo,
        title:    l.titulo,
        date:     l.fecha,
        amount:   l.monto ?? null,
        currency: l.moneda ?? null,
      })),
      sunatStatus: ficha.empresa.estado,
      sunatCondition: ficha.empresa.condicion ?? 'HABIDO',
      sunatAddress: ficha.empresa.domicilioFiscal ?? '',
      sunatLocales: ficha.empresa.locales ?? [],
      sunatDebts: (ficha.deudas ?? []).map(d => ({
        amount: d.monto,
        status: d.estado,
        authority: d.dependencia || 'SUNAT',
        resolutionsCount: d.nroResoluciones || 1
      }))
    },
    social: {
      activeConflicts: ficha.conflictos.filter(c => c.estado === 'activo').length,
      conflicts: ficha.conflictos.map(c => ({
        region:      c.region,
        province:    c.provincia,
        district:    c.distrito,
        description: c.descripcion,
        status:      c.estado,
        reportedAt:  c.reportadoEn,
      })),
    },
    investment: {
      publicProjects: ficha.proyectosPublicos.map(p => ({
        name:             p.nombre,
        budget:           p.presupuesto,
        physicalProgress: p.avanceFisico,
        executor:         p.ejecutor,
      })),
      totalBudget: totalPresupuesto,
    },
    miningProjects:  ficha.proyectosMineros.map(mapProyectoMinero),
    illegalMining:   ficha.registrosMineriaIlegal.map(mapMineriaIlegal),
  }
}

// ─── /api/regions/[region] ────────────────────────────────────────────────────

export function mapResumenRegionResponse(resumen: ResumenRegion) {
  return {
    region: resumen.region,
    companies: resumen.empresas.map(e => ({
      ruc:        e.ruc,
      razonSocial: e.razonSocial,
      latitude:   e.latitud,
      longitude:  e.longitud,
      riskLevel:  null,  // solo disponible en /dashboard individual
    })),
    conflicts: resumen.conflictos.map(c => ({
      description: c.descripcion,
      latitude:    null,
      longitude:   null,
      status:      c.estado,
    })),
    projects: resumen.proyectos.map(p => ({
      name:      p.nombre,
      budget:    p.presupuesto,
      latitude:  p.latitud,
      longitude: p.longitud,
    })),
    miningProjects: resumen.proyectosMineros.map(mapProyectoMinero),
    illegalMining:  resumen.registrosMineriaIlegal.map(mapMineriaIlegal),
  }
}

// ─── Helpers compartidos ──────────────────────────────────────────────────────

function mapProyectoMinero(p: ProyectoMinero) {
  return {
    id:                       p.id,
    name:                     p.nombre,
    status:                   p.estado,
    location:                 p.ubicacion,
    process:                  p.proceso,
    mineralType:              p.tipoMineral,
    estimatedMonthsRemaining: p.mesesRestantesEstimados,
  }
}

function mapMineriaIlegal(r: RegistroMineriaIlegal) {
  return {
    id:                   r.id,
    location:             r.ubicacion,
    reason:               r.motivo,
    regularizationStatus: r.estadoRegularizacion,
    detectedAt:           r.detectadoEn ?? null,
  }
}

import type { FichaEmpresa } from '../../../domain/entities/ficha-empresa'
import type { ResumenRegion } from '../../../domain/entities/resumen-region'
import type { Empresa } from '../../../domain/entities/empresa'

// Mappers de dominio → JSON API
// Mantenerlos aquí evita lógica de presentación dispersa en los route handlers

export function mapEmpresaResponse(empresa: Empresa) {
  return {
    ruc:        empresa.ruc,
    razonSocial: empresa.razonSocial,
    estado:     empresa.estado,
    region:     empresa.region,
    provincia:  empresa.provincia,
    distrito:   empresa.distrito,
    latitud:    empresa.latitud,
    longitud:   empresa.longitud,
  }
}

export function mapFichaEmpresaResponse(ficha: FichaEmpresa) {
  return {
    empresa:      mapEmpresaResponse(ficha.empresa),
    scoreRiesgo: {
      valor:    ficha.scoreRiesgo.valor,
      nivel:    ficha.scoreRiesgo.nivel,
      desglose: ficha.scoreRiesgo.desglose,
    },
    seguridad:             ficha.seguridad,
    ambiental:             ficha.ambiental,
    legal:                 ficha.legal,
    deudas:                ficha.deudas,
    conflictos:            ficha.conflictos,
    proyectosPublicos:     ficha.proyectosPublicos,
    proyectosMineros:      ficha.proyectosMineros,
    registrosMineriaIlegal: ficha.registrosMineriaIlegal,
  }
}

export function mapResumenRegionResponse(resumen: ResumenRegion) {
  return {
    region:                  resumen.region,
    empresas:                resumen.empresas.map(mapEmpresaResponse),
    conflictos:              resumen.conflictos,
    proyectos:               resumen.proyectos,
    proyectosMineros:        resumen.proyectosMineros,
    registrosMineriaIlegal:  resumen.registrosMineriaIlegal,
  }
}

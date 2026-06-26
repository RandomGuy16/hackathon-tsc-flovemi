// ─── Validación de entrada ────────────────────────────────────────────────────
export const BUSQUEDA_MIN_CHARS = 3
export const RUC_REGEX = /^\d{11}$/
export const EMPRESA_SIN_DATOS = {
  razonSocial: 'No disponible',
  estado: 'inactiva' as const,
  region: 'No disponible',
  provincia: null,
  distrito: null,
  latitud: null,
  longitud: null,
}

// ─── Score de riesgo ──────────────────────────────────────────────────────────
// Pesos de cada dimensión — deben sumar exactamente 1.0
export const SCORE_PESOS = {
  seguridad:    0.40,
  legalidad:    0.35,
  impactoSocial: 0.25,
} as const

// Rangos de nivel — ajustar aquí afecta a ScoreRiesgo y toda la app
export const SCORE_RANGOS = {
  BAJO:  { max: 30 },
  MEDIO: { max: 60 },
  // ALTO: cualquier valor > 60
} as const

// Puntos por indicador — cambiar aquí afecta automáticamente a CalcularScoreRiesgo
export const SCORE_PUNTOS = {
  seguridad: {
    mortalesMedio:       { umbral: 1,  puntos: 30 },
    mortalesAlto:        { umbral: 3,  puntos: 50 },
    enfermedadesMedio:   { umbral: 3,  puntos: 15 },
    enfermedadesAlto:    { umbral: 10, puntos: 30 },
  },
  legalidad: {
    oefaFirmesMedio:     { umbral: 1,       puntos: 20 },
    oefaFirmesAlto:      { umbral: 3,       puntos: 40 },
    multaOsceMedio:      { umbral: 0,       puntos: 15 }, // > 0 suma
    multaOsceAlto:       { umbral: 100_000, puntos: 30 },
    penalidades:         { puntos: 15 },
    impedida:            { puntos: 30 },
    deudaSunat:          { puntos: 20 },
  },
  impactoSocial: {
    conflictoUno:        { umbral: 1, puntos: 30 },
    conflictoMuchos:     { umbral: 2, puntos: 60 },
  },
} as const

// ─── Infraestructura ──────────────────────────────────────────────────────────
// TTL de latinfo_cache en minutos — pasado este tiempo se re-consulta la API
export const LATINFO_CACHE_TTL_MIN = 30
// Máximo de registros de calidad de aire a devolver por región
export const AIR_QUALITY_LIMIT = 20

import { NextResponse } from 'next/server'
import {
  BusquedaInvalidaError,
  RucInvalidoError,
  EmpresaNoEncontradaError,
  RegionRequeridaError,
} from '../../../domain/errors'

// Convierte errores de dominio a respuestas HTTP semánticas
export function handleError(error: unknown): NextResponse {
  if (error instanceof BusquedaInvalidaError || error instanceof RucInvalidoError || error instanceof RegionRequeridaError) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
  if (error instanceof EmpresaNoEncontradaError) {
    return NextResponse.json({ error: error.message }, { status: 404 })
  }
  console.error('[MineraWatch API]', error)
  const mensaje = error instanceof Error ? error.message : 'Error interno del servidor'
  return NextResponse.json({ error: mensaje }, { status: 500 })
}

// Errores de dominio tipados — las rutas API los capturan para devolver el HTTP status correcto
export class ErrorDominio extends Error {
  constructor(message: string) {
    super(message)
    this.name = this.constructor.name
  }
}

export class BusquedaInvalidaError extends ErrorDominio {}   // → HTTP 400
export class RucInvalidoError extends ErrorDominio {}        // → HTTP 400
export class EmpresaNoEncontradaError extends ErrorDominio {}// → HTTP 404
export class RegionRequeridaError extends ErrorDominio {}    // → HTTP 400

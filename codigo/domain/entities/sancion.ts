export type Sancion = {
  empresaRuc: string
  fuente: 'OEFA' | 'OSCE'
  descripcion: string
  fecha: string
  monto: number
  estado: string
}

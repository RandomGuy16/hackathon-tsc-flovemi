// Datos anuales de MINEM (cargados vía CSV a Supabase — tabla safety_records)
export type RegistroSeguridad = {
  id: string
  empresaRuc: string
  año: number
  accidentesMortales: number
  enfermedadesOcupacionales: number
  urlFuente: string | null
}

export type BpType = {
  readingId?: string
  patientId: string
  dateTaken: string
  timeTaken: string
  systolic: string
  diastolic: string
  pulseRate: string
  comments?: string
}

export type BpAverages = {
  systolic: number
  diastolic: number
  pulseRate: number
}

export interface reportType {
  patientId: string
  reportType?: string
  startDate?: string | null
  endDate?: string | null
  includeMedication?: string
  isPdf?: boolean
}

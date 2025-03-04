import { Medication } from '@/constants/medication'
import { apiUrl } from '@/constants/types'

export async function addNewMedication({
  medicationId,
  patientId,
  medicationName,
  type,
  dosage,
  frequency,
  startDate,
  endDate,
  reminder,
  dates,
}: Medication) {
  const res = await fetch(`${apiUrl}?action=addNewMedication`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      medication_id: medicationId,
      patient_id: patientId,
      medication_name: medicationName,
      type,
      dosage,
      frequency,
      start_date: startDate,
      end_date: endDate,
      reminder,
      dates,
    }),
  })

  if (!res.ok) throw new Error('Error occurred adding new medication')

  return await res.json()
}

export async function getMedicationList(
  patientId: string,
  selectedDate: string
) {
  const res = await fetch(
    `${apiUrl}?action=getMedicationList&patient_id=${patientId}&selected_date=${selectedDate}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )

  if (!res.ok) throw new Error('Error occurred getting medication list')

  return await res.json()
}

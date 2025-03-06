import { addNewMedicationStatusType, Medication } from '@/constants/medication'
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
  actions,
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
      actions,
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

export async function addNewMedicationStatus({
  medicationId,
  date,
  status,
  time,
}: addNewMedicationStatusType) {
  console.log('BEFORE')
  const res = await fetch(`${apiUrl}?action=addNewMedicationStatus`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      medication_id: medicationId,
      date,
      status,
      time,
    }),
  })
  console.log('AFTER')
  if (!res.ok) throw new Error('Error occurred updating medication status')

  return await res.json()
}

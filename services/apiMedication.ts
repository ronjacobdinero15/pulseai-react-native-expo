import moment from 'moment'
import { addNewMedicationStatusType, Medication } from '../constants/medication'
import { reportType } from '../constants/types'
import { apiUrl } from '../constants/url'

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
      medication_name: medicationName.trim(),
      type: type.trim(),
      dosage: dosage.trim(),
      frequency: frequency.trim(),
      start_date: startDate.trim(),
      end_date: endDate.trim(),
      reminder: reminder.trim(),
      dates,
      actions,
    }),
  })

  if (!res.ok) throw new Error('Error occurred adding new medication')

  return await res.json()
}

export async function getMedicationListForSelectedDate(
  patientId: string,
  selectedDate: string
) {
  const res = await fetch(
    `${apiUrl}?action=getMedicationListForSelectedDate&patient_id=${patientId}&selected_date=${selectedDate}`,
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

export async function getMedicationList({
  patientId,
  startDate,
  endDate,
}: reportType) {
  const url = new URL(`${apiUrl}?action=getMedicationList`)
  url.searchParams.append('patient_id', patientId)

  if (startDate && endDate) {
    url.searchParams.append(
      'start_date',
      moment(startDate, 'MM/DD/YYYY').format('ll')
    )
    url.searchParams.append(
      'end_date',
      moment(endDate, 'MM/DD/YYYY').format('ll')
    )
  }

  const res = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!res.ok) throw new Error('Error occurred getting medication list')

  return await res.json()
}

export async function addNewMedicationStatus({
  medicationId,
  date,
  status,
  time,
}: addNewMedicationStatusType) {
  const res = await fetch(`${apiUrl}?action=addNewMedicationStatus`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      medication_id: medicationId,
      date: date.trim(),
      status: status.trim(),
      time: time.trim(),
    }),
  })

  if (!res.ok) throw new Error('Error occurred updating medication status')

  return await res.json()
}

export async function getAllPatients() {
  const res = await fetch(`${apiUrl}?action=getAllPatients`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!res.ok) throw new Error('Error occurred fetching all patients')

  return await res.json()
}

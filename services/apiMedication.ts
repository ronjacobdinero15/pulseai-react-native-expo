import {
  AddNewBpType,
  addNewMedicationStatusType,
  Medication,
} from '../constants/medication'
import { apiUrl } from '../constants/types'

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

export async function addNewBp({
  patientId,
  dateTaken,
  timeTaken,
  systolic,
  diastolic,
  pulseRate,
  comments,
}: AddNewBpType) {
  const res = await fetch(`${apiUrl}?action=addNewBp`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      patient_id: patientId,
      date_taken: dateTaken,
      time_taken: timeTaken,
      systolic,
      diastolic,
      pulse_rate: pulseRate,
      comments,
    }),
  })

  if (!res.ok) throw new Error('Error occurred adding new BP for today')

  return await res.json()
}

export async function getBpForTodayList({
  patientId,
  dateTaken,
}: {
  patientId: string
  dateTaken: string
}) {
  const res = await fetch(
    `${apiUrl}?action=getBpForTodayList&patient_id=${patientId}&date_taken=${dateTaken}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )

  if (!res.ok) throw new Error('Error occurred fetching BP for today')

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

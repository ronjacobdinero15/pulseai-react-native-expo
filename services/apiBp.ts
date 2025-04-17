import { BpType } from '../constants/bp'
import { reportType } from '../constants/types'
import { apiUrl } from '../constants/url'

export async function addNewBp({
  patientId,
  dateTaken,
  timeTaken,
  systolic,
  diastolic,
  pulseRate,
  comments,
}: BpType) {
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

export async function getBpList({ patientId, startDate, endDate }: reportType) {
  const url = new URL(`${apiUrl}?action=getBpList`)
  url.searchParams.append('patient_id', patientId)

  if (startDate && endDate) {
    url.searchParams.append('start_date', startDate)
    url.searchParams.append('end_date', endDate)
  }

  const res = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!res.ok) throw new Error('Error occurred fetching BP list')

  return await res.json()
}

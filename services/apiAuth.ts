import { SignUpTypes } from '@/constants/signup'

export const apiUrl = process.env.EXPO_PUBLIC_DB_URL

export async function registerPatient(data: SignUpTypes) {
  const res = await fetch(`${apiUrl}?action=registerPatient`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!res.ok) throw new Error('Could not register a new user')

  return await res.json()
}

export async function loginPatient(email: string, password: string) {
  const res = await fetch(`${apiUrl}?action=loginPatient`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  })

  if (!res.ok) throw new Error('Error occurred logging in')

  return await res.json()
}

export async function forgotPassword(email: string) {
  const res = await fetch(`${apiUrl}?action=forgotPassword`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  })

  if (!res.ok) throw new Error('Error occurred resetting your account password')

  return await res.json()
}

export async function updatePatientNeedsOnboarding(
  patient_id: number,
  needsOnboarding: number
) {
  await fetch(`${apiUrl}?action=updatePatientNeedsOnboarding`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ patient_id, needsOnboarding }),
  })
}

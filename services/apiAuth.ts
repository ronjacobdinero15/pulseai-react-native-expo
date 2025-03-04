import { SignUpType } from '@/constants/signup'
import { apiUrl } from '@/constants/types'

export async function registerPatient({
  firstName,
  lastName,
  dateOfBirth,
  email,
  password,
  age,
  gender,
  vices,
  bmiHeightCm,
  bmiWeightKg,
  comorbidities,
  parentalHypertension,
  lifestyle,
}: SignUpType) {
  const res = await fetch(`${apiUrl}?action=registerPatient`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      first_name: firstName,
      last_name: lastName,
      date_of_birth: dateOfBirth,
      email,
      password,
      age,
      gender,
      vices,
      bmi_height_cm: bmiHeightCm,
      bmi_weight_kg: bmiWeightKg,
      comorbidities,
      parental_hypertension: parentalHypertension,
      lifestyle,
    }),
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
  patientId: number,
  needsOnboarding: number
) {
  await fetch(`${apiUrl}?action=updatePatientNeedsOnboarding`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      patient_id: patientId,
      needs_onboarding: needsOnboarding,
    }),
  })
}

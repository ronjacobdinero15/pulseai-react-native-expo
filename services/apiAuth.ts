import { SignUpType } from '@/constants/signup'
import { apiUrl, PasswordType } from '@/constants/types'

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
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      full_name: `${firstName.trim()} ${lastName.trim()}`,
      date_of_birth: dateOfBirth,
      email: email.trim(),
      password,
      age: age.trim(),
      gender: gender.trim(),
      vices,
      bmi_height_cm: bmiHeightCm.trim(),
      bmi_weight_kg: bmiWeightKg.trim(),
      comorbidities,
      parental_hypertension: parentalHypertension.trim(),
      lifestyle: lifestyle.trim(),
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
    body: JSON.stringify({
      email: email.trim(),
      password: password.trim(),
    }),
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
    body: JSON.stringify({ email: email.trim() }),
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

export async function getPatientProfile(patientId: string) {
  const res = await fetch(
    `${apiUrl}?action=getPatientProfile&patient_id=${patientId}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )

  if (!res.ok) throw new Error('Error occurred fetching patient profile')

  return await res.json()
}

export async function updatePatientProfile({
  patientId,
  firstName,
  lastName,
  dateOfBirth,
  email,
  age,
  gender,
  bmiHeightCm,
  bmiWeightKg,
  vices,
  comorbidities,
  parentalHypertension,
  lifestyle,
}: SignUpType) {
  const res = await fetch(`${apiUrl}?action=updatePatientProfile`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      patient_id: patientId,
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      full_name: `${firstName.trim()} ${lastName.trim()}`,
      date_of_birth: dateOfBirth,
      email: email.trim(),
      age: age.trim(),
      gender: gender.trim(),
      bmi_height_cm: bmiHeightCm.trim(),
      bmi_weight_kg: bmiWeightKg.trim(),
      vices,
      comorbidities,
      parental_hypertension: parentalHypertension.trim(),
      lifestyle: lifestyle.trim(),
    }),
  })

  if (!res.ok) throw new Error('Error occurred updating patient profile')

  return await res.json()
}

export async function updatePatientPassword({
  patientId,
  oldPassword,
  newPassword,
}: PasswordType) {
  const res = await fetch(`${apiUrl}?action=updatePatientPassword`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      patient_id: patientId,
      old_password: oldPassword,
      new_password: newPassword,
    }),
  })

  if (!res.ok) throw new Error('Error occurred updating password')

  return await res.json()
}

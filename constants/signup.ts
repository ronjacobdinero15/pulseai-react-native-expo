export type PatientProfileType = {
  doctorId?: string
  patientId?: string
  firstName: string
  lastName: string
  fullName?: string
  dateOfBirth: string
  contact: string
  address: string
  email: string
  password?: string
  passwordConfirm?: string
  age: string
  gender: string
  vices: string[]
  bmiHeightCm: string
  bmiWeightKg: string
  comorbidities: string[]
  parentalHypertension: string
  lifestyle: string
  needsOnboarding?: boolean
}

export const VICESOPTIONS: string[] = [
  'Alcohol',
  'Smoking',
  'Drugs',
  'Others',
  'None',
]

export const COMORBIDITIESOPTIONS: string[] = [
  'Diabetes',
  'Heart disease',
  'Kidney disease',
  'High cholesterol',
  'Others',
  'None',
]

// REQUIRED TO HAVE LABEL AND VALUE
export const GENDEROPTIONS: { label: string; value: string }[] = [
  { label: 'Male', value: 'Male' },
  { label: 'Female', value: 'Female' },
  { label: 'Prefer not to say', value: 'Prefer not to say' },
]

export const LIFESTYLEOPTIONS: { label: string; value: string }[] = [
  {
    label: 'Sedentary (Little to no exercise)',
    value: 'Sedentary (Little to no exercise)',
  },
  {
    label: 'Moderately Active (Exercise 1-3 days/week)',
    value: 'Moderately Active (Exercise 1-3 days/week)',
  },
  {
    label: 'Active (Exercise 4-6 days/week)',
    value: 'Active (Exercise 4-6 days/week)',
  },
  {
    label: 'Very Active (Daily intense activity)',
    value: 'Very Active (Daily intense activity)',
  },
]

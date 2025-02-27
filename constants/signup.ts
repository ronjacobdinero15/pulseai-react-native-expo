export const genderOptions: { label: string; value: string }[] = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Prefer not to say', value: 'prefer not to say' },
]

export const vicesOptions: { key: string; value: string }[] = [
  { key: '1', value: 'Alcohol' },
  { key: '2', value: 'Smoking' },
  { key: '3', value: 'Drugs' },
  { key: '4', value: 'Others' },
  { key: '5', value: 'None' },
]

export const lifestyleOptions: { label: string; value: string }[] = [
  { label: 'Sedentary (Little to no exercise)', value: 'sedentary' },
  {
    label: 'Moderately Active (Exercise 1-3 days/week)',
    value: 'moderately active',
  },
  { label: 'Active (Exercise 4-6 days/week)', value: 'active' },
  { label: 'Very Active (Daily intense activity)', value: 'very active' },
]

export const comorbiditiesOptions: { key: string; value: string }[] = [
  { key: '1', value: 'Diabetes' },
  { key: '2', value: 'Heart Disease' },
  { key: '3', value: 'Kidney Disease' },
  { key: '4', value: 'High Cholesterol' },
  { key: '5', value: 'Others' },
  { key: '6', value: 'None' },
]

export type SignUpTypes = {
  email: string
  password: string
  passwordConfirm: string
  age: string
  gender: string
  vices: string[]
  bmi_height_cm: string
  bmi_weight_kg: string
  comorbidities: string[]
  parental_hypertension: string
  lifestyle: string
  needsOnboarding: boolean
}

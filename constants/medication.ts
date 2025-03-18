import { ImageSourcePropType } from 'react-native'

export type Medication = {
  medicationId: string
  patientId: string
  medicationName: string
  type: string
  dosage: string
  frequency: string
  startDate: string
  endDate: string
  reminder: string
  dates: string[]
  actions?: { date: string; status: string; time: string }[] | []
  selectedDate?: string
  taken?: string
}

export type addNewMedicationStatusType = {
  medicationId: string
  date: string
  status: string
  time: string
}

export type AddNewBpForTodayType = {
  currentUserId: string
  systolic?: string
  diastolic?: string
  dateTaken: string
}

type MedicineType = {
  name: string
  icon: ImageSourcePropType
}

export const MEDICINES: MedicineType[] = [
  {
    name: 'Tablet',
    icon: require('../assets/images/tablet.png'),
  },
  {
    name: 'Capsule',
    icon: require('../assets/images/capsule.png'),
  },
  {
    name: 'Drops',
    icon: require('../assets/images/dropper.png'),
  },
  {
    name: 'Syrup',
    icon: require('../assets/images/syrup.png'),
  },
  {
    name: 'Injection',
    icon: require('../assets/images/syringe.png'),
  },
]

export const TAKENORNOT: { label: string; value: string }[] = [
  { label: 'Not yet taken', value: 'Not Taken' },
  { label: 'Already taken', value: 'Taken' },
  { label: 'Missed', value: 'Missed' },
]

export const FREQUENCY: { label: string; value: string }[] = [
  { label: 'Morning', value: 'Morning' },
  { label: 'Before lunch', value: 'Before lunch' },
  { label: 'After lunch', value: 'After lunch' },
  { label: 'Afternoon', value: 'Afternoon' },
  { label: 'Evening', value: 'Evening' },
  { label: 'Before dinner', value: 'Before dinner' },
  { label: 'After dinner', value: 'After dinner' },
  { label: 'Before sleeping', value: 'Before sleeping' },
]

export const BP_OPTIONS: { category: string; range: string }[] = [
  { category: 'Normal BP', range: '< 120/80 mmHg' },
  { category: 'Borderline BP', range: '120-139/ 80-89 mmHg' },
  { category: 'Hypertension', range: '> 140/90 mmHg' },
]

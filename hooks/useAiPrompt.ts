import { BpType } from '../constants/bp'
import { reportType } from '../constants/types'
import { getPatientProfile } from '../services/apiAuth'
import { getBpList } from '../services/apiBp'
import { getMedicationList } from '../services/apiMedication'
import { calculateBpAverage } from '../utils/helpers'

export function useAiPrompt() {
  const fetchPatientInfo = async ({
    patientId,
    startDate = null,
    endDate = null,
  }: reportType) => {
    try {
      const resPatientProfile = await getPatientProfile(patientId)
      const resBpList = await getBpList({ patientId, startDate, endDate })
      const resMedicationList = await getMedicationList({
        patientId,
        startDate,
        endDate,
      })

      // Ensure resBpList.bpList is an array
      const bpList = Array.isArray(resBpList.bpList)
        ? await resBpList.bpList
        : []

      const { systolic, diastolic, pulseRate } = calculateBpAverage(
        await bpList
      )

      const {
        firstName,
        age,
        gender,
        bmiHeightCm,
        bmiWeightKg,
        comorbidities,
        lifestyle,
        parentalHypertension,
        vices,
      } = await resPatientProfile.patient

      const prompt = `
            Age: ${age}
            Gender: ${gender}
            Height: ${bmiHeightCm} cm
            Weight: ${bmiWeightKg} kg
            Comorbidities: ${comorbidities}
            Lifestyle: ${lifestyle}
            Parental history of hypertension:  ${parentalHypertension}
            Vices:  ${vices}
            BP readings: ${bpList
              .map(
                (b: BpType) =>
                  `${b.dateTaken}: ${b.systolic}/${b.diastolic} mmHg (Pulse: ${b.pulseRate} bpm)`
              )
              .join('; ')}
            Average BP: ${systolic}/${diastolic} mmHg (Pulse: ${pulseRate} bpm)
            
            Use this blood pressure classification for Adult Filipinos. This is a general guideline that only applies to Filipino. Philippine Society of Hypertension (PSH) guidelines:
            Normal BP < 120/80 mmHg
            Borderline BP 120-139/80-89 mmHg
            Hypertension >= 140/90 mmHg
            
            Strictly never give a prompt when there is no bp readings of at least 2.
            Make sure to mention the average blood pressure and pulse rate in the analysis.
            Provide a concise clinical interpretation and recommendations based on the data above.
            Never suggest any medications or treatments. Always recommend consulting a healthcare professional for medical advice.
          `

      return {
        patientProfile: resPatientProfile.patient,
        bpList,
        medicationList: resMedicationList.medications || [],
        systolic,
        diastolic,
        pulseRate,
        prompt,
      }
    } catch (error) {
      console.error('[useAiPrompt] 🔴 Error fetching patient info:', error)
      throw new Error('Failed to fetch patient info')
    }
  }

  return { fetchPatientInfo }
}

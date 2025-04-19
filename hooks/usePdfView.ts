import * as FileSystem from 'expo-file-system'
import * as IntentLauncher from 'expo-intent-launcher'
import * as Print from 'expo-print'
import { Alert, Linking, Platform } from 'react-native'
import PdfReport from '../components/PdfReport'
import type { BpType } from '../constants/bp'
import type { reportType } from '../constants/types'
import { useAiPrompt } from './useAiPrompt'

export const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY

function usePatientPdfView() {
  const generateAndOpenPdf = async ({
    patientId,
    startDate = null,
    endDate = null,
    returnHtml = false,
  }: reportType & {
    returnHtml?: boolean
  }) => {
    const { fetchPatientInfo } = useAiPrompt()
    const { patientProfile, bpList, medicationList, prompt } =
      await fetchPatientInfo({
        patientId,
        startDate,
        endDate,
      })

    if (!patientProfile) {
      Alert.alert('Error', 'Patient profile is not available.')
      return
    }

    // 🔥 Log and Alert patanggal na lang to for debugging purposes lang
    console.log('🔥 Gemini Prompt:', prompt)

    // Gemini call (v1beta model & proper structure)
    let analysisText = 'AI analysis unavailable.' //default when AI is not available
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
          }),
        }
      )

      const json = await res.json()
      console.log('🌟 Gemini API Response:', JSON.stringify(json, null, 2))

      analysisText =
        json.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
        'No AI analysis available.'
    } catch (err) {
      console.warn('Gemini error:', err)
    }

    const analysisHtml = analysisText
      .split('\n')
      .map(
        line => line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Replace **word** with <strong>word</strong>
      )
      .map(line => `<p>${line}</p>`)
      .join('')

    const html = PdfReport({
      patientId,
      patientProfile,
      bpList,
      medicationList,
      startDate,
      endDate,
      analysisHtml,
    })

    if (returnHtml) return html

    try {
      const { uri } = await Print.printToFileAsync({ html, base64: false })
      const newUri =
        FileSystem.documentDirectory +
        `PatientID_${patientId}_BP_Summary_Report.pdf`
      await FileSystem.moveAsync({ from: uri, to: newUri })

      if (Platform.OS === 'android') {
        const contentUri = await FileSystem.getContentUriAsync(newUri)
        await IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
          data: contentUri,
          flags: 1,
          type: 'application/pdf',
        })
      } else {
        await Linking.openURL(newUri)
      }
    } catch (e) {
      console.error(e)
      Alert.alert('Error', 'Failed to generate/open PDF.')
    }
  }

  return generateAndOpenPdf
}

export default usePatientPdfView

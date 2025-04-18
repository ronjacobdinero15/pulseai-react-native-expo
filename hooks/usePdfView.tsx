import * as FileSystem from 'expo-file-system'
import * as IntentLauncher from 'expo-intent-launcher'
import * as Print from 'expo-print'
import moment from 'moment'
import { Alert, Linking, Platform } from 'react-native'
import type { BpType } from '../constants/bp'
import type { Medication } from '../constants/medication'
import type { PatientProfileType } from '../constants/signup'
import type { reportType } from '../constants/types'
import { getPatientProfile } from '../services/apiAuth'
import { getBpList } from '../services/apiBp'
import { getMedicationList } from '../services/apiMedication'
import { calculateBpAverage } from '../utils/helpers'

export const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY

type htmlTemplateType = {
  patientId: string
  patientProfile: PatientProfileType
  bpList: BpType[]
  medicationList: Medication[]
  startDate: string | null
  endDate: string | null
  analysisHtml: string
}

const htmlTemplate = ({
  patientId,
  patientProfile,
  bpList,
  medicationList,
  startDate,
  endDate,
  analysisHtml,
}: htmlTemplateType) => `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
    <title>Patient Report</title>
    <style>
      @page {
        margin: 5mm;
        size: auto;
      }
    
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      body {
        margin: 0.5rem 1rem;
        font-family: Arial, sans-serif;
      }

      table p {
        margin: 0.3rem 0;
      }

      table {
        width: 100%;
        margin: 10px 0;
        border-collapse: collapse;
        table-layout: fixed;
        page-break-inside: auto;
      }

      table p {
        text-align: center;
      }

      th, td {
        padding: 6px;
        border: 1px solid #dddddd;
        text-align: center;
        page-break-inside: avoid;
      }

      th {
        background-color: #f8f9fa;
        font-weight: 600;
      }

      .bp-record td:last-child {
        word-wrap: break-word;
        overflow-wrap: break-word;
        text-align: left;
      }

      .container {
        display: flex;
        flex-direction: column;
        gap: 20px;
        margin-bottom: 20px;
      }

      .greenBox {
        background-color: #287641;
        color: #fff;
        padding: 10px;
        border-radius: 5px;
      }
      
      .blackBox {
        background-color: #333333;
        color: #fff;
        padding: 10px;
        border-radius: 5px;
        margin-top: 20px;
      }

      .aiHeader {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-bottom: 20px;
      }

      .guidelinesContainer {
        margin-top: 20px;
      }
      
      .guidelinesContainer th {
        background-color: white;
        color: #333333;
      }
      
      .guidelinesContainer table,
      .guidelinesContainer td {
        color: white; 
      }
      
      .disclaimer {
        margin-top: 20px;
        padding: 10px;
        background-color: #f8d7da;
        color: #721c24;
        border: 1px solid #f5c6cb;
        border-radius: 5px;
        font-size: 0.9rem;
      }

      .personalInfoContainer {
        display: flex;
        flex-direction: column;
        gap: 2px;
      }

      .healthInfoContainer {
        display: flex;
        gap: 50px;
      }

      .report-period {
        text-align: center;
        margin: 10px 0;
        font-style: italic;
        color: #555;
      }

      @media print {
        body {
          margin: 10mm;
          font-size: 10pt;
        }
        table {
          font-size: 9pt;
        }
        td, th {
          padding: 3px;
        }
      }
    </style>
  </head>
  <body>
    <h2 style="text-align: center;">Patient Health Summary Report</h2>
    ${
      startDate && endDate
        ? `
    <p class="report-period">Report Period: ${moment(
      startDate,
      'MM/DD/YYYY'
    ).format('ll')} - ${moment(endDate, 'MM/DD/YYYY').format('ll')}</p>
    `
        : ''
    }
    <div>
      <div class="container">
        <div style="padding: 10px;">
          <h3 class="title">Profile</h3>
          <div class="personalInfoContainer">
            <p>Patient ID: ${patientId}</p>
            <p>First name: ${patientProfile.firstName}</p>
            <p>Last name: ${patientProfile.lastName}</p>
            <p>Full name: ${patientProfile.fullName}</p>
            <p>Date of birth: ${patientProfile.dateOfBirth}</p>
            <p>Contact: ${patientProfile.contact}</p>
            <p>Address: ${patientProfile.address}</p>
            <p>Email: ${patientProfile.email}</p>
          </div>
        </div>
        
        <div class="greenBox">
          <h3 class="title">Health information</h3>
          <div class="healthInfoContainer">
            <div>
              <p>Age: ${patientProfile.age}</p>
              <p>Gender: ${patientProfile.gender}</p>
              <p>BMI height: ${patientProfile.bmiHeightCm} cm</p>
              <p>BMI weight: ${patientProfile.bmiWeightKg} kg</p>
            </div>

            <div>
              <p>Vices: ${patientProfile.vices.join(', ')}</p>
              <p>Comorbidities: ${patientProfile.comorbidities.join(', ')}</p>
              <p>Parental hypertension: ${
                patientProfile.parentalHypertension
              }</p>
              <p>Lifestyle: ${patientProfile.lifestyle}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <table style="margin-bottom: 20px;">
      <colgroup>
        <col style="width: 16%;">
        <col style="width: 12%;">
        <col style="width: 18%;">
        <col style="width: 12%;">
        <col style="width: 44%;">
      </colgroup>
      <thead>
        <tr>
          <th colspan="5" style="text-align: center; padding: 16px;">
            Blood Pressure Record
          </th>
        </tr>
        <tr>
          <th>Date</th>
          <th>Time</th>
          <th>
            <p>Blood Pressure</p>
            <p style="font-size: 0.6rem;">(Systolic/Diastolic)</p>
          </th>
          <th>
            <p>Pulse</p>
            <p style="font-size: 0.6rem;">/min</p></th>
          <th>
            <p>Notes</p>
            <p style="font-size: 0.6rem;">(e.g. medication changes, feeling unwell)</p></th>

        </tr>
      </thead>
      <tbody>
        ${
          bpList.length > 0
            ? bpList
                .map(
                  bp => `
          <tr class="bp-record">
            <td style="white-space: nowrap;">${bp.dateTaken}</td>
            <td style="white-space: nowrap;">${bp.timeTaken}</td>
            <td style="white-space: nowrap;">${bp.systolic}/${bp.diastolic}</td>
            <td style="white-space: nowrap;">${bp.pulseRate}</td>
            <td>${bp.comments || ''}</td>
          </tr>
        `
                )
                .join('')
            : `
          <tr>
            <td colspan="5" style="text-align: center; padding: 16px;">
              No data available
            </td>
          </tr>`
        }
      </tbody>
    </table>

    <table>
      <colgroup class="colgroup-2">
        <col style="width: 16%;">
        <col style="width: 16%;">
        <col style="width: 16%;">
        <col style="width: 20%;">
        <col style="width: 16%;">
        <col style="width: 16%;">
      </colgroup>
      <thead>
        <tr>
          <th colspan="6" style="text-align: center; padding: 16px;">
            Medication Record
          </th>
        </tr>
        <tr>
          <th>Scheduled Date</th>
          <th>Action Status</th>
          <th>Action Time</th>
          <th>Medication Name</th>
          <th>Start Date</th>
          <th>End Date</th>
        </tr>
      </thead>
      <tbody>
        ${
          medicationList.length > 0
            ? medicationList
                .reduce(
                  (acc, medication) => {
                    const dates = medication.dates || []
                    const actions = medication.actions || []

                    // Create a row for each scheduled date
                    // Note: We're not filtering for past dates here since our PHP function already filters by date range
                    const rows = dates.map((medDate: string) => {
                      const action = actions.find(
                        (a: { date: string }) => a.date === medDate
                      )
                      return {
                        date: medDate,
                        status: action ? action.status : 'Missed',
                        time: action ? action.time : '‒',
                        medicationName: medication.medicationName,
                        startDate: medication.startDate,
                        endDate: medication.endDate,
                      }
                    })
                    return acc.concat(rows)
                  },
                  [] as Array<{
                    date: string
                    status: string
                    time: string
                    medicationName: string
                    startDate: string
                    endDate: string
                  }>
                )
                // Sort the combined rows by date
                .sort((a, b) =>
                  moment(a.date, 'MM/DD/YYYY').diff(
                    moment(b.date, 'MM/DD/YYYY')
                  )
                )
                .map(
                  row => `
                    <tr>
                      <td style="white-space: nowrap;">${moment(
                        row.date,
                        'MM/DD/YYYY'
                      ).format('ll')}</td>
                      <td style="white-space: nowrap;">${row.status}</td>
                      <td style="white-space: nowrap;">${row.time}</td>
                      <td style="white-space: nowrap;">${
                        row.medicationName
                      }</td>
                      <td>${moment(row.startDate, 'MM/DD/YYYY').format(
                        'll'
                      )}</td>
                      <td>${moment(row.endDate, 'MM/DD/YYYY').format('ll')}</td>
                    </tr>
                  `
                )
                .join('')
            : `
                <tr>
                  <td colspan="6" style="text-align: center; padding: 16px;">
                    No data available
                  </td>
                </tr>`
        }
      </tbody>
    </table>
    <!-- AI Analysis Section -->
    <div class="blackBox">
      <div class="aiHeader">
        <h3 class="title">AI‑Generated Analysis</h3>
        ${
          startDate && endDate
            ? `<p>From: ${moment(startDate, 'MM/DD/YYYY').format(
                'll'
              )} - To: ${moment(endDate, 'MM/DD/YYYY').format('ll')}</p>`
            : ''
        }      
      </div>

      <div>${analysisHtml}</div>

      <div class="guidelinesContainer">
        <p>
          Blood Pressure Classification for Adult Filipinos:
        </p>
        <table>
          <thead>
            <tr>
              <th>Category</th>
              <th>Blood Pressure Range</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Normal BP</td>
              <td>< 120/80 mmHg</td>
            </tr>
            <tr>
              <td>Borderline BP</td>
              <td>120-139/80-89 mmHg</td>
            </tr>
            <tr>
              <td>Hypertension</td>
              <td>&ge; 140/90 mmHg</td>
            </tr>
          </tbody>
        </table>

        <a href="https://www.philippinesocietyofhypertension.org.ph/ClinicalPracticeGuidelines.pdf" target="_blank" style="color: #00a6f4; text-decoration: underline;">Philippine Society of Hypertension Guidelines</a>
      </div>
      
      <div class="disclaimer">
        <p>
          <strong>Disclaimer:</strong> This analysis is generated by AI and is for informational purposes only. Please consult a healthcare professional for medical advice.
        </p>
      </div>
    </div>

  </body>
</html>`

function usePatientPdfView() {
  const fetchPatientInfo = async ({
    patientId,
    startDate,
    endDate,
  }: reportType) => {
    const resPatientProfile = await getPatientProfile(patientId)
    const resBpList = await getBpList({ patientId, startDate, endDate })
    const resMedicationList = await getMedicationList({
      patientId,
      startDate,
      endDate,
    })

    return {
      patientProfile: resPatientProfile.patient,
      bpList: resBpList.bpList || [],
      medicationList: resMedicationList.medications || [],
    }
  }

  const generateAndOpenPdf = async ({
    patientId,
    startDate = null,
    endDate = null,
    returnHtml = false,
  }: reportType & {
    returnHtml?: boolean
  }) => {
    const data = await fetchPatientInfo({ patientId, startDate, endDate })

    if (!data?.patientProfile) {
      Alert.alert('Error', 'Patient profile is not available.')
      return
    }

    const { systolic, diastolic, pulseRate } = calculateBpAverage(data.bpList)

    const prompt = `
      Patient ID: ${patientId}
      Age: ${data.patientProfile.age}
      Gender: ${data.patientProfile.gender}
      Height: ${data.patientProfile.bmiHeightCm} cm
      Weight: ${data.patientProfile.bmiWeightKg} kg
      BP readings: ${data.bpList
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
        
      Make sure to mention the average blood pressure and pulse rate in the analysis.
      Provide a concise clinical interpretation and recommendations based on the data above.
      Never suggest any medications or treatments. Always recommend consulting a healthcare professional for medical advice.
    `

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

    const html = htmlTemplate({
      patientId,
      patientProfile: data.patientProfile,
      bpList: data.bpList,
      medicationList: data.medicationList,
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

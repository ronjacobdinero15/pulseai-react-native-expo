import * as FileSystem from 'expo-file-system'
import * as IntentLauncher from 'expo-intent-launcher'
import * as Print from 'expo-print'
import moment from 'moment'
import { Alert, Linking, Platform } from 'react-native'
import { BpType } from '../constants/bp'
import { Medication } from '../constants/medication'
import { PatientProfileType } from '../constants/signup'
import { getPatientProfile } from '../services/apiAuth'
import { getBpList } from '../services/apiBp'
import { getMedicationList } from '../services/apiMedication'

type htmlTemplateType = {
  patientId: string
  patientProfile: PatientProfileType
  bpList: BpType[]
  medicationList: Medication[]
}

const htmlTemplate = ({
  patientId,
  patientProfile,
  bpList,
  medicationList,
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

      .title {
        margin-bottom: 10px;
      }

      .box {
        background-color: #ddd;
        padding: 10px;
        border-radius: 5px;
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
        
        <div class="box">
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
                    const dates = medication.dates
                      ? JSON.parse(JSON.stringify(medication.dates))
                      : []
                    const actions = medication.actions
                      ? JSON.parse(JSON.stringify(medication.actions))
                      : []
                    // Create a row for each scheduled date (only for past dates)
                    const rows = dates
                      .filter((medDate: string) =>
                        moment(medDate, 'MM/DD/YYYY').isBefore(moment(), 'day')
                      )
                      .map((medDate: string) => {
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
  </body>
</html>`

function usePatientPdfView() {
  const fetchPatientInfo = async (patientId: string) => {
    const resBpList = await getBpList(patientId)
    const resPatientProfile = await getPatientProfile(patientId)
    const resMedicationList = await getMedicationList(patientId)

    return {
      patientProfile: resPatientProfile.patient,
      bpList: resBpList.bpList || [],
      medicationList: resMedicationList.medications || [],
    }
  }

  const generateAndOpenPdf = async ({ patientId }: { patientId: string }) => {
    await fetchPatientInfo(patientId)

    const data = await fetchPatientInfo(patientId)
    if (!data || !data.patientProfile) {
      Alert.alert('Error', 'Patient profile is not available.')
      return
    }

    try {
      // Generate the PDF from HTML
      const { uri } = await Print.printToFileAsync({
        html: htmlTemplate({
          patientId,
          patientProfile: data.patientProfile,
          bpList: data.bpList,
          medicationList: data.medicationList,
        }),
        base64: false,
      })

      // Create a new file path with the patient id as the name
      const newUri =
        FileSystem.documentDirectory +
        `PatientID_${patientId}_BP_Summary_Report.pdf`

      // Move/rename the file
      await FileSystem.moveAsync({
        from: uri,
        to: newUri,
      })

      // Then open the renamed file
      let uriToOpen = newUri
      if (Platform.OS === 'android') {
        uriToOpen = await FileSystem.getContentUriAsync(newUri)
        await IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
          data: uriToOpen,
          flags: 1, // FLAG_GRANT_READ_URI_PERMISSION
          type: 'application/pdf',
        })
      } else {
        await Linking.openURL(uriToOpen)
      }
    } catch (error) {
      console.error('Error generating or opening PDF:', error)
      Alert.alert('Error', 'Failed to generate or open the PDF')
    }
  }

  return generateAndOpenPdf
}

export default usePatientPdfView

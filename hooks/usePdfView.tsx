import * as FileSystem from 'expo-file-system'
import * as IntentLauncher from 'expo-intent-launcher'
import * as Print from 'expo-print'
import { Alert, Linking, Platform } from 'react-native'

function usePatientPdfView() {
  const htmlTemplate = (patientId: string) => `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Patient Report</title>
      </head>
      <body style="text-align: center;">
        <h1>Hello Patient ID ${patientId}!</h1>
        <p>This is your health summary report.</p>
      </body>
    </html>
  `

  const generateAndOpenPdf = async (patientId: string) => {
    try {
      // Generate the PDF from HTML
      const { uri } = await Print.printToFileAsync({
        html: htmlTemplate(patientId),
        base64: false,
      })

      // Check if the file exists
      const fileInfo = await FileSystem.getInfoAsync(uri)
      if (!fileInfo.exists) {
        Alert.alert('Error', 'PDF file does not exist.')
        return
      }

      let uriToOpen = uri
      if (Platform.OS === 'android') {
        // Convert file URI for Android
        uriToOpen = await FileSystem.getContentUriAsync(uri)

        // Open the PDF using the system's default PDF viewer
        await IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
          data: uriToOpen,
          flags: 1, // FLAG_GRANT_READ_URI_PERMISSION
          type: 'application/pdf',
        })
      } else {
        // For iOS, use Linking to open the PDF
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

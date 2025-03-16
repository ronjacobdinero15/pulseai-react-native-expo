import * as FileSystem from 'expo-file-system'
import * as IntentLauncher from 'expo-intent-launcher'
import * as Print from 'expo-print'
import React from 'react'
import {
  Alert,
  FlatList,
  Linking,
  Platform,
  StyleSheet,
  View,
} from 'react-native'
import { PatientType } from '../constants/account'
import { COLORS } from '../constants/Colors'
import MyText from './MyText'
import MyTouchableOpacity from './MyTouchableOpacity'
import Spinner from './Spinner'

type PatientListProps = {
  patients: PatientType[]
  isLoading: boolean
}

function PatientList({ patients, isLoading }: PatientListProps) {
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

  const handleGeneratePatientReport = async (patientId: string) => {
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
        IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
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

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <MyText style={{ fontWeight: 'bold' }}>Patient full name</MyText>
        <MyText style={{ fontWeight: 'bold', paddingRight: 20 }}>Report</MyText>
      </View>
      {isLoading ? (
        <Spinner />
      ) : (
        <FlatList
          data={patients}
          keyExtractor={item => item.patientId}
          style={styles.patientListContainer}
          renderItem={({ item, index }) => (
            <View
              style={[
                styles.patientContainer,
                { borderBottomWidth: patients.length - 1 === index ? 0 : 1 },
              ]}
            >
              <MyText>{item.fullName}</MyText>
              <MyTouchableOpacity
                style={styles.generateBtn}
                onPress={() => handleGeneratePatientReport(item.patientId)}
              >
                <MyText style={{ color: 'white' }}>View</MyText>
              </MyTouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    marginTop: 10,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.secondary[200],
  },
  patientListContainer: {
    flex: 1,
  },
  patientContainer: {
    flexDirection: 'row',
    gap: 10,
    borderBottomColor: COLORS.secondary[200],
    padding: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  generateBtn: {
    justifyContent: 'center',
    padding: 10,
    borderRadius: 12,
    backgroundColor: COLORS.primary[500],
    alignItems: 'center',
  },
})

export default PatientList

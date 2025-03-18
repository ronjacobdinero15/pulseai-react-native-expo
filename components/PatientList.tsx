import React from 'react'
import { FlatList, StyleSheet, View } from 'react-native'
import { PatientType } from '../constants/account'
import { COLORS } from '../constants/Colors'
import usePatientPdfView from '../hooks/usePdfView'
import MyText from './MyText'
import MyTouchableOpacity from './MyTouchableOpacity'
import Spinner from './Spinner'

type PatientListProps = {
  patients: PatientType[]
  isLoading: boolean
}

function PatientList({ patients, isLoading }: PatientListProps) {
  const generateAndOpenPdf = usePatientPdfView()

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <MyText style={{ fontWeight: 'bold' }}>Patient full name</MyText>
        <MyText style={{ fontWeight: 'bold' }}>View Report</MyText>
      </View>
      {isLoading ? (
        <Spinner />
      ) : patients.length === 0 ? (
        <MyText
          size="h2"
          style={{
            padding: 30,
            color: COLORS.secondary[500],
            textAlign: 'center',
          }}
        >
          No such patient found
        </MyText>
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
                onPress={() => generateAndOpenPdf(item.patientId)}
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

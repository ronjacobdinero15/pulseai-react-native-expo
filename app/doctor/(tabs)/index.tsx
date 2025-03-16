import AntDesign from '@expo/vector-icons/AntDesign'
import React, { useEffect, useState } from 'react'
import { FlatList, StyleSheet, View } from 'react-native'
import MyText from '../../../components/MyText'
import MyTextInput from '../../../components/MyTextInput'
import MyTouchableOpacity from '../../../components/MyTouchableOpacity'
import PatientList from '../../../components/PatientList'
import { PatientType } from '../../../constants/account'
import { COLORS } from '../../../constants/Colors'
import { getAllPatients } from '../../../services/apiMedication'

export default function HomeScreen() {
  const [patientNameSearchQuery, setPatientNameSearchQuery] = useState('')
  const [patients, setPatients] = useState<PatientType[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchAllPatient = async () => {
      if (!patientNameSearchQuery) {
        setIsLoading(true)
        const res = await getAllPatients()
        if (res.success) {
          setPatients(res.patients)
        }
        setIsLoading(false)
      }
    }
    fetchAllPatient()
  }, [patientNameSearchQuery])

  const handleSearchPatientNameSearchQuery = () => {
    const filteredPatients = patients.filter((patient: PatientType) =>
      patient.fullName
        .toLowerCase()
        .includes(patientNameSearchQuery.toLowerCase())
    )
    setPatients(filteredPatients)
  }

  return (
    <FlatList
      data={[]}
      renderItem={() => null}
      style={styles.mainContainer}
      ListHeaderComponent={
        <View style={styles.container}>
          <View>
            <MyText size="h4" style={{ color: COLORS.primary[500] }}>
              Search patient names
            </MyText>

            <View style={styles.headerContainer}>
              <View style={styles.searchInputContainer}>
                <MyTextInput
                  style={styles.searchInput}
                  placeholder="Search patient names"
                  value={patientNameSearchQuery}
                  onChangeText={(text: string) =>
                    setPatientNameSearchQuery(text)
                  }
                />
                {patientNameSearchQuery && (
                  <MyTouchableOpacity
                    onPress={() => setPatientNameSearchQuery('')}
                    style={styles.clearBtn}
                  >
                    <AntDesign name="close" size={20} color="black" />
                  </MyTouchableOpacity>
                )}
              </View>
              {/* NOTE: SEARCH */}
              <MyTouchableOpacity
                style={styles.searchBtn}
                onPress={handleSearchPatientNameSearchQuery}
              >
                <AntDesign name="search1" size={30} color="white" />
              </MyTouchableOpacity>
            </View>

            <PatientList patients={patients} isLoading={isLoading} />
          </View>

          <View style={styles.tableContainer}></View>
        </View>
      }
    />
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: 'white',
  },
  container: {
    flex: 1,
    height: '100%',
    backgroundColor: 'white',
    padding: 25,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    gap: 10,
  },
  searchInputContainer: {
    height: 50,
    flex: 1,
    position: 'relative',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: COLORS.secondary[200],
    padding: 10,
    borderRadius: 12,
    backgroundColor: 'white',
    flex: 1,
    paddingRight: 40,
  },
  searchBtn: {
    padding: 10,
    borderRadius: 12,
    backgroundColor: COLORS.primary[500],
  },
  tableContainer: {
    flex: 1,
    marginTop: 20,
  },
  clearBtn: {
    position: 'absolute',
    right: 10,
    top: 15,
    zIndex: 1,
  },
})

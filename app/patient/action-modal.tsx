import MedicationCardItem from '@/components/MedicationCardItem'
import MyText from '@/components/MyText'
import MyTouchableOpacity from '@/components/MyTouchableOpacity'
import { COLORS } from '@/constants/colors'
import { Medication } from '@/constants/medication'
import { useAuth } from '@/contexts/AuthContext'
import { addNewMedicationStatus } from '@/services/apiMedication'
import { formatDate } from '@/utils/helpers'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useLocalSearchParams, useRouter } from 'expo-router'
import moment from 'moment'
import React from 'react'
import { Alert, Image, StyleSheet, View } from 'react-native'

export default function MedicationActionModal() {
  const params = useLocalSearchParams()
  const router = useRouter()
  const { setRefresh } = useAuth()

  const medicine: Medication = {
    medicationId: params.medicationId as string,
    patientId: params.patientId as string,
    medicationName: params.medicationName as string,
    type: params.type as string,
    dosage: params.dosage as string,
    frequency: params.frequency as string,
    startDate: params.startDate as string,
    endDate: params.endDate as string,
    reminder: params.reminder as string,
    dates: JSON.parse(params.dates as string),
    actions: JSON.parse(params.actions as string),
    selectedDate: params.selectedDate as string,
  }

  // const actionExists = (medicine.actions ?? []).some(
  //   (action: { date: string; status: string; time: string }) => {
  //     console.log(action.date)
  //     console.log(params.selectedDate)
  //     return action.date === params.selectedDate
  //   }
  // )

  // console.log(actionExists)

  const handleAddNewMedicationStatus = async (status: string) => {
    const res = await addNewMedicationStatus({
      medicationId: medicine.medicationId,
      date: params.selectedDate as string,
      status,
      time: moment().format('LT'),
    })

    if (res.success) {
      Alert.alert('Success', res.message, [
        {
          text: 'OK',
          onPress: () => {
            router.back()
            setRefresh(1)
          },
        },
      ])
    } else {
      Alert.alert('Error', res.message, [
        {
          text: 'OK',
          onPress: () => {
            router.back()
            setRefresh(1)
          },
        },
      ])
    }
  }

  return (
    <View style={styles.container}>
      <Image
        source={require('@/assets/images/notification.gif')}
        style={styles.gif}
      />
      <MyText size="h4">{formatDate(medicine.startDate)}</MyText>
      <MyText size="h1" style={{ color: COLORS.primary[500] }}>
        {medicine.reminder}
      </MyText>
      <MyText size="h4" style={{ marginBottom: 10 }}>
        It's time to take
      </MyText>

      <MedicationCardItem
        medicine={medicine}
        selectedDate={medicine?.selectedDate!}
      />

      <View style={styles.btnContainer}>
        <MyTouchableOpacity
          style={styles.closeBtn}
          onPress={() => handleAddNewMedicationStatus('Missed')}
        >
          <Ionicons name="close-outline" size={30} color={COLORS.error} />
          <MyText size="h4" style={{ color: COLORS.error }}>
            Missed
          </MyText>
        </MyTouchableOpacity>
        <MyTouchableOpacity
          style={styles.successBtn}
          onPress={() => handleAddNewMedicationStatus('Taken')}
        >
          <Ionicons name="close-outline" size={30} color="white" />
          <MyText size="h4" style={{ color: 'white' }}>
            Taken
          </MyText>
        </MyTouchableOpacity>
      </View>

      <MyTouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Ionicons name="close-circle" size={50} color={COLORS.secondary[200]} />
      </MyTouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gif: {
    width: 80,
    height: 80,
  },
  btnContainer: {
    flexDirection: 'row',
    marginTop: 30,
    gap: 20,
  },
  closeBtn: {
    padding: 10,
    flexDirection: 'row',
    gap: 6,
    borderWidth: 1,
    alignItems: 'center',
    borderColor: COLORS.error,
  },
  successBtn: {
    padding: 10,
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
    backgroundColor: COLORS.success,
  },
  backBtn: {
    position: 'absolute',
    bottom: 25,
  },
})

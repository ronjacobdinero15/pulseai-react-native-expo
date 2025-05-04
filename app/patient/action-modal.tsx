import Ionicons from '@expo/vector-icons/Ionicons'
import { useLocalSearchParams, useRouter } from 'expo-router'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { Alert, Platform, StyleSheet, View } from 'react-native'
import MedicationCardItem from '../../components/MedicationCardItem'
import MyText from '../../components/MyText'
import MyTouchableOpacity from '../../components/MyTouchableOpacity'
import { COLORS } from '../../constants/Colors'
import { Medication } from '../../constants/medication'
import { useAuth } from '../../contexts/AuthContext'
import {
  addNewMedicationStatus,
  deleteMedicationById,
} from '../../services/apiMedication'
import { AntDesign } from '@expo/vector-icons'
import MyModal from '../../components/MyModal'

export default function MedicationActionModal() {
  const params = useLocalSearchParams()
  const router = useRouter()
  const { setRefresh } = useAuth()
  const [
    isMedicationDeletionModalVisible,
    setIsMedicationDeletionModalVisible,
  ] = useState(false)

  useEffect(() => {}, [params.selectedDate])

  const medicine: Medication = {
    medicationId: params.medicationId as string,
    patientId: params.patientId as string,
    medicationName: params.medicationName as string,
    type: params.type as string,
    dosage: params.dosage as string,
    frequency: params.frequency as string,
    startDate: params.startDate as string,
    endDate: moment(params.endDate, 'MM/DD/YYYY').format('LL') as string,
    reminder: params.reminder as string,
    dates: JSON.parse(params.dates as string),
    actions: JSON.parse(params.actions as string),
    selectedDate: moment(params.selectedDate, 'MM/DD/YYYY').format(
      'LL'
    ) as string,
  }

  const isToday = moment().format('MM/DD/YYYY') === params.selectedDate
  const isPastDate = moment(params.selectedDate, 'MM/DD/YYYY').isBefore(
    moment(),
    'day'
  )

  const actionExists = (medicine.actions ?? []).some(
    (action: { date: string; status: string; time: string }) => {
      return action.date === params.selectedDate
    }
  )

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

  const handleDeleteMedication = async (medicationId: string) => {
    const res = await deleteMedicationById({
      medicationId: medicine.medicationId,
      dateToday: moment().format('L'),
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
      <View style={styles.headerContainer}>
        <MyTouchableOpacity
          style={styles.backBtn}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.primary[500]} />
        </MyTouchableOpacity>

        <MyText size="h3" style={{ color: COLORS.primary[500] }}>
          Medication Status
        </MyText>
      </View>

      <MyText size="h4">{medicine.selectedDate}</MyText>
      <MyText size="h6" style={{ color: COLORS.secondary[500] }}>
        {medicine.selectedDate === medicine.endDate && isToday
          ? 'Until today'
          : `Until ${medicine.endDate}`}
      </MyText>
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

      {!actionExists && (isToday || isPastDate) && (
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
            <Ionicons name="checkmark-outline" size={30} color="white" />
            <MyText size="h4" style={{ color: 'white' }}>
              Taken
            </MyText>
          </MyTouchableOpacity>
        </View>
      )}

      <MyText
        size="h2"
        style={{
          padding: 30,
          color: COLORS.secondary[500],
          textAlign: 'center',
        }}
      >
        {!isToday && !isPastDate
          ? `Please wait until it's ${medicine.selectedDate}`
          : actionExists
          ? 'You have already updated this medication'
          : ''}
      </MyText>

      <MyModal
        visible={isMedicationDeletionModalVisible}
        title="Confirm medication deletion"
        onRequestClose={() => setIsMedicationDeletionModalVisible(false)}
        deletion={true}
      >
        <>
          <MyText size="h4" style={{ textAlign: 'center', marginBottom: 16 }}>
            Deleting this medication will remove all future entries, and you
            will no longer be able to view or update their status.
            <MyText size="h4" style={{ fontWeight: 'bold' }}>
              However, past entries can still be updated and will remain stored
              in the database.
            </MyText>
            Only entries starting from today that have not been updated yet will
            be deleted.
          </MyText>

          <MyTouchableOpacity
            style={[styles.modalBtn, { backgroundColor: COLORS.error }]}
            onPress={() => handleDeleteMedication(medicine.medicationId)}
          >
            <MyText size="h4" style={{ color: 'white' }}>
              Delete Medication
            </MyText>
          </MyTouchableOpacity>
        </>

        <MyTouchableOpacity
          style={styles.modalBtn}
          onPress={() => setIsMedicationDeletionModalVisible(false)}
        >
          <MyText size="h4" style={{ color: COLORS.primary[500] }}>
            Cancel
          </MyText>
        </MyTouchableOpacity>
      </MyModal>

      <MyTouchableOpacity
        style={styles.deleteBtn}
        onPress={() => setIsMedicationDeletionModalVisible(true)}
      >
        <AntDesign name="delete" size={35} color="white" />
        <MyText style={{ color: 'white', fontWeight: 'bold' }} size="h4">
          Delete Medication
        </MyText>
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
  headerContainer: {
    position: 'absolute',
    top: Platform.select({ ios: 50, android: 25 }),
    left: 25,
    zIndex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
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
    width: 130,
    justifyContent: 'center',
  },
  successBtn: {
    padding: 10,
    width: 130,
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
    backgroundColor: COLORS.success,
  },
  backBtn: {
    justifyContent: 'center',
  },
  deleteBtn: {
    position: 'absolute',
    bottom: 25,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 10,
    backgroundColor: COLORS.error,
  },
  modalBtn: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 8,
  },
})

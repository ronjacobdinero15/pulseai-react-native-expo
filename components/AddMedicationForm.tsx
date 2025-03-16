
import { Ionicons } from '@expo/vector-icons'
import RNDateTimePicker from '@react-native-community/datetimepicker'
import { useRouter } from 'expo-router'
import moment from 'moment'
import React, { useState } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  View,
} from 'react-native'
import { COLORS } from '../constants/Colors'
import { FREQUENCY, Medication, MEDICINES } from '../constants/medication'
import { useAuth } from '../contexts/AuthContext'
import { addNewMedication } from '../services/apiMedication'
import {
  formatDate,
  formatDateForText,
  formatTime,
  generateUniqueId,
  getDatesRange,
} from '../utils/helpers'
import DropdownComponent from './Dropdown'
import MyText from './MyText'
import MyTextInput from './MyTextInput'
import MyTouchableOpacity from './MyTouchableOpacity'

function AddMedicationForm() {
  const [showStartDate, setShowStartDate] = useState(false)
  const [showEndDate, setShowEndDate] = useState(false)
  const [showTimePicker, setShowTimePicker] = useState(false)

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Medication>({
    defaultValues: {
      medicationName: 'Shabu',
      type: 'tablet',
      dosage: '50ml',
      frequency: '',
      startDate: '',
      endDate: '',
    },
  })
  const {
    currentUser,
    isLoading: isAddingNewMedication,
    setIsLoading: setIsAddingNewMedication,
    setRefresh,
  } = useAuth()
  const router = useRouter()

  const startDate = useWatch({ control, name: 'startDate' })
  const endDate = useWatch({ control, name: 'endDate' })

  const onSubmit = async (data: Medication) => {
    if (!currentUser?.id) return

    setIsAddingNewMedication(false)
    const res = await addNewMedication({
      ...data,
      patientId: currentUser?.id,
      medicationId: generateUniqueId(),
      dates: getDatesRange(data?.startDate, data?.endDate),
      reminder: formatTime(data.reminder),
      actions: [],
    })

    if (res.success) {
      Alert.alert('Success', res.message, [
        {
          text: 'GREAT',
          onPress: () => {
            router.back()
            setRefresh(1)
          },
        },
      ])
    } else {
      Alert.alert('Error', res.message)
    }
    setIsAddingNewMedication(false)
  }

  return (
    <View style={styles.container}>
      <MyText size="h2" style={{}}>
        Add New Medication
      </MyText>

      {/* NOTE: MEDICINE NAME */}
      <View style={styles.inputContainer}>
        <View style={styles.inputControl}>
          <Ionicons name="medkit-outline" size={24} style={styles.icon} />
          <Controller
            control={control}
            name="medicationName"
            rules={{ required: 'Medicine name is required.' }}
            render={({ field: { onChange, onBlur, value } }) => (
              <MyTextInput
                style={styles.input}
                placeholder="Medicine name"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
          />
        </View>

        {errors.medicationName && (
          <MyText style={styles.errorLabel}>
            {errors.medicationName.message}
          </MyText>
        )}
      </View>

      {/* NOTE: MEDICINE TYPE */}
      <View>
        <Controller
          control={control}
          name="type"
          rules={{ required: 'Medicine type is required.' }}
          render={({ field: { onChange, value } }) => (
            <>
              <FlatList
                data={MEDICINES}
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{ maxHeight: 70 }}
                renderItem={({ item }) => (
                  <MyTouchableOpacity
                    style={[
                      styles.inputControl,
                      { height: 50 },
                      item.name === value
                        ? { backgroundColor: COLORS.primary[500] }
                        : { backgroundColor: 'white' },
                    ]}
                    onPress={() => onChange(item.name)}
                  >
                    <MyText
                      style={{
                        color:
                          item.name === value ? 'white' : COLORS.primary[900],
                      }}
                    >
                      {item.name}
                    </MyText>
                  </MyTouchableOpacity>
                )}
                keyExtractor={item => item.name}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
              />
              {errors.type && (
                <MyText style={styles.errorLabel}>{errors.type.message}</MyText>
              )}
            </>
          )}
        />
      </View>

      {/* NOTE: DOSAGE */}
      <View style={styles.inputContainer}>
        <View style={styles.inputControl}>
          <Ionicons name="eyedrop-outline" size={24} style={styles.icon} />
          <Controller
            control={control}
            name="dosage"
            rules={{ required: 'Dosage is required.' }}
            render={({ field: { onChange, onBlur, value } }) => (
              <MyTextInput
                style={styles.input}
                placeholder="Ex. 2, 15ml etc"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
          />
        </View>
        {errors.dosage && (
          <MyText style={styles.errorLabel}>{errors.dosage.message}</MyText>
        )}
      </View>

      {/* NOTE: FREQUENCY */}
      <View style={styles.inputContainer}>
        <View style={styles.inputControl}>
          <Ionicons
            name="time-outline"
            size={24}
            style={[styles.icon, { marginRight: 12 }]}
          />
          <Controller
            control={control}
            name="frequency"
            rules={{ required: 'Frequency is required.' }}
            render={({ field: { onChange, onBlur, value } }) => (
              <DropdownComponent
                label="Frequency"
                data={FREQUENCY}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                style={{ borderWidth: 0 }}
              />
            )}
          />
        </View>
        {errors.frequency && (
          <MyText style={styles.errorLabel}>{errors.frequency.message}</MyText>
        )}
      </View>

      {/* NOTE: START AND END DATE */}
      <View style={styles.dateGroup}>
        <View style={{ flex: 1 }}>
          <Controller
            control={control}
            name="startDate"
            rules={{
              required: 'Required.',
              validate: value =>
                moment(value, 'MM/DD/YYYY').isBefore(
                  moment(endDate, 'MM/DD/YYYY')
                ) || 'Start date must be before end date.',
            }}
            render={({ field: { onChange, value } }) => (
              <>
                <MyTouchableOpacity
                  style={styles.inputControl}
                  onPress={() => setShowStartDate(true)}
                >
                  <Ionicons
                    name="calendar-outline"
                    size={24}
                    style={[styles.icon, { borderRightWidth: 0 }]}
                  />
                  {value ? (
                    <MyText size="h6">{formatDateForText(value)}</MyText>
                  ) : (
                    <MyText>Start Date</MyText>
                  )}
                </MyTouchableOpacity>
                {showStartDate && (
                  <RNDateTimePicker
                    minimumDate={new Date(2020, 0, 1)}
                    onChange={(event, selectedDate) => {
                      const currentDate = formatDate(
                        event.nativeEvent.timestamp
                      )
                      onChange(currentDate)
                      setShowStartDate(false)
                    }}
                    value={new Date()}
                  />
                )}
              </>
            )}
          />
          {errors.startDate && (
            <MyText style={styles.errorLabel} size="h6">
              {errors.startDate.message}
            </MyText>
          )}
        </View>

        <View style={{ flex: 1 }}>
          <Controller
            control={control}
            name="endDate"
            rules={{
              required: 'Required.',
              validate: value =>
                moment(value, 'MM/DD/YYYY').isAfter(
                  moment(startDate, 'MM/DD/YYYY')
                ) || 'End date must be after start date.',
            }}
            render={({ field: { onChange, value } }) => (
              <>
                <MyTouchableOpacity
                  style={[styles.inputControl, { flex: 1 }]}
                  onPress={() => setShowEndDate(true)}
                >
                  <Ionicons
                    name="calendar-outline"
                    size={24}
                    style={[styles.icon, { borderRightWidth: 0 }]}
                  />
                  {value ? (
                    <MyText size="h6">{formatDateForText(value)}</MyText>
                  ) : (
                    <MyText>End Date</MyText>
                  )}
                </MyTouchableOpacity>
                {showEndDate && (
                  <RNDateTimePicker
                    minimumDate={new Date(2020, 0, 1)}
                    onChange={(event, selectedDate) => {
                      const currentDate = formatDate(
                        event.nativeEvent.timestamp
                      )
                      onChange(currentDate)
                      setShowEndDate(false)
                    }}
                    value={new Date()}
                  />
                )}
              </>
            )}
          />
          {errors.endDate && (
            <MyText style={styles.errorLabel} size="h6">
              {errors.endDate.message}
            </MyText>
          )}
        </View>
      </View>

      {/* NOTE: REMINDER */}
      <View>
        <Controller
          control={control}
          name="reminder"
          rules={{ required: 'Reminder time is required.' }}
          render={({ field: { onChange, value } }) => (
            <>
              <MyTouchableOpacity
                style={[styles.inputControl, { flex: 1 }]}
                onPress={() => setShowTimePicker(true)}
              >
                <Ionicons name="timer-outline" size={24} style={styles.icon} />
                <MyText style={{ marginLeft: 10 }}>
                  {value ? formatTime(value) : 'Select Reminder Time'}
                </MyText>
              </MyTouchableOpacity>
              {showTimePicker && (
                <RNDateTimePicker
                  mode="time"
                  onChange={(event, selectedDate) => {
                    const timestamp = event.nativeEvent.timestamp
                    onChange(timestamp)
                    setShowTimePicker(false)
                  }}
                  value={value ? new Date(value) : new Date()}
                />
              )}
            </>
          )}
        />
        {errors.reminder && (
          <MyText style={styles.errorLabel}>{errors.reminder.message}</MyText>
        )}
      </View>

      <MyTouchableOpacity
        style={styles.submitButton}
        onPress={handleSubmit(onSubmit)}
      >
        {isAddingNewMedication ? (
          <ActivityIndicator size="large" color="white" />
        ) : (
          <MyText style={styles.submitButtonText}>Add New Medication</MyText>
        )}
      </MyTouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
  },
  inputContainer: {},
  inputControl: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.secondary[200],
    marginTop: 7,
    height: 60,
    overflow: 'hidden',
  },
  input: {
    color: COLORS.secondary[400],
    marginLeft: 10,
    marginRight: 10,
    backgroundColor: 'white',
    borderWidth: 0,
  },
  icon: {
    color: COLORS.primary[500],
    borderRightWidth: 1,
    paddingRight: 12,
    borderColor: COLORS.secondary[200],
  },
  errorLabel: {
    color: COLORS.error,
  },
  submitButton: {
    marginTop: 25,
    backgroundColor: COLORS.primary[500],
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
  },
  separator: {
    width: 10,
  },
  dateGroup: {
    flexDirection: 'row',
    gap: 5,
  },
})

export default AddMedicationForm

import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Platform,
  StyleSheet,
  View,
} from 'react-native'
import MyModal from '../../components/MyModal'
import MyText from '../../components/MyText'
import MyTextInput from '../../components/MyTextInput'
import MyTouchableOpacity from '../../components/MyTouchableOpacity'
import { BpType } from '../../constants/bp'
import { COLORS } from '../../constants/Colors'
import { useAuth } from '../../contexts/AuthContext'
import { addNewBp } from '../../services/apiBp'
import { validateBpInput } from '../../utils/helpers'

export default function AddNewBp() {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BpType>()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [currentDate, setCurrentDate] = useState(moment().format('ll'))
  const [currentTime, setCurrentTime] = useState(moment().format('LT'))
  const [showConfirmationModal, setShowConfirmationModal] = useState(false)
  const { currentUser, setRefresh } = useAuth()

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDate(moment().format('ll'))
      setCurrentTime(moment().format('LT'))
    }, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [])

  const handleAddNewBp = async ({
    systolic,
    diastolic,
    pulseRate,
    comments,
  }: BpType) => {
    if (!showConfirmationModal) return setShowConfirmationModal(true)

    setIsLoading(true)
    const res = await addNewBp({
      patientId: currentUser?.id!,
      dateTaken: currentDate,
      timeTaken: currentTime,
      systolic,
      diastolic,
      pulseRate,
      comments: comments || '',
    })
    setIsLoading(false)

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
      Alert.alert('Error', res.message)
    }
  }

  return (
    <FlatList
      data={[]}
      renderItem={() => null}
      style={styles.mainContainer}
      keyboardShouldPersistTaps="handled"
      ListHeaderComponent={
        <View style={styles.container}>
          <MyModal
            visible={showConfirmationModal}
            title="Notice"
            onRequestClose={() => setShowConfirmationModal(false)}
          >
            <MyText size="h4" style={{ textAlign: 'center' }}>
              Are you sure you want to submit your BP?
            </MyText>

            <MyTouchableOpacity
              style={[
                styles.modalBtn,
                { backgroundColor: COLORS.primary[500] },
              ]}
              disabled={!showConfirmationModal}
              onPress={handleSubmit(handleAddNewBp)}
            >
              {isLoading ? (
                <ActivityIndicator size="large" color="white" />
              ) : (
                <MyText
                  size="h4"
                  style={{
                    color: showConfirmationModal
                      ? 'white'
                      : COLORS.primary[900],
                  }}
                >
                  Submit your BP
                </MyText>
              )}
            </MyTouchableOpacity>

            <MyTouchableOpacity
              style={[styles.modalBtn]}
              onPress={() => setShowConfirmationModal(false)}
              disabled={isLoading}
            >
              <Ionicons
                name="close"
                size={24}
                color={COLORS.primary[500]}
                style={{ marginTop: 2 }}
              />
              <MyText size="h4" style={{ color: COLORS.primary[500] }}>
                Cancel
              </MyText>
            </MyTouchableOpacity>
          </MyModal>

          <View style={styles.headerContainer}>
            <MyTouchableOpacity
              style={styles.backBtn}
              onPress={() => router.replace('/patient/(tabs)')}
            >
              <Ionicons
                name="arrow-back"
                size={24}
                color={COLORS.primary[500]}
              />
            </MyTouchableOpacity>

            <MyText size="h3" style={{ color: COLORS.primary[500] }}>
              Add New BP Record
            </MyText>
          </View>

          <View style={styles.body}>
            {/* Column for Labels */}
            <View style={styles.labelContainer}>
              <MyText style={styles.inputLabel}>Date today:</MyText>
              <MyText style={styles.inputLabel}>Time taken:</MyText>
              <MyText style={styles.inputLabel}>Systolic:</MyText>
              <MyText style={styles.inputLabel}>Diastolic:</MyText>
              <MyText style={styles.inputLabel}>Pulse Rate:</MyText>
            </View>

            <View style={styles.inputColumn}>
              <MyTextInput
                value={currentDate}
                style={styles.disabledInput}
                editable={false}
              />
              <MyTextInput
                value={currentTime}
                style={styles.disabledInput}
                editable={false}
              />
              {/* SYSTOLIC */}
              {/* TODO: FIX */}
              <View>
                <View style={styles.inputContainer}>
                  <Controller
                    control={control}
                    rules={{
                      required: 'Required.',
                      maxLength: {
                        value: 4,
                        message: 'Invalid input.',
                      },
                      minLength: {
                        value: 2,
                        message: 'Invalid input.',
                      },
                      validate: validateBpInput,
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <MyTextInput
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        maxLength={4}
                        keyboardType="numeric"
                        style={styles.input}
                      />
                    )}
                    name="systolic"
                  />

                  <MyText>mmHg</MyText>
                </View>
                {errors.systolic && (
                  <MyText style={[styles.errorLabel, { width: '100%' }]}>
                    {errors.systolic.message}
                  </MyText>
                )}
              </View>

              {/* DIASTOLIC */}
              <View>
                <View style={styles.inputContainer}>
                  <Controller
                    control={control}
                    rules={{
                      required: 'Required.',
                      maxLength: {
                        value: 4,
                        message: 'Invalid input.',
                      },
                      minLength: {
                        value: 2,
                        message: 'Invalid input.',
                      },
                      validate: validateBpInput,
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <MyTextInput
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        maxLength={4}
                        keyboardType="numeric"
                        style={styles.input}
                      />
                    )}
                    name="diastolic"
                  />
                  <MyText>mmHg</MyText>
                </View>
                {errors.diastolic && (
                  <MyText style={styles.errorLabel}>
                    {errors.diastolic.message}
                  </MyText>
                )}
              </View>

              {/* PULSE RATE */}
              <View>
                <View style={styles.inputContainer}>
                  <Controller
                    control={control}
                    rules={{
                      required: 'Required.',
                      maxLength: {
                        value: 3,
                        message: 'Invalid input.',
                      },
                      minLength: {
                        value: 2,
                        message: 'Invalid input.',
                      },
                      validate: validateBpInput,
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <MyTextInput
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        maxLength={3}
                        keyboardType="numeric"
                        style={styles.input}
                      />
                    )}
                    name="pulseRate"
                  />
                  <MyText style={{ textAlign: 'left' }}>/min</MyText>
                </View>
                {errors.pulseRate && (
                  <MyText style={styles.errorLabel}>
                    {errors.pulseRate.message}
                  </MyText>
                )}
              </View>
            </View>
          </View>

          <View style={{ marginBottom: 15, gap: 5 }}>
            <View style={{ marginBottom: 5 }}>
              <MyText>Do you have any comments :</MyText>
              <MyText size="h6" style={{ color: COLORS.secondary[500] }}>
                (e.g. medication changes, feeling unwell)
              </MyText>
            </View>

            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <MyTextInput
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  style={styles.multilineInput}
                  numberOfLines={6}
                  multiline
                />
              )}
              name="comments"
            />
            {errors.comments && (
              <MyText style={styles.errorLabel}>
                {errors.comments.message}
              </MyText>
            )}
          </View>

          <MyTouchableOpacity
            style={[styles.btn]}
            onPress={handleSubmit(handleAddNewBp)}
            disabled={isLoading}
          >
            <MyText
              size="h4"
              style={{
                color: 'white',
              }}
            >
              Add New BP Record
            </MyText>
          </MyTouchableOpacity>
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
    backgroundColor: 'white',
    padding: 25,
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
  backBtn: {
    justifyContent: 'center',
  },
  body: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 60,
    gap: 10,
  },
  labelContainer: {
    flex: 1,
    flexDirection: 'column',
    gap: 5,
    marginTop: 10,
  },
  inputColumn: {
    flex: 1,
    flexDirection: 'column',
    gap: 10,
  },
  inputLabel: {
    height: 50,
    marginBottom: 5,
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  input: {
    width: '50%',
    textAlign: 'center',
    borderWidth: 1,
    borderColor: COLORS.secondary[200],
    borderRadius: 8,
    padding: 10,
  },
  multilineInput: {
    height: 160,
    textAlignVertical: 'top',
  },
  disabledInput: {
    backgroundColor: COLORS.secondary[100],
    borderWidth: 0,
    borderRadius: 8,
    padding: 10,
    height: 50,
    color: COLORS.secondary[500],
  },
  errorLabel: {
    color: COLORS.error,
  },
  btn: {
    borderRadius: 8,
    borderWidth: 2,
    borderColor: COLORS.primary[500],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 20,
    backgroundColor: COLORS.primary[500],
  },
  modalBtn: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.primary[500],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 20,
    gap: 5,
  },
})

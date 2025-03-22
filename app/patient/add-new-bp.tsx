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

    console.log('res', res)

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
            <View style={styles.inputControl}>
              <MyText style={styles.inputLabel}>Date today:</MyText>

              <MyTextInput
                value={currentDate}
                style={styles.disabledInput}
                editable={false}
              />
            </View>

            <View style={styles.inputControl}>
              <MyText style={styles.inputLabel}>Time taken:</MyText>

              <MyTextInput
                value={currentTime}
                style={styles.disabledInput}
                editable={false}
              />
            </View>

            <View style={styles.inputContainer}>
              <View style={styles.inputControl}>
                <MyText style={styles.inputLabel}>Systolic:</MyText>

                <View style={styles.dataContainer}>
                  <Controller
                    control={control}
                    rules={{
                      required: 'This field is required.',
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
              </View>

              <View style={styles.errorContainer}>
                <View style={{ width: '40%' }} />

                <View style={{ flex: 1 }}>
                  {errors.systolic && (
                    <MyText style={styles.errorLabel}>
                      {errors.systolic.message}
                    </MyText>
                  )}
                </View>
              </View>
            </View>

            <View style={styles.inputContainer}>
              <View style={styles.inputControl}>
                <MyText style={styles.inputLabel}>Diastolic:</MyText>

                <View style={styles.dataContainer}>
                  <Controller
                    control={control}
                    rules={{
                      required: 'This field is required.',
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
              </View>

              <View style={styles.errorContainer}>
                <View style={{ width: '40%' }} />
                <View>
                  {errors.diastolic && (
                    <MyText style={styles.errorLabel}>
                      {errors.diastolic.message}
                    </MyText>
                  )}
                </View>
              </View>
            </View>

            <View style={styles.inputContainer}>
              <View style={styles.inputControl}>
                <MyText style={styles.inputLabel}>Pulse Rate:</MyText>

                <View style={styles.dataContainer}>
                  <Controller
                    control={control}
                    rules={{
                      required: 'This field is required.',
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
                        maxLength={2}
                        keyboardType="numeric"
                        style={styles.input}
                      />
                    )}
                    name="pulseRate"
                  />
                  <MyText>/min</MyText>
                </View>
              </View>

              <View style={styles.errorContainer}>
                <View style={{ width: '40%' }} />

                <View style={{ flex: 1 }}>
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
    marginTop: 60,
    gap: 10,
  },
  inputContainer: {
    gap: 5,
  },
  inputControl: {
    gap: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputLabel: {
    marginBottom: 5,
    width: '40%',
  },
  input: {
    width: '25%',
    textAlign: 'center',
  },
  multilineInput: {
    height: 160,
    textAlignVertical: 'top',
  },
  disabledInput: {
    flex: 1,
    backgroundColor: COLORS.secondary[100],
    borderWidth: 0,
  },
  dataContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    width: '100%',
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
  errorContainer: {
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
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

import DateOfBirth from '../../components/DateOfBirth'
import DropdownComponent from '../../components/Dropdown'
import MultipleSelectListCheckbox from '../../components/MultipleSelectListCheckbox'
import MyText from '../../components/MyText'
import MyTextInput from '../../components/MyTextInput'
import MyTouchableOpacity from '../../components/MyTouchableOpacity'
import RadioButton from '../../components/RadioButton'
import { COLORS } from '../../constants/Colors'
import {
  COMORBIDITIESOPTIONS,
  GENDEROPTIONS,
  LIFESTYLEOPTIONS,
  SignUpType,
  VICESOPTIONS,
} from '../../constants/signup'
import { useAuth } from '../../contexts/AuthContext'
import { getPatientProfile, updatePatientProfile } from '../../services/apiAuth'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import * as SecureStore from 'expo-secure-store'
import React, { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Platform,
  StyleSheet,
  View,
} from 'react-native'

export default function UpdateProfile() {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SignUpType>({
    defaultValues: {
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      email: '',
      age: '',
      gender: '',
      vices: [],
      bmiHeightCm: '',
      bmiWeightKg: '',
      comorbidities: [],
      parentalHypertension: '',
      lifestyle: '',
    },
  })
  const router = useRouter()
  const { isLoading, setIsLoading, currentUser, setCurrentUser } = useAuth()

  useEffect(() => {
    const fetchUserProfile = async () => {
      const res = await getPatientProfile(currentUser?.id!)

      if (res.success) {
        reset(res.patient)
      }
    }
    fetchUserProfile()
  }, [])

  const handleUpdateProfile = async (data: SignUpType) => {
    setIsLoading(true)
    try {
      const res = await updatePatientProfile({
        ...data,
        patientId: currentUser?.id!,
      })

      if (res.success) {
        const updatedUser = {
          id: currentUser?.id!,
          email: data.email.trim(),
          role: 'patient',
          firstName: data.firstName.trim(),
        }

        setCurrentUser(updatedUser)
        await SecureStore.setItemAsync(
          'currentUser',
          JSON.stringify(updatedUser)
        )

        Alert.alert('Success', res.message, [
          {
            text: 'Great',
            onPress: () => router.back(),
          },
        ])
      } else {
        Alert.alert('Error', res.message, [
          {
            text: 'Try again',
          },
        ])
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while updating the profile', [
        {
          text: 'Try again',
        },
      ])
    } finally {
      setIsLoading(false)
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
          <View style={styles.headerContainer}>
            <MyTouchableOpacity
              style={styles.backBtn}
              onPress={() => router.replace('/patient/(tabs)/profile')}
            >
              <Ionicons
                name="arrow-back"
                size={24}
                color={COLORS.primary[500]}
              />
            </MyTouchableOpacity>

            <MyText size="h3" style={{ color: COLORS.primary[500] }}>
              Update Your Profile
            </MyText>
          </View>

          <View style={styles.body}>
            <View style={styles.inputControl}>
              <MyText style={styles.inputLabel}>First name:</MyText>

              <Controller
                control={control}
                rules={{
                  required: 'This field is required.',
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <MyTextInput
                    placeholder="First Name"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    autoCorrect={false}
                  />
                )}
                name="firstName"
              />
              {errors.firstName && (
                <MyText style={styles.errorLabel}>
                  {errors.firstName.message}
                </MyText>
              )}
            </View>

            <View style={styles.inputControl}>
              <MyText style={styles.inputLabel}>Last name:</MyText>

              <Controller
                control={control}
                rules={{
                  required: 'This field is required.',
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <MyTextInput
                    placeholder="Last Name"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    autoCorrect={false}
                  />
                )}
                name="lastName"
              />
              {errors.lastName && (
                <MyText style={styles.errorLabel}>
                  {errors.lastName.message}
                </MyText>
              )}
            </View>

            <View style={styles.inputControl}>
              <MyText style={styles.inputLabel}>Date of birth:</MyText>

              <Controller
                control={control}
                rules={{
                  required: 'This field is required',
                }}
                render={({ field: { onChange, value } }) => (
                  <DateOfBirth value={value} onChange={onChange} />
                )}
                name="dateOfBirth"
              />
              {errors.dateOfBirth && (
                <MyText style={styles.errorLabel}>
                  {errors.dateOfBirth.message}
                </MyText>
              )}
            </View>

            <View style={styles.inputControl}>
              <MyText style={styles.inputLabel}>Email:</MyText>

              <Controller
                control={control}
                rules={{
                  required: 'This field is required.',
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                    message: 'Invalid email address.',
                  },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <MyTextInput
                    placeholder="Email"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    autoCorrect={false}
                    autoCapitalize="none"
                    keyboardType="email-address"
                  />
                )}
                name="email"
              />
              {errors.email && (
                <MyText style={styles.errorLabel}>
                  {errors.email.message}
                </MyText>
              )}
            </View>

            <View style={styles.healthInfo}>
              <View style={styles.divider} />

              <MyText
                size="h6"
                style={{
                  flex: 2,
                  textAlign: 'center',
                  color: COLORS.secondary[400],
                }}
              >
                Health information
              </MyText>

              <View style={styles.divider} />
            </View>

            <View style={styles.shortContainer}>
              <View style={{ flex: 1 }}>
                <MyText style={styles.inputLabel}>Age:</MyText>

                <Controller
                  control={control}
                  rules={{
                    required: 'Required.',
                    maxLength: {
                      value: 3,
                      message: 'Invalid age.',
                    },
                    validate: value =>
                      parseInt(value) >= 18 ||
                      'You must be at least 18 years old.',
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <MyTextInput
                      placeholder="Age"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      maxLength={3}
                      keyboardType="numeric"
                    />
                  )}
                  name="age"
                />
                {errors.age && (
                  <MyText style={styles.errorLabel}>
                    {errors.age.message}
                  </MyText>
                )}
              </View>

              <View style={{ flex: 2 }}>
                <MyText style={styles.inputLabel}>Gender:</MyText>
                <Controller
                  control={control}
                  rules={{ required: 'Required.' }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <DropdownComponent
                      data={GENDEROPTIONS}
                      value={value}
                      onChange={onChange}
                      onBlur={onBlur}
                    />
                  )}
                  name="gender"
                />
                {errors.gender && (
                  <MyText style={styles.errorLabel}>
                    {errors.gender.message}
                  </MyText>
                )}
              </View>
            </View>

            <View style={styles.inputControl}>
              <MyText style={styles.inputLabel}>BMI (height in cm):</MyText>
              <Controller
                control={control}
                rules={{
                  required: 'This field is required.',
                  minLength: {
                    value: 2,
                    message: 'Invalid BMI.',
                  },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <MyTextInput
                    placeholder="BMI (height in cm)"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    keyboardType="numeric"
                    maxLength={3}
                  />
                )}
                name="bmiHeightCm"
              />
              {errors.bmiHeightCm && (
                <MyText style={styles.errorLabel}>
                  {errors.bmiHeightCm.message}
                </MyText>
              )}
            </View>

            <View style={styles.inputControl}>
              <MyText style={styles.inputLabel}>BMI (weight in kg):</MyText>

              <Controller
                control={control}
                rules={{
                  required: 'This field is required.',
                  minLength: {
                    value: 2,
                    message: 'Invalid BMI.',
                  },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <MyTextInput
                    placeholder="BMI (weight in kg)"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    keyboardType="numeric"
                    maxLength={4}
                  />
                )}
                name="bmiWeightKg"
              />
              {errors.bmiWeightKg && (
                <MyText style={styles.errorLabel}>
                  {errors.bmiWeightKg.message}
                </MyText>
              )}
            </View>

            <View style={styles.inputControl}>
              <MyText style={styles.inputLabel}>Vices:</MyText>
              <Controller
                control={control}
                rules={{ required: 'This field is required.' }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <MultipleSelectListCheckbox
                    label="Vices"
                    data={VICESOPTIONS}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                  />
                )}
                name="vices"
              />
              {errors.vices && (
                <MyText style={styles.errorLabel}>
                  {errors.vices.message}
                </MyText>
              )}
            </View>

            <View style={styles.inputControl}>
              <MyText style={styles.inputLabel}>Comorbidities:</MyText>

              <Controller
                control={control}
                rules={{ required: 'This field is required.' }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <MultipleSelectListCheckbox
                    label="Comorbidities"
                    data={COMORBIDITIESOPTIONS}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                  />
                )}
                name="comorbidities"
              />
              {errors.comorbidities && (
                <MyText style={styles.errorLabel}>
                  {errors.comorbidities.message}
                </MyText>
              )}
            </View>

            <View style={styles.inputControl}>
              <MyText>Parental history of hypertension?</MyText>

              <Controller
                control={control}
                rules={{ required: 'This field is required.' }}
                render={({ field: { onChange, value } }) => (
                  <RadioButton
                    selected={value}
                    options={['Yes', 'No', 'Not sure']}
                    handleRadioPress={onChange}
                  />
                )}
                name="parentalHypertension"
              />
              {errors.parentalHypertension && (
                <MyText style={styles.errorLabel}>
                  {errors.parentalHypertension.message}
                </MyText>
              )}
            </View>

            <View style={styles.inputControl}>
              <MyText style={styles.inputLabel}>Lifestyle:</MyText>

              <Controller
                control={control}
                rules={{ required: 'This field is required.' }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <DropdownComponent
                    data={LIFESTYLEOPTIONS}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                  />
                )}
                name="lifestyle"
              />
              {errors.lifestyle && (
                <MyText style={styles.errorLabel}>
                  {errors.lifestyle.message}
                </MyText>
              )}
            </View>

            <MyTouchableOpacity
              style={[styles.btn]}
              onPress={handleSubmit(handleUpdateProfile)}
            >
              {isLoading ? (
                <ActivityIndicator size="large" color="white" />
              ) : (
                <MyText
                  size="h4"
                  style={{
                    color: 'white',
                  }}
                >
                  Update my profile
                </MyText>
              )}
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
    position: 'relative',
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
  },
  inputControl: {
    marginBottom: 10,
  },
  inputLabel: {
    fontSize: 15,
    marginBottom: 5,
  },
  errorLabel: {
    color: COLORS.error,
  },
  healthInfo: {
    height: 30,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.secondary[200],
    borderRadius: 50,
    flex: 1,
  },
  shortContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
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
})

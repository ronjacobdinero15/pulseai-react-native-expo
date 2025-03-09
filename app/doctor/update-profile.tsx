import MyText from '@/components/MyText'
import MyTextInput from '@/components/MyTextInput'
import MyTouchableOpacity from '@/components/MyTouchableOpacity'
import { COLORS } from '@/constants/colors'
import { SignUpType } from '@/constants/signup'
import { useAuth } from '@/contexts/AuthContext'
import {
  getDoctorProfile,
  updateDoctorProfile,
  updatePatientProfile,
} from '@/services/apiAuth'
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
      fullName: '',
      email: '',
    },
  })
  const router = useRouter()
  const { isLoading, setIsLoading, currentUser, setCurrentUser } = useAuth()

  useEffect(() => {
    const fetchUserProfile = async () => {
      const res = await getDoctorProfile({ doctorId: currentUser?.id! })

      if (res.success) {
        reset(res.doctor)
      }
    }
    fetchUserProfile()
  }, [])

  const handleUpdateProfile = async (data: SignUpType) => {
    setIsLoading(true)
    try {
      const res = await updateDoctorProfile({
        ...data,
        doctorId: currentUser?.id!,
      })

      if (res.success) {
        const updatedUser = {
          id: currentUser?.id!,
          email: data.email.trim(),
          role: 'doctor',
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
              onPress={() => router.replace('/doctor/(tabs)/profile')}
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
    marginBottom: 15,
    gap: 5,
  },
  inputLabel: {
    fontSize: 15,
    marginBottom: 5,
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
})

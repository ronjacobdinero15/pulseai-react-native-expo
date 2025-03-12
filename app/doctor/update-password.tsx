import { Ionicons } from '@expo/vector-icons'
import { Link, useRouter } from 'expo-router'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Alert, Platform, StyleSheet, View } from 'react-native'
import MyText from '../../components/MyText'
import MyTextInput from '../../components/MyTextInput'
import MyTouchableOpacity from '../../components/MyTouchableOpacity'
import { COLORS } from '../../constants/Colors'
import { useAuth } from '../../contexts/AuthContext'
import { PasswordType } from '../../constants/account'
import { updateDoctorPassword } from '../../services/apiAuth'

export default function UpdatePassword() {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PasswordType>()
  const router = useRouter()
  const { currentUser } = useAuth()

  const handleChangePassword = async ({
    oldPassword,
    newPassword,
  }: PasswordType) => {
    const res = await updateDoctorPassword({
      doctorId: currentUser?.id!,
      oldPassword,
      newPassword,
    })

    if (res.success) {
      Alert.alert('Success', res.message, [
        {
          text: 'Great',
          onPress: () => {
            reset()
            router.replace('/doctor/(tabs)/profile')
          },
        },
      ])
    } else {
      Alert.alert('Error', res.message)
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <MyTouchableOpacity
          style={styles.backBtn}
          onPress={() => router.replace('/doctor/(tabs)/profile')}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.primary[500]} />
        </MyTouchableOpacity>

        <MyText size="h3" style={{ color: COLORS.primary[500] }}>
          Update Your Password
        </MyText>
      </View>

      <View style={styles.body}>
        <View style={styles.inputControl}>
          <Controller
            control={control}
            rules={{
              required: 'This field is required.',
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <MyTextInput
                secureTextEntry
                placeholder="Current password"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                autoCorrect={false}
                autoCapitalize="none"
              />
            )}
            name="oldPassword"
          />
          {errors.oldPassword && (
            <MyText style={styles.errorLabel}>
              {errors.oldPassword.message}
            </MyText>
          )}
        </View>

        <View style={styles.inputControl}>
          <Controller
            control={control}
            rules={{
              required: 'This field is required.',
              minLength: {
                value: 5,
                message: 'Password must be at least 5 characters long.',
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <MyTextInput
                secureTextEntry
                placeholder="Create your new password"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                autoCorrect={false}
                autoCapitalize="none"
              />
            )}
            name="newPassword"
          />
          {errors.newPassword && (
            <MyText style={styles.errorLabel}>
              {errors.newPassword.message}
            </MyText>
          )}
        </View>

        <View style={styles.inputControl}>
          <Controller
            control={control}
            rules={{
              required: 'This field is required.',
              validate: (value, fieldValues) =>
                value === fieldValues.newPassword || 'Passwords do not match',
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <MyTextInput
                secureTextEntry
                placeholder="Re-type your new password"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                autoCorrect={false}
                autoCapitalize="none"
              />
            )}
            name="confirmNewPassword"
          />
          {errors.confirmNewPassword && (
            <MyText style={styles.errorLabel}>
              {errors.confirmNewPassword.message}
            </MyText>
          )}
        </View>

        <Link href="/patient/forgot-password" style={styles.forgotPassword}>
          Forgot your password?
        </Link>

        <MyTouchableOpacity
          onPress={handleSubmit(handleChangePassword)}
          style={styles.btn}
        >
          <MyText size="h4" style={{ color: 'white' }}>
            Change Password
          </MyText>
        </MyTouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
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
  inputControl: {},
  errorLabel: {
    color: COLORS.error,
  },
  forgotPassword: {
    color: COLORS.secondary[400],
    textAlign: 'right',
    fontSize: 16,
  },
  btn: {
    borderRadius: 8,
    backgroundColor: COLORS.primary[500],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 20,
  },
})

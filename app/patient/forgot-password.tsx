import MyText from '@/components/MyText'
import MyTextInput from '@/components/MyTextInput'
import MyTouchableOpacity from '@/components/MyTouchableOpacity'
import { COLORS } from '@/constants/colors'
import { SignInTypes } from '@/constants/types'
import { useAuth } from '@/contexts/AuthContext'
import { forgotPassword } from '@/services/apiAuth'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { ActivityIndicator, Alert, StyleSheet, View } from 'react-native'

export default function ForgotPassword() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInTypes>({
    defaultValues: { email: 'ronjacobdinero15@gmail.com' },
  })
  const { isLoading, setIsLoading } = useAuth()

  const handleResetPassword = async ({ email }: { email: string }) => {
    setIsLoading(true)
    try {
      const res = await forgotPassword(email)

      if (res.success) {
        Alert.alert('Success', res.message)
      } else {
        Alert.alert('Error', res.message)
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to send reset password email')
    }
    setIsLoading(false)
  }

  return (
    <View style={styles.container}>
      <MyText style={styles.title} size="h1">
        Reset your Password
      </MyText>
      <MyText style={styles.message} size="h4">
        Please provide the email address that you used when you signed up for
        your account.
      </MyText>

      <View style={styles.inputControl}>
        <MyText size="h4" style={styles.inputLabel}>
          Email address
        </MyText>

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
              placeholder="johndoe@gmail.com"
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
          <MyText style={styles.errorLabel}>{errors.email.message}</MyText>
        )}
      </View>

      <MyText style={styles.message} size="h4">
        We will send you an email that will allow you to reset your password.
      </MyText>

      <MyTouchableOpacity
        onPress={handleSubmit(handleResetPassword)}
        style={styles.btn}
      >
        {isLoading ? (
          <ActivityIndicator size="large" color="white" />
        ) : (
          <MyText size="h4" style={{ color: '#fff' }}>
            Reset password
          </MyText>
        )}
      </MyTouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    textAlign: 'center',
    marginVertical: 36,
    marginBottom: 6,
    color: COLORS.primary[500],
  },
  message: {
    textAlign: 'center',
  },
  inputControl: {
    width: '100%',
    marginVertical: 40,
  },
  inputLabel: {
    marginBottom: 8,
  },
  errorLabel: {
    color: '#d71818',
  },
  btn: {
    backgroundColor: COLORS.primary[500],
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 20,
    width: '60%',
  },
})

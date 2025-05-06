import { Ionicons } from '@expo/vector-icons'
import { Link, useRouter } from 'expo-router'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import MyText from '../components/MyText'
import MyTextInput from '../components/MyTextInput'
import MyTouchableOpacity from '../components/MyTouchableOpacity'
import Spinner from '../components/Spinner'
import { SignInType } from '../constants/account'
import { COLORS } from '../constants/Colors'
import { useAuth } from '../contexts/AuthContext'
import { updatePatientNeedsOnboarding, userLogin } from '../services/apiAuth'

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false)
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SignInType>()

  const router = useRouter()
  const { userSignIn, isLoading, setIsLoading } = useAuth()

  const handleLogin = async ({ email, password }: SignInType) => {
    setIsLoading(true)
    try {
      const res = await userLogin({ email, password, action: 'patientLogin' })

      if (res.success) {
        await userSignIn({
          id: String(res.id),
          email,
          firstName: res.firstName,
          role: 'patient',
        })

        if (res.needsOnboarding === 1) {
          await updatePatientNeedsOnboarding(res.id, 0)
          router.replace('/patient/onboarding-screen')
        } else {
          router.replace('/patient/(tabs)')
        }
      } else {
        Alert.alert('Error', res.message)
        // reset({ email, password: '' })
      }
    } catch (error) {
      Alert.alert('Error', 'Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) return <Spinner />

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={'position'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 50 : 0}
      >
        <ScrollView>
          <View style={styles.header}>
            <Image
              style={styles.headerImg}
              source={require('../assets/images/logo.png')}
              alt="MyApp icon"
            />

            <MyText style={styles.title} size="h1">
              Sign in to PulseAI
            </MyText>

            <MyText style={{ textAlign: 'center' }}>
              Analyze your blood pressure data with AI
            </MyText>
          </View>

          <View style={styles.form}>
            <View style={styles.inputControl}>
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
                    placeholder="Email address"
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

            <View style={styles.inputControl}>
              <Controller
                control={control}
                rules={{
                  required: 'This field is required.',
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <MyTextInput
                    secureTextEntry={!showPassword}
                    placeholder="Password"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    autoCorrect={false}
                    autoCapitalize="none"
                    style={{ paddingRight: 60 }}
                  />
                )}
                name="password"
              />
              {errors.password && (
                <MyText style={styles.errorLabel}>
                  {errors.password.message}
                </MyText>
              )}
              {showPassword ? (
                <MyTouchableOpacity
                  style={styles.showPasswordBtn}
                  onPress={() => setShowPassword(false)}
                >
                  <Ionicons
                    name="eye-outline"
                    size={28}
                    color={COLORS.primary[500]}
                  />
                </MyTouchableOpacity>
              ) : (
                <MyTouchableOpacity
                  style={styles.showPasswordBtn}
                  onPress={() => setShowPassword(true)}
                >
                  <Ionicons
                    name="eye-off-outline"
                    size={28}
                    color={COLORS.primary[500]}
                  />
                </MyTouchableOpacity>
              )}
            </View>

            <Link
              href="/patient/forgot-password"
              style={[styles.links, { textAlign: 'right' }]}
            >
              Forgot your password?
            </Link>

            <View style={styles.formAction}>
              <MyTouchableOpacity
                onPress={handleSubmit(handleLogin)}
                style={styles.btn}
              >
                {isLoading ? (
                  <ActivityIndicator size="large" color="white" />
                ) : (
                  <MyText size="h4" style={{ color: 'white' }}>
                    Sign in
                  </MyText>
                )}
              </MyTouchableOpacity>
            </View>

            <Link
              href="/patient/signUp"
              style={[
                styles.links,
                { textAlign: 'center', marginVertical: 20 },
              ]}
            >
              Don't have an account?{' '}
              <Text style={{ textDecorationLine: 'underline' }}>Sign up</Text>
            </Link>

            <Link
              href="/doctor/login"
              style={[
                styles.links,
                { textAlign: 'center', color: COLORS.primary[500] },
              ]}
            >
              Switch to doctor login
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: 'white',
    minHeight: '100%',
  },
  header: {
    marginVertical: 30,
    width: '100%',
    alignItems: 'center',
  },
  headerImg: {
    width: 80,
    height: 80,
    marginBottom: 36,
  },
  title: {
    marginBottom: 6,
    color: COLORS.primary[500],
  },
  form: {
    marginBottom: 24,
    flex: 1,
    gap: 12,
  },
  formAction: {
    marginVertical: 10,
  },
  inputControl: {
    position: 'relative',
  },
  inputLabel: {
    marginBottom: 8,
  },
  errorLabel: {
    color: COLORS.error,
  },
  icon: {
    width: 100,
    height: 100,
  },
  links: {
    color: COLORS.secondary[400],
    fontSize: 17,
  },
  btn: {
    backgroundColor: COLORS.primary[500],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  showPasswordBtn: {
    position: 'absolute',
    right: 15,
    top: 12,
    color: COLORS.primary[500],
    height: 'auto',
  },
})

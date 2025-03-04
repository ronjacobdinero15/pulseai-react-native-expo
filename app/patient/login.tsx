import MyText from '@/components/MyText'
import MyTextInput from '@/components/MyTextInput'
import MyTouchableOpacity from '@/components/MyTouchableOpacity'
import Spinner from '@/components/Spinner'
import { COLORS } from '@/constants/colors'
import { SignInType } from '@/constants/types'
import { useAuth } from '@/contexts/AuthContext'
import { loginPatient, updatePatientNeedsOnboarding } from '@/services/apiAuth'
import { Link, useRouter } from 'expo-router'
import { Controller, useForm } from 'react-hook-form'
import { ActivityIndicator, Alert, Image, StyleSheet, View } from 'react-native'

export default function SignIn() {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SignInType>({
    defaultValues: {
      email: 'ronjacobdinero15@gmail.com',
      password: '12345',
    },
  })

  const router = useRouter()
  const { patientSignIn, isLoading, setIsLoading } = useAuth()

  const handleLogin = async ({ email, password }: SignInType) => {
    setIsLoading(true)
    try {
      const res = await loginPatient(email, password)

      if (res.success) {
        await patientSignIn(String(res.id), res.firstName)

        if (res.needsOnboarding === 1) {
          await updatePatientNeedsOnboarding(res.id, 0)
          Alert.alert('Success', res.message, [
            {
              onPress: () => {
                router.replace('/patient/onboarding-screen')
              },
            },
          ])
        } else {
          Alert.alert('Success', res.message, [
            {
              text: 'OK',
              onPress: () => {
                router.replace('/patient/(tabs)')
              },
            },
          ])
        }
      } else {
        Alert.alert('Error', res.message)
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
      <View style={styles.header}>
        <Image
          style={styles.headerImg}
          source={require('@/assets/images/icon.png')}
          alt="MyApp icon"
        />

        <MyText style={styles.title} size="h1">
          Sign in to PulseAI
        </MyText>

        <MyText>Analyze your pulse rate with AI</MyText>
      </View>

      <View style={styles.form}>
        <View style={styles.inputControl}>
          <MyText size="h4" style={styles.inputLabel}>
            Email
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

        <View style={styles.inputControl}>
          <MyText size="h4" style={styles.inputLabel}>
            Password
          </MyText>

          <Controller
            control={control}
            rules={{
              required: 'This field is required.',
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <MyTextInput
                secureTextEntry
                placeholder="******"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                autoCorrect={false}
                autoCapitalize="none"
              />
            )}
            name="password"
          />
          {errors.password && (
            <MyText style={styles.errorLabel}>{errors.password.message}</MyText>
          )}
        </View>

        <Link href="/patient/forgot-password" style={styles.forgotPassword}>
          Forgot Password?
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

        <MyTouchableOpacity
          style={{ margin: 'auto' }}
          onPress={() => router.push('/patient/signUp')}
        >
          <MyText size="h4" style={styles.formFooter}>
            Don't have an account?{' '}
            <MyText
              size="h4"
              style={[styles.formFooter, { textDecorationLine: 'underline' }]}
            >
              Sign up
            </MyText>
          </MyText>
        </MyTouchableOpacity>
      </View>
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
    marginVertical: 24,
  },
  formFooter: {
    color: COLORS.secondary[400],
    textAlign: 'center',
    letterSpacing: 0.15,
  },
  inputControl: {},
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
  forgotPassword: {
    color: COLORS.secondary[400],
    textAlign: 'right',
    fontSize: 16,
  },
  btn: {
    backgroundColor: COLORS.primary[500],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
})

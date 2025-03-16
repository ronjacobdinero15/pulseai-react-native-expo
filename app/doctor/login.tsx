import { Link, useRouter } from 'expo-router'
import { Controller, useForm } from 'react-hook-form'
import { ActivityIndicator, Alert, Image, StyleSheet, View } from 'react-native'
import MyText from '../../components/MyText'
import MyTextInput from '../../components/MyTextInput'
import MyTouchableOpacity from '../../components/MyTouchableOpacity'
import Spinner from '../../components/Spinner'
import { SignInType } from '../../constants/account'
import { COLORS } from '../../constants/Colors'
import { useAuth } from '../../contexts/AuthContext'
import { userLogin } from '../../services/apiAuth'

export default function SignIn() {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SignInType>({
    defaultValues: {
      email: 'ronjacobdinero15@gmail.com',
      password: 'qwerty123',
    },
  })

  const router = useRouter()
  const { userSignIn, isLoading, setIsLoading } = useAuth()

  const handleLogin = async ({ email, password }: SignInType) => {
    setIsLoading(true)
    try {
      const res = await userLogin({ email, password, action: 'doctorLogin' })

      if (res.success) {
        await userSignIn({
          id: String(res.id),
          email,
          firstName: res.firstName,
          role: 'doctor',
        })

        Alert.alert('Success', res.message, [
          {
            text: 'Great',
          },
        ])
        router.replace('/doctor/(tabs)')
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
          source={require('../../assets/images/logo.png')}
          alt="MyApp icon"
        />

        <MyText style={styles.title} size="h1">
          Sign in to PulseAI
        </MyText>

        <MyText style={{ textAlign: 'center' }}>
          Access detailed patient data and monitor blood pressure trends for
          personalized care.
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
            <MyText style={styles.errorLabel}>{errors.email.message}</MyText>
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
                secureTextEntry
                placeholder="Password"
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

        <Link href="/" style={styles.anotherUser}>
          Switch to patient login
        </Link>

        <View style={styles.needHelp}>
          <MyText style={styles.needHelpText}>
            To create a doctor account, please contact the IT department
          </MyText>
        </View>
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
    marginVertical: 10,
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
  anotherUser: {
    color: COLORS.primary[500],
    textAlign: 'center',
    fontSize: 16,
  },
  needHelp: {
    padding: 10,
    borderRadius: 15,
    marginTop: 10,
    height: 'auto',
  },
  needHelpText: {
    fontSize: 14,
    textAlign: 'center',
    fontStyle: 'italic',
    color: COLORS.secondary[400],
  },
})

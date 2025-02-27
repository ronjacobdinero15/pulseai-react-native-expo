import Dropdown from '@/components/Dropdown'
import MultipleSelectListCheckbox from '@/components/MultipleSelectListCheckbox'
import MyModal from '@/components/MyModal'
import MyText from '@/components/MyText'
import MyTextInput from '@/components/MyTextInput'
import MyTouchableOpacity from '@/components/MyTouchableOpacity'
import RadioButton from '@/components/RadioButton'
import Terms from '@/components/Terms'
import { COLORS } from '@/constants/colors'
import {
  comorbiditiesOptions,
  genderOptions,
  lifestyleOptions,
  SignUpTypes,
  vicesOptions,
} from '@/constants/signup'
import { useAuth } from '@/contexts/AuthContext'
import { registerPatient } from '@/services/apiAuth'
import Checkbox from 'expo-checkbox'
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native'

export default function SignUp() {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SignUpTypes>({
    defaultValues: {
      email: 'ronjacobdinero15@gmail.com',
      password: '12345',
      passwordConfirm: '12345',
      age: '20',
      gender: 'male',
      vices: ['alcohol'],
      bmi_height_cm: '168',
      bmi_weight_kg: '60',
      comorbidities: ['diabetes'],
      parental_hypertension: 'no',
      lifestyle: 'sedentary',
      needsOnboarding: true,
    },
  })
  const router = useRouter()
  const [showComplianceModal, setShowComplianceModal] = useState(true)
  const [toggleComplianceCheckbox, setToggleComplianceCheckbox] =
    useState(false)
  const { isLoading, setIsLoading } = useAuth()

  const handleRegistration = async (data: SignUpTypes) => {
    setIsLoading(true)
    const res = await registerPatient(data)

    if (res.success) {
      router.push('/patient/login')
      Alert.alert('Success', res.message)

      setIsLoading(false)
      reset()
      return
    }
    setIsLoading(false)

    Alert.alert('Error', res.message)
  }

  return (
    <ScrollView>
      <View style={styles.container}>
        <MyModal visible={showComplianceModal} title="Terms and Conditions">
          <Terms />

          <View style={styles.checkboxContainer}>
            <Checkbox
              color={COLORS.primary[500]}
              style={[styles.checkbox]}
              value={toggleComplianceCheckbox}
              onValueChange={checked => setToggleComplianceCheckbox(checked)}
            />
            <MyText style={{ flex: 1 }}>
              By using PulseAI, you acknowledge that you have read, understood,
              and agreed to these Terms and Conditions.
            </MyText>
          </View>

          <MyTouchableOpacity
            style={[
              styles.btn,
              {
                backgroundColor: toggleComplianceCheckbox
                  ? COLORS.primary[500]
                  : 'white',
              },
            ]}
            disabled={!toggleComplianceCheckbox}
            onPress={() => setShowComplianceModal(false)}
          >
            <MyText
              size="h4"
              style={{
                color: toggleComplianceCheckbox ? 'white' : COLORS.primary[900],
              }}
            >
              Continue registration
            </MyText>
          </MyTouchableOpacity>
        </MyModal>

        <View style={styles.header}>
          <Image
            style={styles.headerImg}
            source={require('@/assets/images/icon.png')}
            alt="MyApp icon"
          />

          <MyText
            size="h1"
            style={[styles.title, { color: COLORS.primary[500] }]}
          >
            Register
          </MyText>

          <MyText>Please register to login.</MyText>
        </View>

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
            <MyText style={styles.errorLabel}>{errors.email.message}</MyText>
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
                placeholder="Create your password"
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

        <View style={styles.inputControl}>
          <Controller
            control={control}
            rules={{
              required: 'This field is required.',
              validate: (value, fieldValues) =>
                value === fieldValues.password || 'Passwords do not match',
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <MyTextInput
                secureTextEntry
                placeholder="Confirm Password"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                autoCorrect={false}
                autoCapitalize="none"
              />
            )}
            name="passwordConfirm"
          />
          {errors.passwordConfirm && (
            <MyText style={styles.errorLabel}>
              {errors.passwordConfirm.message}
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
            <Controller
              control={control}
              rules={{
                required: 'Required.',
                maxLength: {
                  value: 3,
                  message: 'Invalid age.',
                },
                validate: value =>
                  parseInt(value) >= 18 || 'You must be at least 18 years old.',
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
              <MyText style={styles.errorLabel}>{errors.age.message}</MyText>
            )}
          </View>

          <View style={{ flex: 2 }}>
            <Controller
              control={control}
              rules={{ required: 'Required.' }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Dropdown
                  field="gender"
                  label="Gender"
                  data={genderOptions}
                  value={value}
                  onChange={onChange}
                  onBlur={onBlur}
                />
              )}
              name="gender"
            />
            {errors.gender && (
              <MyText style={styles.errorLabel}>{errors.gender.message}</MyText>
            )}
          </View>
        </View>

        <View style={styles.inputControl}>
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
            name="bmi_height_cm"
          />
          {errors.bmi_height_cm && (
            <MyText style={styles.errorLabel}>
              {errors.bmi_height_cm.message}
            </MyText>
          )}
        </View>

        <View style={styles.inputControl}>
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
            name="bmi_weight_kg"
          />
          {errors.bmi_weight_kg && (
            <MyText style={styles.errorLabel}>
              {errors.bmi_weight_kg.message}
            </MyText>
          )}
        </View>

        <View style={styles.inputControl}>
          <Controller
            control={control}
            rules={{ required: 'This field is required.' }}
            render={({ field: { onChange, onBlur, value } }) => (
              <MultipleSelectListCheckbox
                label="Vices"
                data={vicesOptions}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
              />
            )}
            name="vices"
          />
          {errors.vices && (
            <MyText style={styles.errorLabel}>{errors.vices.message}</MyText>
          )}
        </View>

        <View style={styles.inputControl}>
          <Controller
            control={control}
            rules={{ required: 'This field is required.' }}
            render={({ field: { onChange, onBlur, value } }) => (
              <MultipleSelectListCheckbox
                label="Comorbidities"
                data={comorbiditiesOptions}
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
            name="parental_hypertension"
          />
          {errors.parental_hypertension && (
            <MyText style={styles.errorLabel}>
              {errors.parental_hypertension.message}
            </MyText>
          )}
        </View>

        <View style={styles.inputControl}>
          <Controller
            control={control}
            rules={{ required: 'This field is required.' }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Dropdown
                field="lifestyle"
                label="Lifestyle"
                data={lifestyleOptions}
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

        <View style={styles.termsContainer}>
          <Checkbox
            value={toggleComplianceCheckbox}
            color={COLORS.primary[500]}
            onValueChange={checked => setToggleComplianceCheckbox(checked)}
          />
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <MyText>I agree to the </MyText>
            <Pressable onPress={() => setShowComplianceModal(true)}>
              <MyText style={styles.terms}>Terms and Conditions</MyText>
            </Pressable>
          </View>
        </View>

        <MyTouchableOpacity
          style={[
            styles.btn,
            {
              backgroundColor: toggleComplianceCheckbox
                ? COLORS.primary[500]
                : 'white',
            },
          ]}
          onPress={handleSubmit(handleRegistration)}
          disabled={!toggleComplianceCheckbox}
        >
          {isLoading ? (
            <ActivityIndicator size="large" color="white" />
          ) : (
            <MyText
              size="h4"
              style={{
                color: toggleComplianceCheckbox ? 'white' : COLORS.primary[900],
              }}
            >
              Register
            </MyText>
          )}
        </MyTouchableOpacity>

        <MyTouchableOpacity
          style={styles.footer}
          onPress={() => router.push('/patient/login')}
        >
          <MyText size="h4" style={styles.formFooter}>
            Login instead?{' '}
            <MyText
              size="h4"
              style={[styles.formFooter, { textDecorationLine: 'underline' }]}
            >
              Sign up
            </MyText>
          </MyText>
        </MyTouchableOpacity>
      </View>
    </ScrollView>
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
    marginVertical: 36,
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
  },
  input: {
    marginBottom: 10,
  },
  footer: {
    marginVertical: 20,
  },
  formFooter: {
    color: COLORS.secondary[400],
    textAlign: 'center',
    letterSpacing: 0.15,
  },
  inputControl: {
    marginBottom: 10,
  },
  inputLabel: {
    marginBottom: 8,
  },
  errorLabel: {
    color: '#d71818',
  },
  shortContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  healthInfo: {
    height: 30,
    flexDirection: 'row',
    alignItems: 'center',
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
  },
  checkboxContainer: {
    flexDirection: 'row',
    marginVertical: 30,
  },
  checkbox: {
    width: 30,
    height: 30,
    marginRight: 20,
    marginTop: 5,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    gap: 5,
  },
  terms: {
    textDecorationLine: 'underline',
    color: COLORS.primary[500],
  },
  divider: {
    height: 2,
    backgroundColor: COLORS.secondary[200],
    borderRadius: 50,
  },
})

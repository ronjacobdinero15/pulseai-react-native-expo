import Checkbox from 'expo-checkbox'
import { Link, useRouter } from 'expo-router'
import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import DateOfBirth from '../../components/DateOfBirth'
import DropdownComponent from '../../components/Dropdown'
import MultipleSelectListCheckbox from '../../components/MultipleSelectListCheckbox'
import MyModal from '../../components/MyModal'
import MyText from '../../components/MyText'
import MyTextInput from '../../components/MyTextInput'
import MyTouchableOpacity from '../../components/MyTouchableOpacity'
import RadioButton from '../../components/RadioButton'
import Terms from '../../components/Terms'
import { COLORS } from '../../constants/Colors'
import {
  COMORBIDITIESOPTIONS,
  GENDEROPTIONS,
  LIFESTYLEOPTIONS,
  PatientProfileType,
  VICESOPTIONS,
} from '../../constants/signup'
import { registerPatient } from '../../services/apiAuth'

export default function SignUp() {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PatientProfileType>()
  const router = useRouter()
  const [showComplianceModal, setShowComplianceModal] = useState(true)
  const [toggleComplianceCheckbox, setToggleComplianceCheckbox] =
    useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleRegistration = async (data: PatientProfileType) => {
    setIsLoading(true)
    const res = await registerPatient(data)

    if (res.success) {
      setIsLoading(false)
      Alert.alert('Success', res.message, [
        {
          text: 'OK',
          onPress: () => {
            router.replace('/')
            setIsLoading(false)
            reset()
          },
        },
      ])
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
              color={
                toggleComplianceCheckbox
                  ? COLORS.primary[500]
                  : COLORS.secondary[200]
              }
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
            source={require('../../assets/images/logo.png')}
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
            <MyText style={styles.errorLabel}>{errors.lastName.message}</MyText>
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
          <MyText style={styles.inputLabel}>Contact number:</MyText>

          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <MyTextInput
                placeholder="Contact number"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                autoCorrect={false}
                maxLength={13}
                keyboardType="phone-pad"
              />
            )}
            name="contact"
          />
          {errors.contact && (
            <MyText style={styles.errorLabel}>{errors.contact.message}</MyText>
          )}
        </View>

        <View style={styles.inputControl}>
          <MyText style={styles.inputLabel}>Address:</MyText>

          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <MyTextInput
                placeholder="Address"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                maxLength={200}
              />
            )}
            name="address"
          />
          {errors.address && (
            <MyText style={styles.errorLabel}>{errors.address.message}</MyText>
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
            <MyText style={styles.errorLabel}>{errors.email.message}</MyText>
          )}
        </View>

        <View style={styles.inputControl}>
          <MyText style={styles.inputLabel}>Create password:</MyText>

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
            <MyText style={styles.inputLabel}>Gender:</MyText>

            <Controller
              control={control}
              rules={{ required: 'Required.' }}
              render={({ field: { onChange, onBlur, value } }) => (
                <DropdownComponent
                  label="Gender"
                  data={GENDEROPTIONS}
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
          <MyText style={styles.inputLabel}>
            BMI (height in feet, inches/cm):
          </MyText>

          <Controller
            control={control}
            rules={{
              required: 'This field is required.',
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <MyTextInput
                placeholder="BMI (height feet, inches/in cm)"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
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
            render={({ field: { onChange, onBlur, value } }) => (
              <MultipleSelectListCheckbox
                label="Vices"
                data={VICESOPTIONS}
                value={value || []}
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
          <MyText style={styles.inputLabel}>Comorbidities:</MyText>

          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <MultipleSelectListCheckbox
                label="Comorbidities"
                data={COMORBIDITIESOPTIONS}
                value={value || []}
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
                label="Lifestyle"
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

        <View style={styles.termsContainer}>
          <Checkbox
            value={toggleComplianceCheckbox}
            color={COLORS.primary[500]}
            onValueChange={checked => setToggleComplianceCheckbox(checked)}
          />
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              flexWrap: 'wrap',
            }}
          >
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

        <Link
          href="/"
          style={[styles.links, { textAlign: 'center', marginVertical: 20 }]}
        >
          Login instead?{' '}
          <Text style={{ textDecorationLine: 'underline' }}>Login</Text>
        </Link>
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
    color: COLORS.error,
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
    borderWidth: 1,
    borderColor: COLORS.secondary[200],
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
    flex: 1,
    height: 1,
    backgroundColor: COLORS.secondary[200],
    borderRadius: 50,
  },
  links: {
    color: COLORS.secondary[400],
    fontSize: 17,
  },
})

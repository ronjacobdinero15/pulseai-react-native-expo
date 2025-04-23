import { Ionicons } from '@expo/vector-icons'
import RNDateTimePicker from '@react-native-community/datetimepicker'
import { Link, useRouter } from 'expo-router'
import moment from 'moment'
import React, { useState } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { ActivityIndicator, Platform, StyleSheet, View } from 'react-native'
import DropdownComponent from '../../components/Dropdown'
import MyText from '../../components/MyText'
import MyTouchableOpacity from '../../components/MyTouchableOpacity'
import { COLORS } from '../../constants/Colors'
import { reportType } from '../../constants/types'
import { useAuth } from '../../contexts/AuthContext'
import usePatientPdfView from '../../hooks/usePdfView'
import { getPatientProfile, updateGenerateReport } from '../../services/apiAuth'
import { formatDate, formatDateForText } from '../../utils/helpers'
import SurveyModal from '../../components/SurveyModal'

const REPORT_DATE_RANGE = [
  {
    label: 'All dates',
    value: 'all_dates',
  },
  {
    label: 'Custom',
    value: 'custom',
  },
]

export default function GenerateReport() {
  const {
    control,
    handleSubmit,
    reset,
    getValues,
    watch,
    formState: { errors },
  } = useForm<reportType>({
    defaultValues: {
      reportType: 'all_dates',
    },
  })
  const [showStartDate, setShowStartDate] = useState(false)
  const [showEndDate, setShowEndDate] = useState(false)
  const router = useRouter()
  const { currentUser } = useAuth()
  const patientId = currentUser?.id!
  const [isSurveyModalVisible, setSurveyModalVisible] = useState(false)

  const generateAndOpenPdf = usePatientPdfView()
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false)

  const startDate = useWatch({ control, name: 'startDate' })
  const endDate = useWatch({ control, name: 'endDate' })
  const reportType = watch('reportType')

  const handleGenerateAndOpenPdf = async ({
    startDate,
    endDate,
  }: reportType) => {
    setIsGeneratingPdf(true)
    try {
      await generateAndOpenPdf({ patientId, startDate, endDate })
      await updateGenerateReport(patientId)
      reset()
    } catch (error) {
      console.error('Error generating PDF:', error)
    } finally {
      setIsGeneratingPdf(false)
      const data = await getPatientProfile(patientId)

      if (!data.patient.didAnsweredSurvey) {
        setSurveyModalVisible(true)
      }
    }
  }

  return (
    <View style={styles.container}>
      <SurveyModal
        visible={isSurveyModalVisible}
        onClose={() => setSurveyModalVisible(false)}
        patientId={patientId}
      />
      <View style={styles.headerContainer}>
        <MyTouchableOpacity
          style={styles.backBtn}
          onPress={() => router.replace('/patient/(tabs)/profile')}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.primary[500]} />
        </MyTouchableOpacity>

        <MyText size="h3" style={{ color: COLORS.primary[500] }}>
          Select report date range
        </MyText>
      </View>

      <View style={styles.body}>
        <View style={{ marginBottom: 70 }}>
          <MyText style={styles.inputLabel}>Select report type:</MyText>

          <Controller
            control={control}
            rules={{ required: 'Required.' }}
            render={({ field: { onChange, onBlur, value } }) => (
              <DropdownComponent
                label="Report Type"
                data={REPORT_DATE_RANGE}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
              />
            )}
            name="reportType"
          />
          {errors.reportType && (
            <MyText style={styles.errorLabel}>
              {errors.reportType.message}
            </MyText>
          )}
        </View>

        {reportType === 'custom' && (
          <View>
            <MyText style={styles.inputLabel}>Select range:</MyText>

            <View style={styles.dateGroup}>
              {/* START DATE */}
              <View style={styles.inputContainer}>
                <Controller
                  control={control}
                  name="startDate"
                  rules={{
                    required: 'Required.',
                    validate: (value, fieldValues) =>
                      moment(value, 'MM/DD/YYYY').isBefore(
                        moment(fieldValues.endDate, 'MM/DD/YYYY')
                      ) || 'Start date must be before end date.',
                  }}
                  render={({ field: { onChange, value } }) => (
                    <>
                      <MyTouchableOpacity
                        style={styles.inputControl}
                        onPress={() => setShowStartDate(true)}
                      >
                        <Ionicons
                          name="calendar-outline"
                          size={24}
                          style={[styles.icon, { borderRightWidth: 0 }]}
                        />
                        {value ? (
                          <MyText size="h6">{formatDateForText(value)}</MyText>
                        ) : (
                          <MyText>Start Date</MyText>
                        )}
                      </MyTouchableOpacity>
                      {showStartDate && (
                        <RNDateTimePicker
                          minimumDate={new Date(2010, 0, 1)}
                          onChange={(event, selectedDate) => {
                            const currentDate = formatDate(
                              event.nativeEvent.timestamp
                            )
                            onChange(currentDate)
                            setShowStartDate(false)
                          }}
                          value={new Date()}
                        />
                      )}
                    </>
                  )}
                />
                {errors.startDate && (
                  <MyText style={styles.errorLabel} size="h6">
                    {errors.startDate.message}
                  </MyText>
                )}
              </View>

              {/* END DATE */}
              <View style={styles.inputContainer}>
                <Controller
                  control={control}
                  name="endDate"
                  rules={{
                    required: 'Required.',
                    validate: value =>
                      moment(value, 'MM/DD/YYYY').isAfter(
                        moment(startDate, 'MM/DD/YYYY')
                      ) || 'End date must be after start date.',
                  }}
                  render={({ field: { onChange, value } }) => (
                    <>
                      <MyTouchableOpacity
                        style={styles.inputControl}
                        onPress={() => setShowEndDate(true)}
                      >
                        <Ionicons
                          name="calendar-outline"
                          size={24}
                          style={[styles.icon, { borderRightWidth: 0 }]}
                        />
                        {value ? (
                          <MyText size="h6">{formatDateForText(value)}</MyText>
                        ) : (
                          <MyText>End Date</MyText>
                        )}
                      </MyTouchableOpacity>
                      {showEndDate && (
                        <RNDateTimePicker
                          minimumDate={new Date(2020, 0, 1)}
                          maximumDate={new Date()}
                          onChange={(event, selectedDate) => {
                            const currentDate = formatDate(
                              event.nativeEvent.timestamp
                            )
                            onChange(currentDate)
                            setShowEndDate(false)
                          }}
                          value={new Date()}
                        />
                      )}
                    </>
                  )}
                />
                {errors.endDate && (
                  <MyText style={styles.errorLabel} size="h6">
                    {errors.endDate.message}
                  </MyText>
                )}
              </View>
            </View>
          </View>
        )}

        <View
          style={{
            backgroundColor: COLORS.secondary[100],
            padding: 15,
            borderRadius: 8,
            marginTop: reportType === 'custom' ? 20 : 0,
          }}
        >
          <Link
            href="https://www.acc.org/latest-in-cardiology/ten-points-to-remember/2017/11/09/11/41/2017-guideline-for-high-blood-pressure-in-adults"
            style={{
              textAlign: 'center',
              color: COLORS.primary[500],
              fontSize: 16,
              fontWeight: 'bold',
            }}
          >
            Source : ACC/AHA
          </Link>
          <MyText size="h6" style={{ fontStyle: 'italic' }}>
            To make sure we get an accurate picture of your blood pressure,
            we’ll use the average of at least two readings taken on two
            different places to estimate the individual’s level of BP.
            Out-of-office and self-monitoring of BP measurements are recommended
            to confirm the diagnosis of hypertension and for titration of
            BP-lowering medication, in conjunction with clinical interventions
            and telehealth counseling.
          </MyText>
        </View>

        <MyTouchableOpacity
          style={[
            styles.submitButton,
            {
              backgroundColor: isGeneratingPdf
                ? COLORS.secondary[200]
                : COLORS.primary[500],
            },
          ]}
          onPress={handleSubmit(handleGenerateAndOpenPdf)}
          disabled={isGeneratingPdf}
        >
          {isGeneratingPdf ? (
            <ActivityIndicator size="large" color="white" />
          ) : (
            <MyText style={styles.submitButtonText}>Generate report</MyText>
          )}
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
  },
  inputLabel: {
    marginBottom: 8,
  },
  errorLabel: {
    color: COLORS.error,
  },
  dateGroup: {
    flexDirection: 'row',
    gap: 5,
  },
  inputContainer: {
    flex: 1,
  },
  inputControl: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.secondary[200],
    marginTop: 7,
    height: 60,
    overflow: 'hidden',
  },
  icon: {
    color: COLORS.primary[500],
    borderRightWidth: 1,
    paddingRight: 12,
    borderColor: COLORS.secondary[200],
  },
  submitButton: {
    marginTop: 25,
    backgroundColor: COLORS.primary[500],
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
  },
})

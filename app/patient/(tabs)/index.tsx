import Ionicons from '@expo/vector-icons/Ionicons'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  View,
} from 'react-native'
import MyModal from '../../../components/MyModal'
import MyText from '../../../components/MyText'
import MyTextInput from '../../../components/MyTextInput'
import MyTouchableOpacity from '../../../components/MyTouchableOpacity'
import Spinner from '../../../components/Spinner'
import { COLORS } from '../../../constants/Colors'
import { useAuth } from '../../../contexts/AuthContext'
import {
  addNewBpForToday,
  checkIfUserHasAlreadyBpToday,
} from '../../../services/apiMedication'

export default function HomeScreen() {
  const [bp, setBp] = useState({ systolic: '', diastolic: '' })
  const [bpAlreadyTaken, setBpAlreadyTaken] = useState(false)
  const { currentUser, refresh, setRefresh } = useAuth()
  const [showConfirmationModal, setShowConfirmationModal] = useState(false)
  const [openHelpAccordion, setOpenHelpAccordion] = useState(false)
  const [openGuideAccordion, setOpenGuideAccordion] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchIfUserHasAlreadyBpToday()
  }, [refresh])

  const fetchIfUserHasAlreadyBpToday = async () => {
    setIsLoading(true)
    const res = await checkIfUserHasAlreadyBpToday({
      currentUserId: currentUser?.id!,
      dateTaken: moment().format('L'),
    })

    if (res.success) {
      setBpAlreadyTaken(true)
      setBp({
        systolic: res.systolic,
        diastolic: res.diastolic,
      })
    } else {
      setBpAlreadyTaken(false)
      setBp({ systolic: '', diastolic: '' })
    }
    setIsLoading(false)
  }

  const handleAddNewBpForToday = async () => {
    const res = await addNewBpForToday({
      currentUserId: currentUser?.id!,
      systolic: bp.systolic,
      diastolic: bp.diastolic,
      dateTaken: moment().format('L'),
    })

    if (res.success) {
      Alert.alert('Success', res.message, [
        {
          text: 'OK',
          onPress: () => {
            setShowConfirmationModal(false)
            setOpenHelpAccordion(false)
            setRefresh(1)
          },
        },
      ])
    }
  }

  const validateBpInput = (value: string) => {
    // Allow clearing the field
    if (value === '') return true
    // Must be all digits and cannot start with "0"
    if (!/^[1-9]\d{0,2}$/.test(value)) return false
    const numValue = parseInt(value, 10)
    return numValue <= 250
  }

  if (isLoading) return <Spinner />

  return (
    <FlatList
      data={[]}
      renderItem={() => null}
      style={styles.mainContainer}
      ListHeaderComponent={
        <View style={styles.container}>
          <MyModal
            visible={showConfirmationModal}
            title="Notice"
            onRequestClose={() => setShowConfirmationModal(false)}
          >
            <MyText size="h4" style={{ textAlign: 'center' }}>
              Are you sure you want to submit your BP for today?
            </MyText>

            <MyTouchableOpacity
              style={[
                styles.modalBtn,
                {
                  backgroundColor: isLoading
                    ? COLORS.secondary[200]
                    : COLORS.primary[500],
                },
              ]}
              disabled={!showConfirmationModal}
              onPress={() => handleAddNewBpForToday()}
            >
              {isLoading ? (
                <ActivityIndicator size="large" color="white" />
              ) : (
                <MyText
                  size="h4"
                  style={{
                    color: showConfirmationModal
                      ? 'white'
                      : COLORS.primary[900],
                  }}
                >
                  Submit BP for today
                </MyText>
              )}
            </MyTouchableOpacity>

            <MyTouchableOpacity
              style={[styles.modalBtn]}
              onPress={() => setShowConfirmationModal(false)}
            >
              <Ionicons name="close" size={24} color={COLORS.primary[500]} />
              <MyText size="h4" style={{ marginLeft: 5 }}>
                Cancel
              </MyText>
            </MyTouchableOpacity>
          </MyModal>

          <View style={styles.headerContainer}>
            <MyText
              size="h2"
              style={[
                styles.dateToday,
                {
                  color: COLORS.primary[500],
                },
              ]}
            >
              {moment().format('LL')}
            </MyText>
          </View>

          {bpAlreadyTaken ? (
            <View>
              <MyText
                size="h3"
                style={{
                  padding: 30,
                  textAlign: 'center',
                }}
              >
                Your BP for today is already submitted
              </MyText>

              <View style={styles.bpAlreadyTakenContainer}>
                <MyText style={{ color: 'white' }} size="h3">
                  Systolic: {bp.systolic}
                </MyText>
                <MyText style={{ color: 'white' }} size="h3">
                  Diastolic: {bp.diastolic}
                </MyText>
              </View>
            </View>
          ) : (
            <View>
              <MyText
                size="h3"
                style={{ marginVertical: 20, textAlign: 'center' }}
              >
                What is your BP for today?
              </MyText>

              <View>
                <View style={[styles.bpContainer, { gap: 35 }]}>
                  <MyText size="h3">Systolic</MyText>
                  <MyText size="h3">Diastolic</MyText>
                </View>

                <View style={styles.bpContainer}>
                  <MyTextInput
                    keyboardType="numeric"
                    autoCorrect={false}
                    value={bp.systolic}
                    onChangeText={text => {
                      if (validateBpInput(text)) {
                        setBp({ ...bp, systolic: text })
                      }
                    }}
                    style={styles.bpInput}
                    maxLength={3}
                  />

                  <MyText size="h3" style={{ fontSize: 25 }}>
                    /
                  </MyText>

                  <MyTextInput
                    keyboardType="numeric"
                    autoCorrect={false}
                    value={bp.diastolic}
                    onChangeText={text => {
                      if (validateBpInput(text)) {
                        setBp({ ...bp, diastolic: text })
                      }
                    }}
                    style={styles.bpInput}
                    maxLength={3}
                  />
                </View>
              </View>
            </View>
          )}

          {bp.systolic.length >= 2 && bp.diastolic.length >= 2 && (
            <MyTouchableOpacity
              style={styles.submitBtn}
              onPress={() => setShowConfirmationModal(true)}
              disabled={!bp.systolic && !bp.diastolic}
            >
              <MyText style={styles.submitBtnText} size="h4">
                Submit Record For Today
              </MyText>
            </MyTouchableOpacity>
          )}

          <View style={{ marginTop: 20 }}>
            <MyTouchableOpacity
              style={styles.reminderContainer}
              onPress={() => setOpenHelpAccordion(open => !open)}
            >
              <View style={styles.reminderHeaderContainer}>
                <MyText style={{ fontSize: 14 }}>
                  Need help reading your BP?
                </MyText>
                <Ionicons
                  name="chevron-down"
                  size={24}
                  color={COLORS.secondary[900]}
                />
              </View>
              {openHelpAccordion && (
                <View style={{ marginTop: 10, gap: 10 }}>
                  <View>
                    <MyText
                      style={[
                        styles.reminderText,
                        {
                          fontWeight: 'bold',
                        },
                      ]}
                    >
                      Systolic (Top Number):
                    </MyText>
                    <View>
                      <MyText style={styles.reminderText}>
                        &bull;Pressure when your heart beats
                      </MyText>
                      <MyText style={styles.reminderText}>
                        &bull;First number = Systolic (e.g., 120)
                      </MyText>
                    </View>
                  </View>
                  <View>
                    <MyText
                      style={[
                        styles.reminderText,
                        {
                          fontWeight: 'bold',
                        },
                      ]}
                    >
                      Diastolic (Bottom Number):
                    </MyText>
                    <MyText style={styles.reminderText}>
                      &bull;Pressure between heartbeats
                    </MyText>
                    <MyText style={styles.reminderText}>
                      &bull;Second number = Diastolic (e.g., 80)
                    </MyText>
                  </View>
                </View>
              )}
            </MyTouchableOpacity>

            <MyTouchableOpacity
              style={styles.reminderContainer}
              onPress={() => setOpenGuideAccordion(open => !open)}
            >
              <View style={styles.reminderHeaderContainer}>
                <MyText style={{ fontSize: 14 }}>
                  What will happen to your BP?
                </MyText>
                <Ionicons
                  name="chevron-down"
                  size={24}
                  color={COLORS.secondary[900]}
                />
              </View>
              {openGuideAccordion && (
                <View style={{ marginTop: 10, gap: 10 }}>
                  <View>
                    <MyText style={styles.reminderText}>
                      Your BP readings will be used to analyze patterns for over
                      a few days, weeks, or months of using our app. This will
                      essentially make it easier for our cardiologists to
                      understand your BP patterns and current medications and
                      better help you with your treatment.
                    </MyText>
                  </View>
                </View>
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
    marginBottom: 100,
  },
  headerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
  },
  dateToday: {
    color: COLORS.secondary[500],
  },
  bpOptionsContainer: {},
  bpOptionBtn: {
    height: 'auto',
    padding: 10,
    backgroundColor: COLORS.secondary[200],
    justifyContent: 'center',
    borderRadius: 15,
    marginBottom: 10,
    alignItems: 'center',
  },
  bpOptionText: {
    fontWeight: '600',
  },
  submitBtn: {
    marginTop: 20,
    width: '100%',
    backgroundColor: COLORS.success,
    padding: 10,
    borderRadius: 15,
    alignSelf: 'flex-end',
    fontWeight: '600',
  },
  submitBtnText: {
    textAlign: 'center',
    color: 'white',
  },
  modalBtn: {
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
  bpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    gap: 10,
  },
  bpInput: {
    width: 90,
    textAlign: 'center',
    fontSize: 20,
    height: 'auto',
  },
  reminderContainer: {
    backgroundColor: COLORS.secondary[100],
    padding: 10,
    borderRadius: 15,
    marginTop: 10,
    height: 'auto',
  },
  reminderHeaderContainer: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  reminderText: {
    fontSize: 14,
  },
  bpAlreadyTakenContainer: {
    backgroundColor: COLORS.primary[500],
    borderRadius: 15,
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
})

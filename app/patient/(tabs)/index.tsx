import Ionicons from '@expo/vector-icons/Ionicons'
import { useRouter } from 'expo-router'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { FlatList, StyleSheet, View } from 'react-native'
import BpIndexTable from '../../../components/BpIndexTable'
import MyText from '../../../components/MyText'
import MyTouchableOpacity from '../../../components/MyTouchableOpacity'
import Spinner from '../../../components/Spinner'
import SurveyModal from '../../../components/SurveyModal'
import { COLORS } from '../../../constants/Colors'
import { useAuth } from '../../../contexts/AuthContext'
import { getPatientProfile } from '../../../services/apiAuth'
import { getBpForTodayList } from '../../../services/apiBp'
import ChatBtn from '../../../components/ChatBtn'

export default function HomeScreen() {
  const [bpList, setBpList] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [openHelpAccordion, setOpenHelpAccordion] = useState(false)
  const [openWhenToTakeAccordion, setOpenWhenToTakeAccordion] = useState(false)
  const [openMeasuringTheRightWayAccordion, setMeasuringTheRightWayAccordion] =
    useState(false)
  const [openGuideAccordion, setOpenGuideAccordion] = useState(false)
  const router = useRouter()
  const { currentUser, refresh, setRefresh } = useAuth()
  const [isSurveyModalVisible, setSurveyModalVisible] = useState(false)

  useEffect(() => {
    const fetchBp = async () => {
      setIsLoading(true)
      const res = await getBpForTodayList({
        patientId: currentUser?.id!,
        dateTaken: moment().format('ll'),
      })
      setIsLoading(false)

      if (res.success) {
        setBpList(res.bpList)
      }
      setRefresh(0)
    }

    const fetchIfPatientDidSurvey = async () => {
      const data = await getPatientProfile(currentUser?.id!)

      if (!data.patient.didAnsweredSurvey && data.patient.didGenerateReport) {
        setSurveyModalVisible(true)
      }
    }

    fetchBp()
    fetchIfPatientDidSurvey()
  }, [refresh])

  if (isLoading) return <Spinner />

  return (
    <>
      <ChatBtn />

      <FlatList
        data={[]}
        renderItem={() => null}
        style={styles.mainContainer}
        ListHeaderComponent={
          <View style={styles.container}>
            <SurveyModal
              visible={isSurveyModalVisible}
              onClose={() => setSurveyModalVisible(false)}
              patientId={currentUser?.id!}
            />
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
            {bpList.length > 0 ? (
              <View style={{ gap: 20 }}>
                <BpIndexTable bpList={bpList} isLoading={isLoading} />
                <MyTouchableOpacity
                  style={styles.addBpToday}
                  onPress={() => router.push('/patient/add-new-bp')}
                >
                  <MyText style={{ color: 'white' }}>ADD MORE BP RECORD</MyText>
                </MyTouchableOpacity>
              </View>
            ) : (
              <View>
                <MyText
                  size="h3"
                  style={{ marginVertical: 20, textAlign: 'center' }}
                >
                  What is your BP for today?
                </MyText>
                <MyTouchableOpacity
                  style={styles.addBpToday}
                  onPress={() => router.push('/patient/add-new-bp')}
                >
                  <MyText style={{ color: 'white' }}>
                    ADD BP RECORD TODAY
                  </MyText>
                </MyTouchableOpacity>
              </View>
            )}
            <View style={styles.questionsContainer}>
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
                  <View style={styles.reminderTextContainer}>
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
                          <MyText style={{ color: COLORS.primary[500] }}>
                            &bull;
                          </MyText>
                          Pressure when your heart beats
                        </MyText>
                        <MyText style={styles.reminderText}>
                          <MyText style={{ color: COLORS.primary[500] }}>
                            &bull;
                          </MyText>
                          First number = Systolic (e.g., 120)
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
                        <MyText style={{ color: COLORS.primary[500] }}>
                          &bull;
                        </MyText>
                        Pressure between heartbeats
                      </MyText>
                      <MyText style={styles.reminderText}>
                        <MyText style={{ color: COLORS.primary[500] }}>
                          &bull;
                        </MyText>
                        Second number = Diastolic (e.g., 80)
                      </MyText>
                    </View>
                  </View>
                )}
              </MyTouchableOpacity>
              <MyTouchableOpacity
                style={styles.reminderContainer}
                onPress={() => setOpenWhenToTakeAccordion(open => !open)}
              >
                <View style={styles.reminderHeaderContainer}>
                  <MyText style={{ fontSize: 14 }}>Reminders</MyText>
                  <Ionicons
                    name="chevron-down"
                    size={24}
                    color={COLORS.secondary[900]}
                  />
                </View>
                {openWhenToTakeAccordion && (
                  <View style={styles.reminderTextContainer}>
                    <MyText style={styles.reminderText}>
                      <MyText style={{ color: COLORS.primary[500] }}>
                        &bull;
                      </MyText>
                      It is a prerequisite to have a BP monitoring device at
                      home, that detects systolic, diastolic, and pulse rate.
                    </MyText>
                  </View>
                )}
              </MyTouchableOpacity>
              <MyTouchableOpacity
                style={styles.reminderContainer}
                onPress={() => setMeasuringTheRightWayAccordion(open => !open)}
              >
                <View style={styles.reminderHeaderContainer}>
                  <MyText style={{ fontSize: 14 }}>Instructions</MyText>
                  <Ionicons
                    name="chevron-down"
                    size={24}
                    color={COLORS.secondary[900]}
                  />
                </View>
                {openMeasuringTheRightWayAccordion && (
                  <View style={styles.reminderTextContainer}>
                    <MyText style={styles.reminderText}>
                      <MyText style={{ color: COLORS.primary[500] }}>
                        &bull;
                      </MyText>
                      Measure your blood pressure twice a day—morning and late
                      afternoon—at about the same times every day for 7
                      consecutive days (unless you have been advised otherwise).
                    </MyText>
                    <MyText style={styles.reminderText}>
                      <MyText style={{ color: COLORS.primary[500] }}>
                        &bull;
                      </MyText>
                      On each occasion take a minimum of two readings, leaving
                      at least a minute between each. If the first two readings
                      are very different, take 2 or 3 further readings.
                    </MyText>
                    <MyText style={styles.reminderText}>
                      <MyText style={{ color: COLORS.primary[500] }}>
                        &bull;
                      </MyText>
                      In the comments section, you should also write down
                      anything that could have affected your reading, such as
                      feeling unwell or changes in your medication.
                    </MyText>
                    <MyText style={styles.reminderText}>
                      <MyText style={{ color: COLORS.primary[500] }}>
                        &bull;
                      </MyText>
                      For best results, sit comfortably with both feet on the
                      floor for at least two minutes before taking a
                      measurement.
                    </MyText>
                    <MyText style={styles.reminderText}>
                      <MyText style={{ color: COLORS.primary[500] }}>
                        &bull;
                      </MyText>
                      When you measure your blood pressure, rest your arm on a
                      table so the blood pressure cuff is at about the same
                      height as your heart.
                    </MyText>
                    <MyText style={styles.reminderText}>
                      <MyText style={{ color: COLORS.primary[500] }}>
                        &bull;
                      </MyText>
                      Take your blood pressure measurement before taking your
                      blood pressure medication.
                    </MyText>
                    <MyText style={styles.reminderText}>
                      <MyText style={{ color: COLORS.primary[500] }}>
                        &bull;
                      </MyText>
                      Measure at least two hours after a meal.
                    </MyText>
                    <MyText style={styles.reminderText}>
                      <MyText style={{ color: COLORS.primary[500] }}>
                        &bull;
                      </MyText>
                      Wait at least one hour after drinking coffee or smoking
                      before measuring.
                    </MyText>
                    <MyText style={styles.reminderText}>
                      <MyText style={{ color: COLORS.primary[500] }}>
                        &bull;
                      </MyText>
                      Wait at least 30 minutes after exercise before taking a
                      measurement.
                    </MyText>
                    <MyText style={styles.reminderText}>
                      <MyText style={{ color: COLORS.primary[500] }}>
                        &bull;
                      </MyText>
                      Record your blood pressure in this app and show it to your
                      doctor at EAC Medical Center – Cavite during every visit.
                    </MyText>
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
                  <View style={styles.reminderTextContainer}>
                    <MyText style={styles.reminderText}>
                      Your BP readings will be used to analyze patterns for over
                      a few days, weeks, or months of using our app. This will
                      essentially make it easier for our cardiologists to
                      understand your BP patterns and current medications and
                      better help you with your current treatment.
                    </MyText>
                  </View>
                )}
              </MyTouchableOpacity>
            </View>
          </View>
        }
      />
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 25,
    position: 'relative',
    marginBottom: 120,
  },
  mainContainer: {
    backgroundColor: 'white',
    flex: 1,
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
  bpContainer: {
    alignItems: 'center',
  },
  sysdiaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    gap: 10,
  },
  pulseRateContainer: {
    alignItems: 'center',
    gap: 10,
  },
  reminderContainer: {
    backgroundColor: COLORS.primary[100],
    padding: 15,
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
  reminderTextContainer: {
    marginTop: 10,
    gap: 15,
  },
  reminderText: {
    fontSize: 14,
    lineHeight: 20,
  },
  addBpToday: {
    backgroundColor: COLORS.primary[500],
    padding: 10,
    borderRadius: 15,
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  questionsContainer: {
    marginTop: 20,
    borderRadius: 15,
    paddingTop: 10,
  },
})

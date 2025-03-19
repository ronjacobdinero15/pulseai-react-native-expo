import Ionicons from '@expo/vector-icons/Ionicons'
import { useRouter } from 'expo-router'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { FlatList, StyleSheet, View } from 'react-native'
import BpIndexTable from '../../../components/BpIndexTable'
import MyText from '../../../components/MyText'
import MyTouchableOpacity from '../../../components/MyTouchableOpacity'
import Spinner from '../../../components/Spinner'
import { COLORS } from '../../../constants/Colors'
import { useAuth } from '../../../contexts/AuthContext'
import { getBpForTodayList } from '../../../services/apiMedication'

export default function HomeScreen() {
  const [bpList, setBpList] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [openHelpAccordion, setOpenHelpAccordion] = useState(false)
  const [openGuideAccordion, setOpenGuideAccordion] = useState(false)
  const router = useRouter()
  const { currentUser, refresh } = useAuth()

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
    }
    fetchBp()
  }, [refresh])

  if (isLoading) return <Spinner />

  return (
    <FlatList
      data={[]}
      renderItem={() => null}
      style={styles.mainContainer}
      ListHeaderComponent={
        <View style={styles.container}>
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
                <MyText style={{ color: 'white' }}>ADD BP RECORD TODAY</MyText>
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
  addBpToday: {
    backgroundColor: COLORS.success,
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

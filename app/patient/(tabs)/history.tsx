import MedicationCardItem from '@/components/MedicationCardItem'
import MyText from '@/components/MyText'
import MyTouchableOpacity from '@/components/MyTouchableOpacity'
import { COLORS } from '@/constants/colors'
import { DateListType } from '@/constants/dates'
import { Medication } from '@/constants/medication'
import { useAuth } from '@/contexts/AuthContext'
import { getMedicationList } from '@/services/apiMedication'
import { getPreviousDateRangeToDisplay } from '@/utils/helpers'
import { useRouter } from 'expo-router'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { FlatList, StyleSheet, View } from 'react-native'

export default function History() {
  const [medList, setMedList] = useState<Medication[]>([])
  const [dateRange, setDateRange] = useState<DateListType[]>([])
  const [selectedDate, setSelectedDate] = useState(
    moment().format('MM/DD/YYYY')
  )
  const { currentUser, isLoading, setIsLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    getDateList()
    fetchMedicationList(currentUser!.id!)
  }, [selectedDate])

  const getDateList = () => {
    const dates = getPreviousDateRangeToDisplay()
    setDateRange(dates)
    fetchMedicationList(currentUser!.id!)
  }

  const fetchMedicationList = async (patientId: string) => {
    const formattedDate = moment(selectedDate, 'MM/DD/YYYY').format(
      'MM/DD/YYYY'
    )
    setIsLoading(true)
    const res = await getMedicationList(patientId, formattedDate)

    if (res.success) {
      setMedList(res.medications)
    } else {
      setMedList([])
    }
    setIsLoading(false)
  }

  return (
    <FlatList
      data={[]}
      renderItem={() => null}
      style={styles.mainContainer}
      ListHeaderComponent={
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <MyText size="h3" style={{ color: COLORS.primary[500] }}>
              History of Medications
            </MyText>
          </View>

          <FlatList
            data={dateRange}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.dateRangeList}
            renderItem={({ item, index }) => (
              <MyTouchableOpacity
                style={[
                  styles.dateGroup,
                  {
                    backgroundColor:
                      item?.formattedDate === selectedDate
                        ? COLORS.primary[500]
                        : COLORS.secondary[200],
                  },
                ]}
                onPress={() => {
                  setSelectedDate(item?.formattedDate)
                  getMedicationList(currentUser?.id!, item?.formattedDate)
                }}
              >
                <MyText
                  size="h3"
                  style={{
                    color:
                      item?.formattedDate === selectedDate
                        ? 'white'
                        : COLORS.primary[900],
                  }}
                >
                  {item.day}
                </MyText>
                <MyText
                  size="h2"
                  style={{
                    fontSize: 26,
                    color:
                      item?.formattedDate === selectedDate
                        ? 'white'
                        : COLORS.primary[900],
                  }}
                >
                  {item.date}
                </MyText>
              </MyTouchableOpacity>
            )}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />

          {medList?.length > 0 ? (
            <FlatList
              data={medList}
              onRefresh={() => fetchMedicationList(currentUser?.id!)}
              refreshing={isLoading}
              renderItem={({ item, index }) => (
                <MyTouchableOpacity
                  style={{ height: 'auto' }}
                  onPress={() => {
                    router.push({
                      pathname: '/patient/action-modal',
                      params: {
                        ...item,
                        selectedDate,
                        actions: JSON.stringify(item.actions || []),
                        dates: JSON.stringify(item.dates || []),
                      },
                    })
                  }}
                >
                  <MedicationCardItem
                    medicine={item}
                    selectedDate={selectedDate}
                  />
                </MyTouchableOpacity>
              )}
            />
          ) : (
            <MyText
              size="h2"
              style={{
                padding: 30,
                color: COLORS.secondary[500],
                textAlign: 'center',
              }}
            >
              No Medication Found
            </MyText>
          )}
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
    padding: 25,
    backgroundColor: 'white',
    marginBottom: 100,
    justifyContent: 'center',
  },
  headerContainer: {
    height: 50,
    justifyContent: 'center',
  },
  imgBanner: {
    width: '100%',
    height: 200,
    borderRadius: 15,
    marginBottom: 15,
  },
  dateGroup: {
    padding: 15,
    backgroundColor: COLORS.secondary[200],
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    height: 'auto',
  },
  dateRangeList: {
    maxHeight: 100,
    marginVertical: 15,
  },
  separator: {
    width: 10,
  },
})

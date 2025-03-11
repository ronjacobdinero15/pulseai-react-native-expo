import EmptyMedication from '@/components/EmptyMedication'
import MedicationCardItem from '@/components/MedicationCardItem'
import MyText from '@/components/MyText'
import MyTouchableOpacity from '@/components/MyTouchableOpacity'
import Spinner from '@/components/Spinner'
import { COLORS } from '@/constants/Colors'
import { DateListType } from '@/constants/dates'
import { Medication } from '@/constants/medication'
import { useAuth } from '@/contexts/AuthContext'
import { getMedicationList } from '@/services/apiMedication'
import { getDatesRangeToDisplay } from '@/utils/helpers'
import { useRouter } from 'expo-router'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { FlatList, StyleSheet, View } from 'react-native'

function MedicationList() {
  const [medList, setMedList] = useState<Medication[]>([])
  const [dateRange, setDateRange] = useState<DateListType[]>([])
  const [selectedDate, setSelectedDate] = useState(
    moment().format('MM/DD/YYYY')
  )
  const { currentUser } = useAuth()
  const { refresh, setRefresh } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    getDateRangeList()
    if (currentUser?.id || refresh === 1) {
      fetchMedicationList(currentUser!.id!)
      setMedList([])
      setRefresh(0)
    }
  }, [selectedDate, refresh])

  const fetchMedicationList = async (patientId: string) => {
    const formattedDate = moment(selectedDate, 'MM/DD/YYYY').format(
      'MM/DD/YYYY'
    )
    setIsLoading(true)
    const res = await getMedicationList(patientId, formattedDate)
    if (res.success) {
      // console.log(JSON.stringify(res.medications, null, 2))
      setMedList(res.medications)
    }
    setIsLoading(false)
  }

  const getDateRangeList = () => {
    const dateRange = getDatesRangeToDisplay()
    setDateRange(dateRange)
  }

  return (
    <View style={styles.container}>
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
              // getMedicationList(currentUser?.id!, item?.formattedDate)
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

      {isLoading && medList?.length === 0 ? (
        <Spinner />
      ) : (
        <FlatList
          data={medList}
          onRefresh={() => fetchMedicationList(currentUser?.id!)}
          refreshing={isLoading}
          renderItem={({ item }) => (
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
              <MedicationCardItem medicine={item} selectedDate={selectedDate} />
            </MyTouchableOpacity>
          )}
        />
      )}

      {medList?.length === 0 && !isLoading && <EmptyMedication />}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  backgroundImg: {
    width: '100%',
    height: 200,
    borderRadius: 15,
  },
  dateRangeList: {
    maxHeight: 100,
    marginVertical: 15,
  },
  dateGroup: {
    padding: 15,
    backgroundColor: COLORS.secondary[200],
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    height: 'auto',
  },
  separator: {
    width: 10,
  },
})

export default MedicationList

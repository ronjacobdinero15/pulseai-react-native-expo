import EmptyMedication from '@/components/EmptyMedication'
import MedicationCardItem from '@/components/MedicationCardItem'
import MyText from '@/components/MyText'
import MyTouchableOpacity from '@/components/MyTouchableOpacity'
import { COLORS } from '@/constants/colors'
import { DateListType } from '@/constants/dates'
import { Medication } from '@/constants/medication'
import { useAuth } from '@/contexts/AuthContext'
import { getMedicationList } from '@/services/apiMedication'
import { getDatesRangeToDisplay } from '@/utils/helpers'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { FlatList, StyleSheet, View } from 'react-native'

function MedicationList() {
  const [medList, setMedList] = useState<Medication[]>([])
  const [dateRange, setDateRange] = useState<DateListType[]>([])
  const [selectedDate, setSelectedDate] = useState(
    moment().format('MM/DD/YYYY')
  )
  const { currentUser, isLoading, setIsLoading } = useAuth()
  const { refresh, setRefresh } = useAuth()

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
      {/* <Image
        source={require('@/assets/images/medication.jpeg')}
        style={styles.backgroundImg}
      /> */}

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

      {medList?.length > 0 ? (
        <FlatList
          data={medList}
          onRefresh={() => fetchMedicationList(currentUser?.id!)}
          refreshing={isLoading}
          renderItem={({ item, index }) => (
            <MedicationCardItem medicine={item} />
          )}
        />
      ) : (
        <EmptyMedication />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    // marginTop: 25,
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

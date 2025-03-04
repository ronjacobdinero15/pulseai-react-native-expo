import { DateListType } from '@/constants/dates'
import moment from 'moment'

export const formatDate = (timestamp: string) => {
  let date = new Date(timestamp).setHours(0, 0, 0, 0)
  return moment(date).format('ll')
}

export const formatTime = (timestamp: string) => {
  const date = new Date(timestamp)
  const timeString = date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  })

  return timeString
}

export const getDatesRange = (startDate: string, endDate: string) => {
  const start = moment(new Date(startDate), 'MM/DD/YYYY')
  const end = moment(new Date(endDate), 'MM/DD/YYYY')
  const dates = []

  while (start.isSameOrBefore(end)) {
    dates.push(start.format('MM/DD/YYYY'))
    start.add(1, 'days')
  }

  return dates
}

export const getDatesRangeToDisplay = () => {
  const dateList: DateListType[] = []
  for (let i = 0; i <= 7; i++) {
    dateList.push({
      date: moment().add(i, 'days').format('DD'), // 27
      day: moment().add(i, 'days').format('dd'), // Tue
      formattedDate: moment().add(i, 'days').format('L'), //12/27/2024
    })
  }

  return dateList
}

export const generateUniqueId = () => {
  return Date.now().toString()
}

import moment from 'moment'
import { DateListType } from '../constants/dates'

export const formatDateForText = (timestamp: string) => {
  return moment(timestamp, 'MM/DD/YYYY').format('ll')
}

export const formatDate = (timestamp: number) => {
  return moment(timestamp).format('L')
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
  const start = moment(startDate, 'MM/DD/YYYY')
  const end = moment(endDate, 'MM/DD/YYYY')
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

export const getPreviousDateRangeToDisplay = () => {
  const dates = []
  for (let i = 0; i <= 7; i++) {
    const date = moment().subtract(i, 'days')

    dates.push({
      date: date.format('DD'),
      day: date.format('dd'),
      formattedDate: date.format('L'),
    })
  }
  return dates
}

export const validateBpInput = (value: string) => {
  if (value === '') return true

  // Regex: must start with a nonzero digit, may have more digits,
  // and can optionally have a decimal point followed by 1-2 digits.
  const regex = /^[1-9]\d*(\.\d{1,2})?$/
  if (!regex.test(value)) {
    return 'Invalid input.'
  }

  const numValue = parseFloat(value)
  if (numValue > 300) {
    return 'Value must be less than or equal to 300.'
  }

  return true
}

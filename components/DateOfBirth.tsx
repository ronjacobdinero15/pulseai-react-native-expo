import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker'
import { useEffect, useState } from 'react'
import { Platform, Pressable, StyleSheet, View } from 'react-native'
import MyText from './MyText'
import MyTextInput from './MyTextInput'
import MyTouchableOpacity from './MyTouchableOpacity'

type DateOfBirthProps = {
  value: string
  onChange: (dateString: string) => void
}

function DateOfBirth({ value, onChange }: DateOfBirthProps) {
  const [date, setDate] = useState<Date>(() => {
    const parsedDate = new Date(value)
    return isNaN(parsedDate.getTime()) ? new Date() : parsedDate
  })
  const [showPicker, setShowPicker] = useState(false)

  useEffect(() => {
    const parsedDate = new Date(value)
    if (!isNaN(parsedDate.getTime())) {
      setDate(parsedDate)
    }
  }, [value])

  const handleToggleDatePicker = () => {
    setShowPicker(!showPicker)
  }

  const handleConfirmIOSDate = () => {
    onChange(formatDate(date))
    handleToggleDatePicker()
  }

  const handleDateOfBirthOnChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date
  ) => {
    if (event.type === 'set') {
      const currentDate = selectedDate || new Date()
      setDate(currentDate)

      if (Platform.OS === 'android') {
        handleToggleDatePicker()
        onChange(formatDate(currentDate))
      }
    } else {
      handleToggleDatePicker()
    }
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <View>
      {showPicker && (
        <DateTimePicker
          mode="date"
          display="spinner"
          value={date}
          onChange={handleDateOfBirthOnChange}
          style={styles.datePicker}
          minimumDate={new Date(1900, 0, 1)}
          maximumDate={new Date()}
        />
      )}

      {showPicker && Platform.OS === 'ios' && (
        <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
          <MyTouchableOpacity
            style={styles.pickerBtn}
            onPress={handleToggleDatePicker}
          >
            <MyText>Cancel</MyText>
          </MyTouchableOpacity>

          <MyTouchableOpacity
            style={styles.pickerBtn}
            onPress={handleConfirmIOSDate}
          >
            <MyText>Confirm</MyText>
          </MyTouchableOpacity>
        </View>
      )}

      <Pressable onPress={handleToggleDatePicker}>
        <MyTextInput
          placeholder="Date of Birth"
          value={value}
          editable={false}
          onPressIn={handleToggleDatePicker}
        />
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  datePicker: {
    height: 120,
    marginTop: -10,
  },
  pickerBtn: {
    paddingHorizontal: 20,
  },
})

export default DateOfBirth

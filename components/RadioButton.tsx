import MyText from '@/components/MyText'
import MyTouchableOpacity from '@/components/MyTouchableOpacity'
import { COLORS } from '@/constants/Colors'
import { StyleSheet, View } from 'react-native'

type RadioButtonProps = {
  selected: string
  options: string[]
  handleRadioPress: (item: string) => void
}

function RadioButton({
  selected,
  options,
  handleRadioPress,
}: RadioButtonProps) {
  return (
    <View style={styles.wrapper}>
      {options.map(item => (
        <View key={item} style={styles.radio}>
          <MyTouchableOpacity
            style={styles.radioBtn}
            onPress={() => handleRadioPress(item)}
          >
            {selected === item && <View style={styles.inner} />}
          </MyTouchableOpacity>
          <MyText size="h4">{item}</MyText>
        </View>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'baseline',
    marginTop: 10,
  },
  radio: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 5,
  },
  radioBtn: {
    width: 25,
    height: 25,
    borderWidth: 1,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inner: {
    width: 15,
    height: 15,
    backgroundColor: COLORS.primary[500],
    borderRadius: 10,
  },
})

export default RadioButton

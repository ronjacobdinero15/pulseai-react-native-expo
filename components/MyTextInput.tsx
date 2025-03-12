import { COLORS } from '../constants/Colors'
import React from 'react'
import {
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputProps,
  TextStyle,
} from 'react-native'

type MyTextInputProps = TextInputProps & {
  style?: StyleProp<TextStyle>
}

function MyTextInput({ style, ...rest }: MyTextInputProps) {
  return (
    <TextInput style={[styles.input, style]} {...rest} scrollEnabled={false} />
  )
}

const styles = StyleSheet.create({
  input: {
    height: 50,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: COLORS.secondary[200],
    borderRadius: 12,
    fontSize: 16,
    fontWeight: 500,
    color: COLORS.secondary[900],
  },
})

export default MyTextInput

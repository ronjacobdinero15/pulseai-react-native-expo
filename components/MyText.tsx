import { COLORS } from '../constants/Colors'
import React from 'react'
import { StyleProp, StyleSheet, Text, TextStyle } from 'react-native'

type MyTextProps = {
  style?: StyleProp<TextStyle>
  children: string | React.ReactNode
  size?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}

function MyText({ style, children, size = 'h5' }: MyTextProps) {
  return (
    <Text style={[{ color: COLORS.secondary[900] }, sizeStyles[size], style]}>
      {children}
    </Text>
  )
}

const sizeStyles = StyleSheet.create({
  h1: {
    fontWeight: 'bold',
    fontSize: 30,
  },
  h2: {
    fontWeight: 'bold',
    fontSize: 22,
  },
  h3: {
    fontWeight: 600,
    fontSize: 20,
  },
  h4: {
    fontWeight: 600,
    fontSize: 17,
  },
  h5: {
    fontWeight: 600,
    fontSize: 16,
  },
  h6: {
    fontWeight: 600,
    fontSize: 13,
  },
})

export default MyText

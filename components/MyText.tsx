import { COLORS } from '@/constants/colors'
import { SizeKeys, SIZES } from '@/constants/sizes'
import React from 'react'
import { StyleProp, StyleSheet, Text, TextStyle } from 'react-native'

type MyTextProps = {
  style?: StyleProp<TextStyle>
  children: string | React.ReactNode
  size?: SizeKeys
}

function MyText({ style, children, size = 'h5' }: MyTextProps) {
  return (
    <Text
      style={[
        baseStyles.text,
        sizeStyles[size],
        style,
        { fontSize: SIZES[size] },
      ]}
    >
      {children}
    </Text>
  )
}

const baseStyles = StyleSheet.create({
  text: {
    color: COLORS.secondary[900],
  },
})

const sizeStyles = StyleSheet.create({
  h1: {
    fontWeight: 700,
  },
  h2: {
    fontWeight: 700,
  },
  h3: {
    fontWeight: 600,
  },
  h4: {
    fontWeight: 600,
  },
  h5: {
    fontWeight: 600,
  },
  h6: {
    fontWeight: 600,
  },
})

export default MyText

import React from 'react'
import { View } from 'react-native'
import { COLORS } from '../constants/Colors'
import MyText from './MyText'

function ButtonLabel(label: string) {
  return (
    <View
      style={{
        padding: 12,
      }}
    >
      <MyText
        style={{
          color: COLORS.primary[500],
        }}
        size="h4"
      >
        {label}
      </MyText>
    </View>
  )
}

export default ButtonLabel

import MyText from '@/components/MyText'
import { COLORS } from '@/constants/colors'
import React from 'react'
import { View } from 'react-native'

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

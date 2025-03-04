import React from 'react'
import { StyleProp, TouchableOpacity, ViewStyle } from 'react-native'

type MyTouchableOpacityProps = {
  onPress: () => void
  style?: StyleProp<ViewStyle>
  disabled?: boolean
  children: React.ReactNode
}

function MyTouchableOpacity({
  onPress,
  style,
  disabled,
  children,
  ...rest
}: MyTouchableOpacityProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[{ height: 50, borderRadius: 8 }, style]}
      disabled={disabled}
      {...rest}
    >
      {children}
    </TouchableOpacity>
  )
}

export default MyTouchableOpacity

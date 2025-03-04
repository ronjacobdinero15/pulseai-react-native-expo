import { COLORS } from '@/constants/colors'
import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Dropdown } from 'react-native-element-dropdown'

type DropdownComponentProps = {
  label: string
  data: { label: string; value: string }[]
  value: string
  onChange: (value: string) => void
  onBlur: () => void
  backgroundColor?: string
}

function DropdownComponent({
  label,
  data,
  value,
  onChange,
  onBlur,
  backgroundColor = COLORS.secondary[100],
}: DropdownComponentProps) {
  return (
    <View style={styles.container}>
      <Dropdown
        style={[styles.dropdown, { backgroundColor }]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        data={data}
        labelField="label"
        valueField="value"
        placeholder={label}
        value={value}
        onChange={item => {
          onChange(item.value)
          onBlur()
        }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  dropdown: {
    height: 44,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  placeholderStyle: {
    fontSize: 16,
    color: COLORS.secondary[500],
  },
  selectedTextStyle: {
    fontSize: 14,
  },
})

export default DropdownComponent

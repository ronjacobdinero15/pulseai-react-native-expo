import { COLORS } from '@/constants/colors'
import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Dropdown } from 'react-native-element-dropdown'

type DropdownComponentProps = {
  label?: string
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
        placeholderStyle={styles.selectedTextStyle}
        selectedTextStyle={styles.selectedTextStyle}
        data={data}
        labelField="label"
        valueField="value"
        placeholder={value ? value : label}
        value={value}
        mode="modal"
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
    height: 50,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  selectedTextStyle: {
    fontSize: 16,
    fontWeight: 500,
    color: COLORS.secondary[900],
    lineHeight: 25,
  },
})

export default DropdownComponent

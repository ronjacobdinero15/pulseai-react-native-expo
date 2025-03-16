import React, { useState } from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { MultipleSelectList } from 'react-native-dropdown-select-list'
import { COLORS } from '../constants/Colors'

type MultipleSelectListCheckboxProps = {
  label: string
  data: string[]
  value: string[]
  onChange: (value: string[]) => void
  onBlur: () => void
}

const MultipleSelectListCheckbox: React.FC<MultipleSelectListCheckboxProps> = ({
  label,
  data,
  value,
  onChange,
  onBlur,
}) => {
  const [selected, setSelected] = useState<string[]>(value)

  const handleSelected = (val: string[] | ((prev: string[]) => string[])) => {
    const newVal = typeof val === 'function' ? val(selected) : val
    setSelected(newVal)
    onChange(newVal)
    onBlur()
  }

  return (
    <View>
      <TouchableOpacity activeOpacity={0.6} style={styles.touchable}>
        <MultipleSelectList
          setSelected={handleSelected}
          data={data}
          save="value"
          label={label}
          labelStyles={{ color: COLORS.primary[900] }}
          badgeStyles={{ backgroundColor: COLORS.primary[500] }}
          placeholder={label}
          search={false}
          notFoundText="No data exists"
          dropdownStyles={styles.dropdown}
          boxStyles={styles.multipleSelectList}
        />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  touchable: {
    backgroundColor: COLORS.secondary[100],
    borderRadius: 8,
  },
  multipleSelectList: {
    color: COLORS.secondary[500],
    backgroundColor: COLORS.secondary[100],
    borderWidth: 0,
    marginBottom: 0,
  },
  dropdown: {
    backgroundColor: COLORS.secondary[100],
    borderWidth: 0,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    marginTop: -10,
  },
})

export default MultipleSelectListCheckbox

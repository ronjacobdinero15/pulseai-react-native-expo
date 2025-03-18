import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import MyTouchableOpacity from './MyTouchableOpacity'
import { AntDesign } from '@expo/vector-icons'
import MyText from './MyText'

function DeletePatientAccount() {
  return (
    <MyTouchableOpacity
      style={styles.tabBtn}
      onPress={() => setShowAccountDeletionModal(true)}
    >
      <View style={styles.iconContainer}>
        <AntDesign name="delete" size={35} color={COLORS.primary[500]} />
      </View>
      <MyText size="h4">Erase all my data</MyText>
    </MyTouchableOpacity>
  )
}

const styles = StyleSheet.create({})

export default DeletePatientAccount

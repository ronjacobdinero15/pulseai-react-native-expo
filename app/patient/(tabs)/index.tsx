import MyText from '@/components/MyText'
import MyTouchableOpacity from '@/components/MyTouchableOpacity'
import { useAuth } from '@/contexts/AuthContext'
import React from 'react'
import { ScrollView, StyleSheet } from 'react-native'

export default function HomeScreen() {
  const { currentUser, patientSignOut } = useAuth()

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <MyTouchableOpacity onPress={patientSignOut} style={styles.btn}>
        <MyText>{currentUser?.id}</MyText>
        <MyText>{currentUser?.role}</MyText>
        <MyText>{currentUser?.firstName}</MyText>
        <MyText>Logout</MyText>
      </MyTouchableOpacity>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 10,
    height: '100%',
  },
  btn: {
    backgroundColor: 'red',
    flex: 1,
  },
})

import { useAuth } from '@/contexts/AuthContext'
import React from 'react'
import { ScrollView, StyleSheet } from 'react-native'

export default function HomeScreen() {
  const { currentUser, patientSignOut } = useAuth()

  return <ScrollView contentContainerStyle={styles.container}></ScrollView>
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

import MyText from '@/components/MyText'
import MyTouchableOpacity from '@/components/MyTouchableOpacity'
import { useAuth } from '@/contexts/AuthContext'
import React from 'react'
import { ScrollView, StyleSheet } from 'react-native'

export default function HomeScreen() {
  const { userToken, userRole, patientSignOut } = useAuth()

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <MyTouchableOpacity onPress={patientSignOut} style={styles.btn}>
        <MyText>{userToken}</MyText>
        <MyText>{userRole}</MyText>
        <MyText>Logout</MyText>
      </MyTouchableOpacity>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  btn: {
    backgroundColor: 'red',
    flex: 1,
  },
  container: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    height: '100%',
  },
})

/* 
import MyText from '@/components/MyText'
import MyTouchableOpacity from '@/components/MyTouchableOpacity'
import { useAuth } from '@/contexts/AuthContext'
import * as SecureStore from 'expo-secure-store'
import React, { useEffect, useState } from 'react'
import { ScrollView, StyleSheet } from 'react-native'

function ColorList({ color }: { color: string }) {
  const { userToken, userRole, patientSignOut } = useAuth()

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <MyTouchableOpacity onPress={patientSignOut} style={styles.btn}>
        <MyText>{userToken}</MyText>
        <MyText>{userRole}</MyText>
        <MyText>Logout</MyText>
      </MyTouchableOpacity>
    </ScrollView>
  )
}



export default ColorList

 */

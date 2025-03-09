import MyText from '@/components/MyText'
import MyTouchableOpacity from '@/components/MyTouchableOpacity'
import { useAuth } from '@/contexts/AuthContext'
import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

export default function HomeScreen() {
  const { userSignOut } = useAuth()

  return (
    <View style={styles.container}>
      <Text>YOO</Text>
      <MyTouchableOpacity onPress={() => userSignOut({ role: 'doctor' })}>
        <MyText>Logout</MyText>
      </MyTouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 25,
  },
})

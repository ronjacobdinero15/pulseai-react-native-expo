import { Link } from 'expo-router'
import React from 'react'
import { StyleSheet, View } from 'react-native'
import { COLORS } from '../constants/Colors'

export default function NotFoundScreen() {
  return (
    <View style={styles.container}>
      <Link href="/" style={styles.link}>
        Go back to Home screen!
      </Link>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  link: {
    fontSize: 20,
    textDecorationLine: 'underline',
  },
})

import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

export default function History() {
  return (
    <View style={styles.container}>
      <Text>history</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
})

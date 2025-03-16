import React from 'react'
import { FlatList, StyleSheet, View } from 'react-native'
import MedicationHeader from '../../../components/MedicationHeader'
import MedicationList from '../../../components/MedicationList'

export default function MedicationTracker() {
  return (
    <FlatList
      data={[]}
      renderItem={() => null}
      style={styles.mainContainer}
      ListHeaderComponent={
        <View style={styles.container}>
          <MedicationHeader />
          <MedicationList />
        </View>
      }
    />
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: 'white',
  },
  container: {
    flex: 1,
    padding: 25,
    backgroundColor: 'white',
    height: '100%',
    marginBottom: 100,
  },
})

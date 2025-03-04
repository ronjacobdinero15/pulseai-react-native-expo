import MyText from '@/components/MyText'
import { COLORS } from '@/constants/colors'
import { Medication, MEDICINES } from '@/constants/medication'
import Ionicons from '@expo/vector-icons/Ionicons'
import React from 'react'
import { Image, StyleSheet, View } from 'react-native'

function MedicationCardItem({ medicine }: { medicine: Medication }) {
  const medicineImg = MEDICINES.find(
    m => m.name.toLowerCase() === medicine.type.toLowerCase()
  )

  return (
    <View style={styles.container}>
      <View style={styles.subContainer}>
        <View style={{ flexDirection: 'row', maxWidth: '70%' }}>
          <View style={styles.imgContainer}>
            <Image source={medicineImg?.icon} style={styles.icon} />
          </View>
          <View>
            <MyText size="h2">{medicine?.medicationName}</MyText>
            <MyText style={{ color: COLORS.secondary[500], flexWrap: 'wrap' }}>
              {medicine?.frequency}
            </MyText>
            <MyText size="h6">
              {medicine?.dosage} {medicine.type}
            </MyText>
          </View>
        </View>

        <View style={styles.reminderContainer}>
          <Ionicons
            name="timer-outline"
            size={30}
            color={COLORS.primary[900]}
          />
          <MyText size="h2" style={{ fontSize: 15 }}>
            {medicine?.reminder}
          </MyText>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  subContainer: {
    width: '100%',
    borderWidth: 1,
    borderColor: COLORS.secondary[200],
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    marginBottom: 10,
  },
  imgContainer: {
    backgroundColor: 'white',
    padding: 10,
    height: '100%',
    borderRadius: 15,
    marginRight: 10,
    justifyContent: 'center',
  },
  icon: {
    width: 50,
    height: 50,
  },
  reminderContainer: {
    padding: 10,
    borderColor: COLORS.secondary[200],
    borderWidth: 1,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    gap: 5,
    minWidth: 100,
  },
})

export default MedicationCardItem

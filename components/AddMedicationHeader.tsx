import MyTouchableOpacity from '@/components/MyTouchableOpacity'
import { COLORS } from '@/constants/colors'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React from 'react'
import { Image, Platform, StyleSheet, View } from 'react-native'

function AddMedicationHeader() {
  const router = useRouter()

  return (
    <View style={styles.container}>
      <Image
        source={require('@/assets/images/consult.png')}
        style={styles.img}
      />
      <MyTouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color={COLORS.primary[900]} />
      </MyTouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    height: 280,
  },
  img: {
    height: '100%',
    width: '100%',
    resizeMode: 'cover',
  },
  backBtn: {
    position: 'absolute',
    top: Platform.select({ ios: 50, android: 25 }),
    left: 25,
    zIndex: 1,
  },
})

export default AddMedicationHeader

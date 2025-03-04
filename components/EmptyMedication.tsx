import MyText from '@/components/MyText'
import MyTouchableOpacity from '@/components/MyTouchableOpacity'
import { COLORS } from '@/constants/colors'
import { useRouter } from 'expo-router'
import { Image, StyleSheet, View } from 'react-native'

function EmptyMedication() {
  const router = useRouter()

  return (
    <View style={styles.container}>
      <Image
        source={require('@/assets/images/medicine.png')}
        style={styles.img}
      />

      <MyText style={{ marginTop: 30 }} size="h1">
        No Medications
      </MyText>

      <MyText
        style={{ textAlign: 'center', color: COLORS.secondary[400] }}
        size="h5"
      >
        You have 0 medication setup.{' '}
      </MyText>

      <MyTouchableOpacity
        style={styles.btn}
        onPress={() => router.push('/patient/add-new-medication')}
      >
        <MyText style={styles.btnText} size="h5">
          + Add New Medication
        </MyText>
      </MyTouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50,
    alignItems: 'center',
  },
  img: {
    width: 120,
    height: 120,
    marginLeft: 10,
  },
  btn: {
    backgroundColor: COLORS.primary[500],
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 30,
    width: '100%',
    justifyContent: 'center',
  },
  btnText: {
    color: 'white',
    textAlign: 'center',
  },
})

export default EmptyMedication

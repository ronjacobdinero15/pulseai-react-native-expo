import Ionicons from '@expo/vector-icons/Ionicons'
import { useRouter } from 'expo-router'
import { StyleSheet, View } from 'react-native'
import { COLORS } from '../constants/Colors'
import MyText from './MyText'
import MyTouchableOpacity from './MyTouchableOpacity'

function MedicationHeader() {
  const router = useRouter()

  return (
    <View style={styles.container}>
      <MyText style={{ color: COLORS.primary[500] }} size="h3">
        Medications
      </MyText>
      <MyTouchableOpacity
        onPress={() => router.push('/patient/add-new-medication')}
        style={styles.btn}
      >
        <Ionicons
          name="add-circle-outline"
          size={40}
          color={COLORS.primary[500]}
        />
      </MyTouchableOpacity>
    </View>
  )
}
export default MedicationHeader

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 50,
  },
  btn: {
    justifyContent: 'center',
  },
})

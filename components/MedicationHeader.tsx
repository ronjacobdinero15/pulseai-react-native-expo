import MyText from '@/components/MyText'
import MyTouchableOpacity from '@/components/MyTouchableOpacity'
import { COLORS } from '@/constants/Colors'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useRouter } from 'expo-router'
import { StyleSheet, View } from 'react-native'

function MedicationHeader() {
  const router = useRouter()

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
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
    </View>
  )
}
export default MedicationHeader

const styles = StyleSheet.create({
  container: {},
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 50,
  },
  btn: {
    justifyContent: 'center',
  },
})

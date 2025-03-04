import MyText from '@/components/MyText'
import MyTouchableOpacity from '@/components/MyTouchableOpacity'
import { COLORS } from '@/constants/colors'
import { useAuth } from '@/contexts/AuthContext'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useRouter } from 'expo-router'
import { Image, StyleSheet, View } from 'react-native'

function MedicationHeader() {
  const { currentUser } = useAuth()
  const router = useRouter()

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.welcomeContainer}>
          <Image
            source={require('@/assets/images/smiley.png')}
            style={{ width: 45, height: 45 }}
          />
          <MyText style={{ color: COLORS.primary[500] }} size="h3">
            Hello {currentUser?.firstName}
          </MyText>
        </View>

        <MyTouchableOpacity
          onPress={() => router.push('/patient/add-new-medication')}
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
  },
  welcomeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
})

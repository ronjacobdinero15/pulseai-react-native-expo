import { COLORS } from '@/constants/colors'
import { ActivityIndicator, StyleSheet, View } from 'react-native'

function Spinner() {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={70} color={COLORS.primary[500]} />
    </View>
  )
}
export default Spinner

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
})

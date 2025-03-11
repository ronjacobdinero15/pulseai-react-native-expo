import { COLORS } from '@/constants/Colors'
import { ActivityIndicator, StyleSheet, View } from 'react-native'

function Spinner() {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={70} color={COLORS.primary[500]} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
  },
})

export default Spinner

import MyText from '@/components/MyText'
import { COLORS } from '@/constants/Colors'
import { Modal, ScrollView, StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

type MyModalProps = {
  visible: boolean
  title: string
  children: React.ReactNode
}

function MyModal({ visible, title, children }: MyModalProps) {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      style={styles.modalMainContainer}
    >
      <SafeAreaView style={styles.safeAreaView}>
        <ScrollView contentContainerStyle={styles.scrollView}>
          <View style={styles.modalContainer}>
            <View style={styles.modalView}>
              <MyText size="h4" style={styles.modalTitle}>
                {title}
              </MyText>
              {children}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalMainContainer: {
    flex: 1,
  },
  safeAreaView: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    margin: 20,
    padding: 20,
    alignItems: 'center',
    width: '90%',
  },
  modalTitle: {
    marginBottom: 20,
    color: COLORS.primary[500],
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 17,
  },
})

export default MyModal

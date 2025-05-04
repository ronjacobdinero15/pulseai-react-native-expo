import { Modal, ScrollView, StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { COLORS } from '../constants/Colors'
import MyText from './MyText'

type MyModalProps = {
  visible: boolean
  title: string
  children: React.ReactNode
  onRequestClose?: () => void
  deletion?: boolean
}

function MyModal({
  visible,
  title,
  children,
  onRequestClose,
  deletion,
}: MyModalProps) {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      style={styles.modalMainContainer}
      onRequestClose={onRequestClose}
    >
      <SafeAreaView style={styles.safeAreaView}>
        <ScrollView contentContainerStyle={styles.scrollView}>
          <View style={styles.modalContainer}>
            <View style={styles.modalView}>
              <MyText
                size="h4"
                style={[
                  styles.modalTitle,
                  { color: deletion ? COLORS.error : COLORS.primary[500] },
                ]}
              >
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
    alignItems: 'stretch',
    width: '90%',
  },
  modalTitle: {
    marginBottom: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 17,
  },
})

export default MyModal

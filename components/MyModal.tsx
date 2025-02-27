import MyText from '@/components/MyText'
import { COLORS } from '@/constants/colors'
import { Modal, ScrollView, StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

type MyModalProps = {
  visible: boolean
  title: string
  children: React.ReactNode
}

function MyModal({ visible, title, children }: MyModalProps) {
  return (
    <Modal animationType="slide" transparent={true} visible={visible}>
      <SafeAreaView>
        <ScrollView>
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalView: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 20,
    margin: 20,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    marginBottom: 20,
    color: COLORS.primary[500],
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 18,
  },
})

export default MyModal

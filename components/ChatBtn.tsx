import { Ionicons } from '@expo/vector-icons'
import { COLORS } from '../constants/Colors'
import MyTouchableOpacity from './MyTouchableOpacity'
import { useChat } from '../contexts/ChatContext'
import { StyleSheet } from 'react-native'
import ChatBot from './ChatBot'

function ChatBtn() {
  const { showChat, hideChat, chatVisible } = useChat()

  return (
    <>
      <ChatBot visible={chatVisible} onClose={hideChat} />

      <MyTouchableOpacity style={styles.chatBtn} onPress={showChat}>
        <Ionicons name="chatbubble-ellipses-outline" size={40} color="white" />
      </MyTouchableOpacity>
    </>
  )
}

const styles = StyleSheet.create({
  chatBtn: {
    backgroundColor: COLORS.primary[500],
    position: 'absolute',
    bottom: 130,
    zIndex: 20,
    borderRadius: 50,
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
    right: 25,
  },
})

export default ChatBtn

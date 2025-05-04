import { createContext, useContext, useState } from 'react'

type ChatMessage = {
  role: 'user' | 'assistant'
  text: string
}

type ChatContextType = {
  messages: ChatMessage[]
  addMessage: (message: ChatMessage) => void
  replaceLastMessage: (message: ChatMessage) => void
  clearMessages: () => void
  basePrompt: string
  setBasePrompt: (prompt: string) => void
  chatVisible: boolean
  showChat: () => void
  hideChat: () => void
  loading: boolean
  setLoading: (loading: boolean) => void
}

const ChatContext = createContext<ChatContextType>({} as ChatContextType)

function ChatProvider({ children }: { children: React.ReactNode }) {
  const [chatVisible, setChatVisible] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [basePrompt, setBasePrompt] = useState('')
  const [loading, setLoading] = useState(true)

  const addMessage = (message: ChatMessage) => {
    setMessages(prev => [...prev, message])
  }

  const clearMessages = () => {
    setMessages([])
  }

  const replaceLastMessage = (message: ChatMessage) => {
    setMessages(prev => {
      const newMessages = [...prev]
      newMessages.pop()
      return [...newMessages, message]
    })
  }

  return (
    <ChatContext.Provider
      value={{
        messages,
        addMessage,
        replaceLastMessage,
        clearMessages,
        basePrompt,
        setBasePrompt,
        chatVisible,
        showChat: () => setChatVisible(true),
        hideChat: () => setChatVisible(false),
        loading,
        setLoading,
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

const useChat = () => {
  const context = useContext(ChatContext)

  if (!context)
    throw new Error('ChatContext was used outside of ChatContextProvider')

  return context
}

export { ChatProvider, useChat }

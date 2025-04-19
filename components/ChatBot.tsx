import { Ionicons } from '@expo/vector-icons'
import React, { useEffect, useState } from 'react'
import {
  ActivityIndicator,
  FlatList,
  Modal,
  StyleSheet,
  View,
} from 'react-native'
import { COLORS } from '../constants/Colors'
import { useAiPrompt } from '../hooks/useAiPrompt'
import MyText from './MyText'
import MyTextInput from './MyTextInput'
import MyTouchableOpacity from './MyTouchableOpacity'

const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY

async function fetchGeminiChat(
  prompt: string,
  question: string
): Promise<string> {
  console.log('[ChatBot] ▶️ Sending request to Gemini')
  const fullPrompt = `${prompt}\n\nQuestion: ${question}`
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: fullPrompt }] }] }),
      }
    )
    const json = await res.json()
    console.log('[ChatBot] ✅ Response:', json)
    const text = json.candidates?.[0]?.content?.parts?.[0]?.text?.trim()
    return text || 'No AI response available.'
  } catch (err) {
    console.error('[ChatBot] 🔴 Error', err)
    return 'AI unavailable.'
  }
}

export default function ChatBot({
  visible,
  onClose,
  patientId,
}: {
  visible: boolean
  onClose: () => void
  patientId: string
}) {
  const { fetchPatientInfo } = useAiPrompt()
  const [loading, setLoading] = useState(true)
  const [basePrompt, setBasePrompt] = useState<string>('')
  const [messages, setMessages] = useState<
    { role: 'user' | 'assistant'; text: string }[]
  >([])
  const [input, setInput] = useState('')

  useEffect(() => {
    if (!visible) return
    ;(async () => {
      setLoading(true)
      try {
        const { prompt } = await fetchPatientInfo({ patientId })
        setBasePrompt(prompt)
      } catch (error) {
        console.error('[ChatBot] 🔴 Error fetching patient info:', error)
      } finally {
        setLoading(false)
      }
    })()
  }, [visible, patientId])

  const send = async () => {
    if (!input.trim()) return
    const q = input.trim()
    setMessages(prev => [...prev, { role: 'user', text: q }])
    setInput('')
    setMessages(prev => [...prev, { role: 'assistant', text: '…thinking…' }])

    const resp = await fetchGeminiChat(basePrompt, q)
    setMessages(prev => {
      const copy = [...prev]
      copy.pop()
      return [...copy, { role: 'assistant', text: resp }]
    })
  }

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        <View style={styles.header}>
          <MyText size="h3">Chat about your data</MyText>
          <MyTouchableOpacity
            onPress={onClose}
            style={{ flexDirection: 'row', alignItems: 'center' }}
          >
            <Ionicons name="close" size={28} color={COLORS.error} />
          </MyTouchableOpacity>
        </View>
        {loading ? (
          <ActivityIndicator size="large" style={{ flex: 1 }} />
        ) : (
          <View style={styles.body}>
            <FlatList
              data={messages}
              keyExtractor={(_, i) => String(i)}
              renderItem={({ item }) => (
                <View
                  style={[
                    styles.bubble,
                    item.role === 'user' ? styles.userBubble : styles.aiBubble,
                  ]}
                >
                  <MyText>{item.text}</MyText>
                </View>
              )}
            />

            <View style={styles.inputRow}>
              <MyTextInput
                style={styles.input}
                value={input}
                onChangeText={setInput}
                placeholder="Ask a question…"
              />
              <MyTouchableOpacity onPress={send} style={styles.sendBtn}>
                <Ionicons name="send" size={24} color={COLORS.primary[500]} />
              </MyTouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  body: {
    flex: 1,
    marginTop: 12,
    marginHorizontal: 16,
  },
  bubble: {
    marginVertical: 4,
    padding: 8,
    borderRadius: 8,
    maxWidth: '80%',
  },
  userBubble: {
    backgroundColor: COLORS.primary[100],
    alignSelf: 'flex-end',
  },
  aiBubble: {
    backgroundColor: COLORS.secondary[100],
    alignSelf: 'flex-start',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: COLORS.secondary[200],
    paddingVertical: 16,
  },
  input: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: COLORS.secondary[200],
  },
  sendBtn: {
    marginLeft: 8,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
})

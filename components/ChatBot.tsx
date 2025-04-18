// components/ChatBot.tsx

import React, { useState, useEffect } from 'react'
import {
  Modal,
  View,
  FlatList,
  TextInput,
  ActivityIndicator,
  StyleSheet,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import MyTouchableOpacity from './MyTouchableOpacity'
import MyText from './MyText'
import { COLORS } from '../constants/Colors'
import { getPatientProfile } from '../services/apiAuth'
import { getBpList } from '../services/apiBp'
import { getMedicationList } from '../services/apiMedication'
import type { BpType } from '../constants/bp'
import type { Medication } from '../constants/medication'
import type { PatientProfileType } from '../constants/signup'

// direct Gemini via REST
const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY!

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

function buildBasePrompt(
  patientId: string,
  profile: PatientProfileType,
  bpList: BpType[],
  medicationList: Medication[]
): string {
  return `Patient ID: ${patientId}
Age: ${profile.age}
Gender: ${profile.gender}
Height: ${profile.bmiHeightCm} cm
Weight: ${profile.bmiWeightKg} kg
BP readings: ${bpList.map(b => `${b.dateTaken}: ${b.systolic}/${b.diastolic}`).join('; ')}
Medications: ${medicationList.map(m => m.medicationName).join(', ')}

Provide a concise clinical interpretation and recommendations based on the data above.`
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
      const resP = await getPatientProfile(patientId)
      // 🛠️ Pass an object, not a string
      const resB = await getBpList({ patientId })
      const resM = await getMedicationList({ patientId })
      const prompt = buildBasePrompt(
        patientId,
        resP.patient,
        resB.bpList || [],
        resM.medications || []
      )
      console.log('[ChatBot] Base prompt:', prompt)
      setBasePrompt(prompt)
      setLoading(false)
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
          <MyTouchableOpacity onPress={onClose}>
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
                    item.role === 'user'
                      ? styles.userBubble
                      : styles.aiBubble,
                  ]}
                >
                  <MyText>{item.text}</MyText>
                </View>
              )}
            />
            <View style={styles.inputRow}>
              <TextInput
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
  container: { flex: 1, backgroundColor: 'white', padding: 16 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  body: { flex: 1, marginTop: 12 },
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
    paddingTop: 8,
  },
  input: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: COLORS.secondary[200],
    borderRadius: 20,
  },
  sendBtn: {
    marginLeft: 8,
    padding: 8,
  },
})

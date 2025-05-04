import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { AuthProvider } from '../contexts/AuthContext'
import { ChatProvider } from '../contexts/ChatContext'

export default function RootLayout() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <AuthProvider>
        <ChatProvider>
          <Stack
            screenOptions={{ headerShown: false }}
            initialRouteName="index"
          >
            <Stack.Screen name="index" />
            <Stack.Screen name="doctor" />
            <Stack.Screen name="patient" />
            <Stack.Screen
              name="+not-found"
              options={{ title: 'Oops! Not Found' }}
            />
          </Stack>

          <StatusBar style="dark" />
        </ChatProvider>
      </AuthProvider>
    </SafeAreaView>
  )
}

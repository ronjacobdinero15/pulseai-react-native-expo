import { Stack } from 'expo-router'

export default function PatientLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }} initialRouteName="login">
      <Stack.Screen name="login" />
      <Stack.Screen name="forgot-password" />
      <Stack.Screen name="onboarding-screen" />
      <Stack.Screen name="signUp" />
      <Stack.Screen name="add-new-medication" />
      <Stack.Screen name="action-modal" options={{ presentation: 'modal' }} />

      <Stack.Screen name="(tabs)" />
    </Stack>
  )
}

import { Stack } from 'expo-router'

export default function DoctorLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }} initialRouteName="login">
      <Stack.Screen name="login" />
      <Stack.Screen name="update-profile" />
      <Stack.Screen name="update-password" />

      <Stack.Screen name="(tabs)" />
    </Stack>
  )
}

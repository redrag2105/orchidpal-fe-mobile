import { Stack } from 'expo-router'

export default function ModalsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        presentation: 'modal',
        animation: 'slide_from_bottom',
        contentStyle: { backgroundColor: '#f5f3f0' }
      }}
    >
      <Stack.Screen name='device-setup' options={{ gestureEnabled: false }} />
      <Stack.Screen name='add-plant' options={{ gestureEnabled: false }} />
      <Stack.Screen name='add-zone' options={{ gestureEnabled: false }} />
      <Stack.Screen name='help-center' options={{ gestureEnabled: true }} />
      <Stack.Screen name='privacy-policy' options={{ gestureEnabled: true }} />
    </Stack>
  )
}

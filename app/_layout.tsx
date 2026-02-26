import '@/global.css'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

export { ErrorBoundary } from 'expo-router'

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style='dark' />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name='index' />
        <Stack.Screen name='(auth)' />
        <Stack.Screen name='(dashboard)' />
      </Stack>
    </GestureHandlerRootView>
  )
}

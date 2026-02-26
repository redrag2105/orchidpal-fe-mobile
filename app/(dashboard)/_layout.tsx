import { Tabs } from 'expo-router'
import { Home } from 'lucide-react-native'

export default function DashboardLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: '#16a34a' }}>
      <Tabs.Screen
        name='index'
        options={{
          title: 'Trang chủ',
          tabBarIcon: ({ color }) => <Home size={24} color={color} />
        }}
      />
    </Tabs>
  )
}

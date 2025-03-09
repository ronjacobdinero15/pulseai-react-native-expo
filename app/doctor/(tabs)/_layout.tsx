import HomeScreen from '@/app/doctor/(tabs)'
import Profile from '@/app/doctor/(tabs)/profile'
import MyDoctorTabBar from '@/components/MyDoctorTabBar'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import React from 'react'

const Tab = createBottomTabNavigator()

export default function TabLayout() {
  return (
    <Tab.Navigator
      tabBar={props => <MyDoctorTabBar {...props} />}
      screenOptions={{ headerShown: false }}
      initialRouteName="index"
    >
      <Tab.Screen
        name="index"
        component={HomeScreen}
        options={{ title: 'Patients' }}
      />
      <Tab.Screen
        name="profile"
        component={Profile}
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  )
}

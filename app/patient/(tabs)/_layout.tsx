import HomeScreen from '@/app/patient/(tabs)/index'
import MedicationTracker from '@/app/patient/(tabs)/medication'
import MyTabBar from '@/components/MyTabBar'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import React from 'react'
import History from './history'
import Profile from './profile'

const Tab = createBottomTabNavigator()

export default function TabLayout() {
  return (
    <Tab.Navigator
      tabBar={props => <MyTabBar {...props} />}
      screenOptions={{ headerShown: false }}
      initialRouteName="index"
    >
      <Tab.Screen
        name="index"
        component={HomeScreen}
        options={{ title: 'Log' }}
      />
      <Tab.Screen
        name="medication"
        component={MedicationTracker}
        options={{ title: 'Medication' }}
      />
      <Tab.Screen
        name="history"
        component={History}
        options={{ title: 'History' }}
      />
      <Tab.Screen
        name="profile"
        component={Profile}
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  )
}

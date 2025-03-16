import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import React from 'react'
import HomeScreen from '.'
import MyDoctorTabBar from '../../../components/MyDoctorTabBar'
import Profile from './profile'

const Tab = createBottomTabNavigator()

export default function TabLayout() {
  return (
    <Tab.Navigator
      tabBar={props => <MyDoctorTabBar {...props} />}
      screenOptions={{ headerShown: false }}
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

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import React from 'react'
import HomeScreen from '.'
import MyPatientTabBar from '../../../components/MyPatientTabBar'
import History from './history'
import MedicationTracker from './medication'
import Profile from './profile'

const Tab = createBottomTabNavigator()

export default function TabLayout() {
  return (
    <Tab.Navigator
      tabBar={props => <MyPatientTabBar {...props} />}
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

import MyText from '@/components/MyText'
import MyTouchableOpacity from '@/components/MyTouchableOpacity'
import { COLORS } from '@/constants/colors'
import { useAuth } from '@/contexts/AuthContext'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React from 'react'
import { Image, StyleSheet, View } from 'react-native'

type Tab = {
  name: string
  icon: 'add-circle' | 'medkit' | 'time' | 'exit'
  path?:
    | '/patient/add-new-medication'
    | '/patient/medication'
    | '/patient/history'
}

export default function Profile() {
  const { currentUser, patientSignOut } = useAuth()
  const router = useRouter()

  const tabs: Tab[] = [
    {
      name: 'Add New Medication',
      icon: 'add-circle',
      path: '/patient/add-new-medication',
    },
    {
      name: 'My Medications',
      icon: 'medkit',
      path: '/patient/medication',
    },
    {
      name: 'History',
      icon: 'time',
      path: '/patient/history',
    },
    {
      name: 'Logout',
      icon: 'exit',
    },
  ]

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Image
          source={require('@/assets/images/smiley.png')}
          style={{ width: 60, height: 60 }}
        />
        <MyText size="h2">{currentUser?.firstName}</MyText>
        <MyText style={{ color: COLORS.secondary[400] }}>
          {currentUser?.email}
        </MyText>
      </View>

      <View style={styles.tabsContainer}>
        {tabs.map(tab => (
          <MyTouchableOpacity
            key={tab.name}
            style={styles.tabBtn}
            onPress={() => {
              if (tab.path) {
                router.push(tab.path)
              } else {
                patientSignOut()
              }
            }}
          >
            <View style={styles.iconContainer}>
              <Ionicons name={tab.icon} size={35} color={COLORS.primary[500]} />
            </View>
            <MyText size="h4">{tab.name}</MyText>
          </MyTouchableOpacity>
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 25,
  },
  headerContainer: {
    marginTop: 50,
    alignItems: 'center',
  },
  tabsContainer: {
    gap: 15,
    marginTop: 30,
  },
  tabBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    height: 'auto',
  },
  iconContainer: {
    backgroundColor: COLORS.primary[100],
    padding: 10,
    borderRadius: 15,
  },
})

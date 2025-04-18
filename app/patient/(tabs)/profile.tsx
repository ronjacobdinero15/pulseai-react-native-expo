import { Ionicons } from '@expo/vector-icons'
import AntDesign from '@expo/vector-icons/AntDesign'
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  StyleSheet,
  View,
} from 'react-native'
import MyModal from '../../../components/MyModal'
import MyText from '../../../components/MyText'
import MyTextInput from '../../../components/MyTextInput'
import MyTouchableOpacity from '../../../components/MyTouchableOpacity'
import { COLORS } from '../../../constants/Colors'
import { useAuth } from '../../../contexts/AuthContext'
import usePatientPdfView from '../../../hooks/usePdfView'
import { deletePatientAccountAndData } from '../../../services/apiAuth'
import ChatBot from '../../../components/ChatBot'


type Tab = {
  name: string
  icon: 'settings' | 'key' | 'exit' | 'delete' | 'file-tray-stacked-outline'
  path?:
    | '/patient/update-profile'
    | '/patient/update-password'
    | '/patient/generate-report'
}

export default function Profile() {
  const { currentUser, userSignOut } = useAuth()
  const router = useRouter()
  const [showChat, setShowChat] = useState(false)

  const [showAccountDeletionModal, setShowAccountDeletionModal] =
    useState(false)
  const [showPasswordConfirmModal, setShowPasswordConfirmModal] =
    useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  const tabs: Tab[] = [
    {
      name: 'Profile',
      icon: 'settings',
      path: '/patient/update-profile',
    },
    {
      name: 'Change Password',
      icon: 'key',
      path: '/patient/update-password',
    },
    {
      name: 'Logout',
      icon: 'exit',
    },
    {
      name: 'Generate BP report',
      icon: 'file-tray-stacked-outline',
      path: '/patient/generate-report',
    },
    {
      name: 'Erase all my data',
      icon: 'delete',
    },
  ]

  const handleDeletePatientAccount = async () => {
    if (!password) {
      setError('Please enter your password')
      return
    }

    setIsDeleting(true)
    const res = await deletePatientAccountAndData({
      patientId: currentUser?.id!,
      password,
    })

    if (res.success) {
      Alert.alert('Success', res.message, [
        {
          text: 'Great',
          onPress: () => {
            setShowAccountDeletionModal(false)
            userSignOut({ role: 'patient' })
            setIsDeleting(false)
          },
        },
      ])
    } else {
      setError(res.message)
      setIsDeleting(false)
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Image
          source={require('../../../assets/images/smiley.png')}
          style={{ width: 60, height: 60 }}
        />
        <MyText size="h2">{currentUser?.firstName}</MyText>
        <MyText style={{ color: COLORS.secondary[400] }}>
          {currentUser?.email}
        </MyText>
      </View>

      <FlatList
        data={[]}
        renderItem={() => null}
        ListHeaderComponent={
          <View style={styles.tabsContainer}>
            {tabs.map(tab => (
              <MyTouchableOpacity
                key={tab.name}
                style={[
                  styles.tabBtn,
                  tab.icon === 'file-tray-stacked-outline' && styles.divider,
                ]}
                onPress={() => {
                  if (tab.path) {
                    router.push(tab.path)
                  } else if (tab.name === 'Logout') {
                    userSignOut({ role: 'patient' })
                  } else if (tab.name === 'Erase all my data') {
                    setShowAccountDeletionModal(true)
                  }
                }}
                disabled={isDeleting}
              >
                <View style={styles.iconContainer}>
                  {tab.icon === 'delete' ? (
                    <AntDesign
                      name="delete"
                      size={35}
                      color={COLORS.primary[500]}
                    />
                  ) : (
                    <Ionicons
                      name={tab.icon}
                      size={35}
                      color={COLORS.primary[500]}
                    />
                  )}
                </View>

                <MyText size="h4">{tab.name}</MyText>
              </MyTouchableOpacity>
              
            ))}
              <MyTouchableOpacity
                style={[styles.tabBtn, styles.divider]}
                onPress={() => setShowChat(true)}
              >
                <View style={styles.iconContainer}>
                  <Ionicons
                  name="chatbubble-ellipses"
                  size={35}
                  color={COLORS.primary[500]}
                />
                </View>
                <MyText size="h4">Chat with AI</MyText>
              </MyTouchableOpacity>
            
          </View>
        }
      />

      <ChatBot
        visible={showChat}
        onClose={() => setShowChat(false)}
        patientId={currentUser!.id!}
      />

      <MyModal
        visible={showAccountDeletionModal}
        title="Confirm Account Deletion"
        onRequestClose={() => setShowAccountDeletionModal(false)}
      >
        {showPasswordConfirmModal ? (
          <View style={styles.modalContent}>
            <View style={{ marginBottom: 10 }}>
              <MyTextInput
                placeholder="Enter your password"
                secureTextEntry
                value={password}
                onChangeText={text => {
                  setPassword(text)
                  setError('')
                }}
                style={styles.passwordInput}
                autoCorrect={false}
                autoCapitalize="none"
              />
              {error && (
                <MyText style={{ color: COLORS.error }}>{error}</MyText>
              )}
            </View>

            <View style={styles.modalButtons}>
              <MyTouchableOpacity
                onPress={() => {
                  setShowAccountDeletionModal(false)
                  setShowPasswordConfirmModal(false)
                }}
                style={[
                  styles.modalButton,
                  { borderWidth: 1, borderColor: COLORS.secondary[200] },
                ]}
              >
                <MyText>Cancel</MyText>
              </MyTouchableOpacity>
              <MyTouchableOpacity
                onPress={handleDeletePatientAccount}
                style={[styles.modalButton, { backgroundColor: COLORS.error }]}
              >
                {isDeleting ? (
                  <ActivityIndicator size="large" color="white" />
                ) : (
                  <MyText style={{ color: 'white' }}>Delete</MyText>
                )}
              </MyTouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.modalContent}>
            <MyText style={{ textAlign: 'center', marginBottom: 20 }}>
              Are you sure you want to delete your account? This action cannot
              be undone.
            </MyText>

            <View style={styles.modalButtons}>
              <MyTouchableOpacity
                onPress={() => setShowAccountDeletionModal(false)}
                style={[
                  styles.modalButton,
                  { borderWidth: 1, borderColor: COLORS.secondary[200] },
                ]}
              >
                <MyText>No</MyText>
              </MyTouchableOpacity>
              <MyTouchableOpacity
                onPress={() => setShowPasswordConfirmModal(true)}
                style={[styles.modalButton, { backgroundColor: COLORS.error }]}
              >
                <MyText style={{ color: 'white' }}>Continue</MyText>
              </MyTouchableOpacity>
            </View>
          </View>
        )}
      </MyModal>
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
  divider: {
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: COLORS.secondary[200],
    borderRadius: 15,
  },
  passwordInput: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: COLORS.secondary[200],
    borderRadius: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    paddingHorizontal: 10,
    gap: 10,
  },
  modalButtons: {
    flexDirection: 'row',
    width: '100%',
    gap: 10,
  },
  modalButton: {
    padding: 10,
    alignItems: 'center',
    flex: 1,
  },
})

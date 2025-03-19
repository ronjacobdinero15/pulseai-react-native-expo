import NetInfo from '@react-native-community/netinfo'
import { useRouter } from 'expo-router'
import * as SecureStore from 'expo-secure-store'
import { createContext, useContext, useEffect, useState } from 'react'
import { Alert } from 'react-native'

type userSignInType = {
  id: string
  email: string
  firstName: string
  role: string
}

type CurrentUser = {
  id: string | null
  role: string | null
  email: string | null
  firstName: string | null
}

type AuthContextProps = {
  children: React.ReactNode
}

type AuthContextType = {
  isLoading: boolean
  refresh: number
  setRefresh: React.Dispatch<React.SetStateAction<number>>
  currentUser: CurrentUser | null
  setCurrentUser: React.Dispatch<React.SetStateAction<CurrentUser | null>>
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
  userSignIn: ({ id, email, firstName, role }: userSignInType) => Promise<void>
  userSignOut: ({ role }: { role: string }) => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

function AuthProvider({ children }: AuthContextProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [refresh, setRefresh] = useState(0)
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      if (!state.isConnected) {
        Alert.alert(
          'No Internet Connection',
          'Please check your internet connection and try again.'
        )
      }
    })

    const loadAuthState = async () => {
      try {
        const currentUserString = await SecureStore.getItemAsync('currentUser')

        if (currentUserString) {
          const currentUser = JSON.parse(currentUserString)

          if (currentUser.id && currentUser.role && currentUser.firstName) {
            setCurrentUser(currentUser)

            if (currentUser.role === 'patient') {
              router.replace('/patient/(tabs)')
            } else if (currentUser.role === 'doctor') {
              router.replace('/doctor/(tabs)')
            }
            return
          }
        }
        router.replace('/')
      } catch (error) {
        console.error('Failed to load auth state:', error)
        router.replace('/')
      }
    }
    loadAuthState()

    return () => {
      unsubscribe()
    }
  }, [])

  const userSignIn = async ({ id, email, firstName, role }: userSignInType) => {
    try {
      await SecureStore.setItemAsync(
        'currentUser',
        JSON.stringify({
          id: id?.trim(),
          email: email.trim(),
          role: role.trim(),
          firstName: firstName.trim(),
        })
      )
      setCurrentUser({ id, email, role, firstName })
    } catch (error) {
      console.error('Failed to sign in:', error)
    }
  }

  const userSignOut = async ({ role }: { role: string }) => {
    try {
      await SecureStore.deleteItemAsync('currentUser')
      setCurrentUser(null)

      if (role === 'patient') {
        router.replace('/')
      } else if (role === 'doctor') {
        router.replace('/doctor/login')
      }
    } catch (error) {
      console.error('Failed to sign out:', error)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        userSignIn,
        userSignOut,
        isLoading,
        setIsLoading,
        currentUser,
        setCurrentUser,
        refresh,
        setRefresh,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

function useAuth() {
  const context = useContext(AuthContext)

  if (!context)
    throw new Error('AuthContext was used outside of AuthContextProvider')

  return context
}

export { AuthProvider, useAuth }

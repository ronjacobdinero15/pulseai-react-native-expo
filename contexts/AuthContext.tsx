import { useRouter } from 'expo-router'
import * as SecureStore from 'expo-secure-store'
import { createContext, useContext, useEffect, useState } from 'react'

type AuthContextProps = {
  children: React.ReactNode
}

type AuthContextType = {
  isLoading: boolean
  userToken: string | null
  userRole: string | null
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
  patientSignIn: (userToken: string) => Promise<void>
  patientSignOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

function AuthProvider({ children }: AuthContextProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [userToken, setUserToken] = useState<string>('')
  const [userRole, setUserRole] = useState<string>('')
  const router = useRouter()

  useEffect(() => {
    const loadAuthState = async () => {
      try {
        const [userToken, userRole] = await Promise.all([
          SecureStore.getItemAsync('userToken'),
          SecureStore.getItemAsync('userRole'),
        ])

        if (userToken && userRole) {
          setUserToken(userToken)
          setUserRole(userRole)
          router.replace('/patient/(tabs)')
        } else {
          router.replace('/patient/login')
        }
      } catch (error) {
        console.error('Failed to load auth state:', error)
        router.replace('/patient/login')
      }
    }
    loadAuthState()
  }, [])

  const patientSignIn = async (userToken: string) => {
    try {
      await SecureStore.setItemAsync('userToken', userToken)
      await SecureStore.setItemAsync('userRole', 'patient')

      setUserToken(userToken)
      setUserRole('patient')

      console.log('LOGGED IN')
      router.replace('/patient/(tabs)')
    } catch (error) {
      console.error('Failed to sign in:', error)
    }
  }

  const patientSignOut = async () => {
    try {
      await SecureStore.deleteItemAsync('userToken')
      await SecureStore.deleteItemAsync('userRole')
      setUserToken('')
      setUserRole('')

      console.log('LOGGED OUT')
      router.replace('/patient/login')
    } catch (error) {
      console.error('Failed to sign out:', error)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        patientSignIn,
        patientSignOut,
        isLoading,
        setIsLoading,
        userToken,
        userRole,
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


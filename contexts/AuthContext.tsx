import { useRouter } from 'expo-router'
import * as SecureStore from 'expo-secure-store'
import { createContext, useContext, useEffect, useState } from 'react'

type CurrentUser = {
  id: string | null
  role: string | null
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
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
  patientSignIn: (userToken: string, firstName: string) => Promise<void>
  patientSignOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

function AuthProvider({ children }: AuthContextProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [refresh, setRefresh] = useState(0)
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null)
  const router = useRouter()

  useEffect(() => {
    const loadAuthState = async () => {
      try {
        const currentUserString = await SecureStore.getItemAsync('currentUser')

        if (currentUserString) {
          const currentUser = JSON.parse(currentUserString)

          if (currentUser.id && currentUser.role && currentUser.firstName) {
            setCurrentUser(currentUser)
            router.replace('/patient/(tabs)')
            return
          }
        }
        router.replace('/patient/login')
      } catch (error) {
        console.error('Failed to load auth state:', error)
        router.replace('/patient/login')
      }
    }
    loadAuthState()
  }, [])

  const patientSignIn = async (id: string, firstName: string) => {
    try {
      await SecureStore.setItemAsync(
        'currentUser',
        JSON.stringify({ id, role: 'patient', firstName })
      )
      setCurrentUser({ id, role: 'patient', firstName })

      console.log('LOGGED IN')
      router.replace('/patient/(tabs)')
    } catch (error) {
      console.error('Failed to sign in:', error)
    }
  }

  const patientSignOut = async () => {
    try {
      await SecureStore.deleteItemAsync('currentUser')
      setCurrentUser(null)

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
        currentUser,
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

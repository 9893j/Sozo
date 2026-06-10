import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { User } from 'firebase/auth'
import { onAuthChange, getUserProfile } from '@/firebase/auth'
import type { AppUser, UserRole } from '@/types'
import { ROLE_PERMISSIONS } from '@/types'

interface AuthContextValue {
  firebaseUser: User | null
  appUser:      AppUser | null
  loading:      boolean
  role:         UserRole | null
  can:          (permission: string) => boolean
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null)
  const [appUser, setAppUser]           = useState<AppUser | null>(null)
  const [loading, setLoading]           = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthChange(async (user) => {
      setFirebaseUser(user)

      if (user) {
        const profile = await getUserProfile(user.uid)
        setAppUser(profile)
      } else {
        setAppUser(null)
      }

      setLoading(false)
    })

    return unsubscribe
  }, [])

  function can(permission: string): boolean {
    if (!appUser) return false
    const perms = ROLE_PERMISSIONS[appUser.role]
    return perms.includes('*') || perms.includes(permission)
  }

  return (
    <AuthContext.Provider
      value={{
        firebaseUser,
        appUser,
        loading,
        role: appUser?.role ?? null,
        can,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth deve ser usado dentro de <AuthProvider>')
  return ctx
}

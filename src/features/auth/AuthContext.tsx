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
  refetch:      () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null)
  const [appUser, setAppUser]           = useState<AppUser | null>(null)
  const [loading, setLoading]           = useState(true)

  async function fetchProfile(user: User) {
    try {
      // timeout de 8s — evita spinner infinito se Firestore estiver offline
      const profile = await Promise.race([
        getUserProfile(user.uid),
        new Promise<null>((_, reject) =>
          setTimeout(() => reject(new Error('timeout')), 8000)
        ),
      ]) as AppUser | null
      setAppUser(profile)
    } catch (err) {
      console.warn('[AuthContext] Firestore offline ou timeout:', err)
      // Monta um perfil mínimo com os dados do Firebase Auth
      // para não travar o app — sem acesso ao Firestore
      setAppUser({
        uid:         user.uid,
        email:       user.email ?? '',
        displayName: user.displayName ?? 'Usuário',
        photoURL:    user.photoURL,
        role:        'membro',   // role mínimo seguro
        ministerios: [],
        phone:       null,
        active:      true,
        createdAt:   new Date().toISOString(),
        updatedAt:   new Date().toISOString(),
      })
    }
  }

  async function refetch() {
    if (firebaseUser) await fetchProfile(firebaseUser)
  }

  useEffect(() => {
    const unsubscribe = onAuthChange(async (user) => {
      setFirebaseUser(user)
      if (user) {
        await fetchProfile(user)
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
    <AuthContext.Provider value={{ firebaseUser, appUser, loading, role: appUser?.role ?? null, can, refetch }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth deve ser usado dentro de <AuthProvider>')
  return ctx
}

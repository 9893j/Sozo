import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/features/auth/AuthContext'
import { C } from '@/lib/tokens'
import type { UserRole } from '@/types'

// ─── Spinner fullscreen ───────────────────────
function FullPageSpinner() {
  return (
    <div style={{ minHeight: '100vh', background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="spinner" />
    </div>
  )
}

// ─── Protege qualquer rota autenticada ────────
export function PrivateRoute() {
  const { firebaseUser, loading } = useAuth()
  if (loading) return <FullPageSpinner />
  if (!firebaseUser) return <Navigate to="/login" replace />
  return <Outlet />
}

// ─── Protege por role mínimo ─────────────────
const ROLE_ORDER: UserRole[] = ['visitante', 'membro', 'lider', 'pastor', 'super_admin']

interface RoleGuardProps { minRole: UserRole; redirect?: string }

export function RoleGuard({ minRole, redirect = '/admin' }: RoleGuardProps) {
  const { appUser, loading } = useAuth()
  if (loading) return <FullPageSpinner />
  const userLevel = appUser ? ROLE_ORDER.indexOf(appUser.role) : -1
  const required  = ROLE_ORDER.indexOf(minRole)
  if (userLevel < required) return <Navigate to={redirect} replace />
  return <Outlet />
}

import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  type User,
} from 'firebase/auth'
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db, googleProvider } from './config'
import type { AppUser } from '@/types'

// ─── Login com Google ────────────────────────
export async function signInWithGoogle() {
  const result = await signInWithPopup(auth, googleProvider)
  await ensureUserDoc(result.user)
  return result.user
}

// ─── Login com email/senha ───────────────────
export async function signInWithEmail(email: string, password: string) {
  const result = await signInWithEmailAndPassword(auth, email, password)
  return result.user
}

// ─── Criar conta com email/senha ─────────────
export async function registerWithEmail(
  email: string,
  password: string,
  displayName: string,
) {
  const result = await createUserWithEmailAndPassword(auth, email, password)
  await updateProfile(result.user, { displayName })
  await ensureUserDoc(result.user, displayName)
  return result.user
}

// ─── Logout ──────────────────────────────────
export async function logOut() {
  await signOut(auth)
}

// ─── Ouvir mudanças de auth ──────────────────
export function onAuthChange(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback)
}

// ─── Buscar perfil completo do Firestore ─────
export async function getUserProfile(uid: string): Promise<AppUser | null> {
  const snap = await getDoc(doc(db, 'users', uid))
  if (!snap.exists()) return null
  return snap.data() as AppUser
}

// ─── Garantir que o doc do usuário existe ────
// Chamado após qualquer login; não sobrescreve dados existentes
async function ensureUserDoc(user: User, overrideName?: string) {
  const ref  = doc(db, 'users', user.uid)
  const snap = await getDoc(ref)

  if (!snap.exists()) {
    const newUser: Omit<AppUser, 'updatedAt'> & { updatedAt: unknown } = {
      uid:         user.uid,
      email:       user.email ?? '',
      displayName: overrideName ?? user.displayName ?? 'Sem nome',
      photoURL:    user.photoURL,
      role:        'membro',      // role padrão ao se cadastrar
      ministerios: [],
      phone:       null,
      active:      true,
      createdAt:   new Date().toISOString(),
      updatedAt:   serverTimestamp(),
    }
    await setDoc(ref, newUser)
  }
}

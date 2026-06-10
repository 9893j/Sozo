import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  type QueryConstraint,
} from 'firebase/firestore'
import { db } from './config'
import type { AppUser, Member, Evento, Escala, PrayerRequest, Post, Ministerio } from '@/types'

// ─── Helpers genéricos ───────────────────────
const col = (path: string) => collection(db, path)
const ref = (path: string, id: string) => doc(db, path, id)

async function getAll<T>(path: string, ...constraints: QueryConstraint[]): Promise<T[]> {
  const q = query(col(path), ...constraints)
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as T))
}

// ─── Usuários ────────────────────────────────
export const usersService = {
  getAll: () => getAll<AppUser>('users', orderBy('displayName')),

  getById: async (uid: string) => {
    const snap = await getDoc(ref('users', uid))
    return snap.exists() ? (snap.data() as AppUser) : null
  },

  update: (uid: string, data: Partial<AppUser>) =>
    updateDoc(ref('users', uid), { ...data, updatedAt: serverTimestamp() }),

  // Promover/rebaixar role — use com Firebase Admin SDK em produção
  setRole: (uid: string, role: AppUser['role']) =>
    updateDoc(ref('users', uid), { role, updatedAt: serverTimestamp() }),
}

// ─── Membros ─────────────────────────────────
export const membersService = {
  getAll: () => getAll<Member>('members', orderBy('name')),

  getByMinisterio: (ministerioId: string) =>
    getAll<Member>('members', where('ministerio', '==', ministerioId), orderBy('name')),

  create: (data: Omit<Member, 'id' | 'createdAt' | 'updatedAt'>) =>
    addDoc(col('members'), { ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp() }),

  update: (id: string, data: Partial<Member>) =>
    updateDoc(ref('members', id), { ...data, updatedAt: serverTimestamp() }),

  delete: (id: string) => deleteDoc(ref('members', id)),
}

// ─── Ministérios ─────────────────────────────
export const ministeriosService = {
  getAll: () => getAll<Ministerio>('ministerios', where('active', '==', true), orderBy('name')),

  create: (data: Omit<Ministerio, 'id' | 'createdAt'>) =>
    addDoc(col('ministerios'), { ...data, createdAt: serverTimestamp() }),

  update: (id: string, data: Partial<Ministerio>) =>
    updateDoc(ref('ministerios', id), data),
}

// ─── Eventos ─────────────────────────────────
export const eventosService = {
  getAll: () => getAll<Evento>('eventos', orderBy('date')),

  getPublished: () =>
    getAll<Evento>('eventos', where('status', '==', 'publicado'), orderBy('date')),

  create: (data: Omit<Evento, 'id' | 'createdAt'>) =>
    addDoc(col('eventos'), { ...data, createdAt: serverTimestamp() }),

  update: (id: string, data: Partial<Evento>) =>
    updateDoc(ref('eventos', id), data),

  delete: (id: string) => deleteDoc(ref('eventos', id)),
}

// ─── Escalas ─────────────────────────────────
export const escalasService = {
  getAll: () => getAll<Escala>('escalas', orderBy('date')),

  getByDate: (date: string) =>
    getAll<Escala>('escalas', where('date', '==', date)),

  create: (data: Omit<Escala, 'id' | 'createdAt'>) =>
    addDoc(col('escalas'), { ...data, createdAt: serverTimestamp() }),

  update: (id: string, data: Partial<Escala>) =>
    updateDoc(ref('escalas', id), data),

  delete: (id: string) => deleteDoc(ref('escalas', id)),
}

// ─── Pedidos de Oração ───────────────────────
export const prayerService = {
  getAll: () => getAll<PrayerRequest>('prayers', orderBy('createdAt', 'desc')),

  getActive: () =>
    getAll<PrayerRequest>('prayers', where('answered', '==', false), orderBy('createdAt', 'desc')),

  create: (data: Omit<PrayerRequest, 'id' | 'createdAt' | 'prayerCount'>) =>
    addDoc(col('prayers'), { ...data, prayerCount: 0, createdAt: serverTimestamp() }),

  incrementPrayer: async (id: string, current: number) =>
    updateDoc(ref('prayers', id), { prayerCount: current + 1 }),

  markAnswered: (id: string) =>
    updateDoc(ref('prayers', id), { answered: true }),
}

// ─── Posts / Comunicados ─────────────────────
export const postsService = {
  getAll: () => getAll<Post>('posts', orderBy('createdAt', 'desc')),

  getPublished: () =>
    getAll<Post>('posts', where('published', '==', true), orderBy('createdAt', 'desc')),

  create: (data: Omit<Post, 'id' | 'createdAt' | 'updatedAt' | 'likes'>) =>
    addDoc(col('posts'), { ...data, likes: 0, createdAt: serverTimestamp(), updatedAt: serverTimestamp() }),

  update: (id: string, data: Partial<Post>) =>
    updateDoc(ref('posts', id), { ...data, updatedAt: serverTimestamp() }),

  delete: (id: string) => deleteDoc(ref('posts', id)),
}

import { useEffect, useState } from 'react'
import { usersService } from '@/firebase/firestore'
import type { AppUser, UserRole } from '@/types'
import { ROLE_LABELS } from '@/types'
import { useAuth } from '@/features/auth/AuthContext'

const ROLE_OPTIONS: UserRole[] = ['membro', 'lider', 'pastor', 'super_admin']

const ROLE_BADGE: Record<UserRole, string> = {
  super_admin: 'badge badge-rose',
  pastor:      'badge badge-gold',
  lider:       'badge badge-sky',
  membro:      'badge badge-green',
  visitante:   'badge bg-stone-800 text-stone-400',
}

export default function UsersPage() {
  const { appUser: currentUser } = useAuth()
  const [users, setUsers]       = useState<AppUser[]>([])
  const [loading, setLoading]   = useState(true)
  const [search, setSearch]     = useState('')
  const [saving, setSaving]     = useState<string | null>(null)

  useEffect(() => {
    usersService.getAll()
      .then(setUsers)
      .finally(() => setLoading(false))
  }, [])

  async function changeRole(uid: string, role: UserRole) {
    if (uid === currentUser?.uid) return // não deixa se auto-rebaixar
    setSaving(uid)
    await usersService.setRole(uid, role)
    setUsers(prev => prev.map(u => u.uid === uid ? { ...u, role } : u))
    setSaving(null)
  }

  const filtered = users.filter(u =>
    u.displayName.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="font-serif text-2xl font-bold text-white">Usuários</h1>
          <p className="text-stone-500 text-sm mt-0.5">{users.length} contas cadastradas</p>
        </div>
      </div>

      {/* Search */}
      <div className="mb-5">
        <input
          className="field max-w-sm"
          placeholder="🔍 Buscar por nome ou email…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="card overflow-x-auto p-0">
        {loading ? (
          <div className="p-10 text-center text-stone-500">Carregando…</div>
        ) : filtered.length === 0 ? (
          <div className="p-10 text-center text-stone-500">Nenhum usuário encontrado.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-stone-800 text-left">
                <th className="px-4 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider">Usuário</th>
                <th className="px-4 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider">Email</th>
                <th className="px-4 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider">Ministérios</th>
                <th className="px-4 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider">Role</th>
                <th className="px-4 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(user => (
                <tr key={user.uid} className="border-b border-stone-800/50 hover:bg-stone-800/30 transition-colors">
                  {/* Avatar + nome */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center font-serif font-bold text-stone-950 text-xs flex-shrink-0">
                        {user.displayName[0]}
                      </div>
                      <span className="font-medium text-stone-100">{user.displayName}</span>
                      {user.uid === currentUser?.uid && (
                        <span className="text-[10px] text-stone-500 italic">(você)</span>
                      )}
                    </div>
                  </td>

                  {/* Email */}
                  <td className="px-4 py-3 text-stone-400">{user.email}</td>

                  {/* Ministérios */}
                  <td className="px-4 py-3 text-stone-400">
                    {user.ministerios.length > 0 ? user.ministerios.join(', ') : '—'}
                  </td>

                  {/* Role selector */}
                  <td className="px-4 py-3">
                    {user.uid === currentUser?.uid ? (
                      <span className={ROLE_BADGE[user.role]}>{ROLE_LABELS[user.role]}</span>
                    ) : (
                      <select
                        value={user.role}
                        disabled={saving === user.uid}
                        onChange={e => changeRole(user.uid, e.target.value as UserRole)}
                        className="field w-auto text-xs py-1 px-2 disabled:opacity-50"
                      >
                        {ROLE_OPTIONS.map(r => (
                          <option key={r} value={r}>{ROLE_LABELS[r]}</option>
                        ))}
                      </select>
                    )}
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3">
                    <span className={`badge ${user.active ? 'badge-green' : 'bg-stone-800 text-stone-500'}`}>
                      {user.active ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

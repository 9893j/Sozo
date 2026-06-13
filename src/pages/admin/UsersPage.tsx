import { useEffect, useState } from 'react'
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/firebase/config'
import { usersService } from '@/firebase/firestore'
import { useAuth } from '@/features/auth/AuthContext'
import { C } from '@/lib/tokens'
import type { AppUser, UserRole } from '@/types'
import { ROLE_LABELS } from '@/types'

// ─── Constantes ──────────────────────────────
const ROLES: UserRole[] = ['visitante', 'membro', 'lider', 'pastor', 'super_admin']

const ROLE_BADGE: Record<UserRole, { bg: string; color: string }> = {
  super_admin: { bg: 'rgba(196,82,26,0.18)', color: '#E06A2C' },
  pastor:      { bg: 'rgba(212,168,75,0.18)', color: '#D4A84B' },
  lider:       { bg: 'rgba(91,158,201,0.18)', color: '#5B9EC9' },
  membro:      { bg: 'rgba(82,183,136,0.18)', color: '#52B788' },
  visitante:   { bg: 'rgba(106,77,53,0.25)',  color: '#B09880' },
}

const ROLE_DESC: Record<UserRole, string> = {
  super_admin: 'Acesso total ao sistema',
  pastor:      'Painel completo + gestão de usuários',
  lider:       'Membros, escalas, eventos e oração',
  membro:      'Perfil, eventos e pedidos de oração',
  visitante:   'Somente landing page',
}

// ─── Modal de detalhes / edição ───────────────
interface ModalProps {
  user: AppUser
  currentUid: string
  onClose: () => void
  onSave: (uid: string, data: Partial<AppUser>) => Promise<void>
}

function UserModal({ user, currentUid, onClose, onSave }: ModalProps) {
  const [role, setRole]     = useState<UserRole>(user.role)
  const [active, setActive] = useState(user.active)
  const [saving, setSaving] = useState(false)
  const isSelf = user.uid === currentUid

  async function handleSave() {
    setSaving(true)
    await onSave(user.uid, { role, active })
    setSaving(false)
    onClose()
  }

  return (
    <div
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{ background: C.bg2, border: `1px solid ${C.lineHi}`, borderRadius: 10, padding: '36px 32px', maxWidth: 480, width: '100%', position: 'relative', fontFamily: '"Inter",system-ui,sans-serif' }}
      >
        {/* Top bar */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${C.primary}, transparent)`, borderRadius: '10px 10px 0 0' }} />

        <button onClick={onClose} style={{ position: 'absolute', top: 14, right: 14, background: 'none', border: 'none', color: C.gray2, fontSize: 20, cursor: 'pointer', minWidth: 36, minHeight: 36 }}>✕</button>

        {/* Avatar + nome */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28 }}>
          <div style={{ width: 52, height: 52, borderRadius: '50%', background: `linear-gradient(135deg, ${C.primary}, ${C.primaryL})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 20, color: C.white, flexShrink: 0 }}>
            {user.displayName?.[0]?.toUpperCase() ?? '?'}
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 18, color: C.white }}>{user.displayName}</div>
            <div style={{ fontSize: 13, color: C.gray2 }}>{user.email}</div>
            {isSelf && <div style={{ fontSize: 11, color: C.primary, fontWeight: 600, marginTop: 2 }}>— você</div>}
          </div>
        </div>

        {/* Role selector */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: C.gray3, marginBottom: 12 }}>Nível de acesso</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {ROLES.map(r => (
              <button
                key={r}
                disabled={isSelf}
                onClick={() => setRole(r)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '12px 16px', borderRadius: 6, cursor: isSelf ? 'not-allowed' : 'pointer',
                  background: role === r ? `rgba(196,82,26,0.1)` : C.bg3,
                  border: `1px solid ${role === r ? C.primary : C.line}`,
                  opacity: isSelf ? 0.5 : 1,
                  transition: 'all 0.15s',
                  fontFamily: '"Inter",system-ui,sans-serif',
                }}
              >
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: role === r ? C.primaryL : C.white }}>{ROLE_LABELS[r]}</div>
                  <div style={{ fontSize: 12, color: C.gray3, marginTop: 2 }}>{ROLE_DESC[r]}</div>
                </div>
                <div style={{ width: 18, height: 18, borderRadius: '50%', border: `2px solid ${role === r ? C.primary : C.lineHi}`, background: role === r ? C.primary : 'transparent', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {role === r && <div style={{ width: 6, height: 6, borderRadius: '50%', background: C.white }} />}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Status ativo */}
        <div style={{ marginBottom: 28, padding: '14px 16px', background: C.bg3, border: `1px solid ${C.line}`, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: 14, color: C.white }}>Conta ativa</div>
            <div style={{ fontSize: 12, color: C.gray3, marginTop: 2 }}>Usuário inativo não consegue acessar o painel</div>
          </div>
          <button
            disabled={isSelf}
            onClick={() => setActive(v => !v)}
            style={{
              width: 44, height: 24, borderRadius: 12, border: 'none', cursor: isSelf ? 'not-allowed' : 'pointer',
              background: active ? C.primary : C.lineHi,
              position: 'relative', transition: 'background 0.2s', flexShrink: 0,
              opacity: isSelf ? 0.5 : 1,
            }}
          >
            <div style={{ width: 18, height: 18, borderRadius: '50%', background: C.white, position: 'absolute', top: 3, left: active ? 23 : 3, transition: 'left 0.2s' }} />
          </button>
        </div>

        {/* Ações */}
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={handleSave}
            disabled={saving || isSelf}
            className="btn-primary"
            style={{ flex: 1, fontSize: 15, padding: '13px', minHeight: 48 }}
          >
            {saving ? 'Salvando...' : 'Salvar alterações'}
          </button>
          <button onClick={onClose} className="btn-ghost" style={{ padding: '13px 20px', minHeight: 48 }}>
            Cancelar
          </button>
        </div>

        {isSelf && (
          <p style={{ fontSize: 12, color: C.gray3, textAlign: 'center', marginTop: 12 }}>
            Você não pode editar seu próprio usuário
          </p>
        )}
      </div>
    </div>
  )
}

// ─── Modal de convite / criar usuário ─────────
function InviteModal({ onClose }: { onClose: () => void }) {
  const [email, setEmail]   = useState('')
  const [role, setRole]     = useState<UserRole>('membro')
  const [copied, setCopied] = useState(false)

  const link = `${window.location.origin}/login`

  function copyLink() {
    navigator.clipboard.writeText(`Olá! Você foi convidado para a plataforma Sozo Comunidade Cristã.\n\nAcesse: ${link}\n\nCrie sua conta com o email: ${email || 'seu email'}\nSeu acesso será configurado como: ${ROLE_LABELS[role]}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: C.bg2, border: `1px solid ${C.lineHi}`, borderRadius: 10, padding: '36px 32px', maxWidth: 440, width: '100%', position: 'relative', fontFamily: '"Inter",system-ui,sans-serif' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${C.primary}, transparent)`, borderRadius: '10px 10px 0 0' }} />
        <button onClick={onClose} style={{ position: 'absolute', top: 14, right: 14, background: 'none', border: 'none', color: C.gray2, fontSize: 20, cursor: 'pointer' }}>✕</button>

        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', color: C.primary, marginBottom: 8 }}>Convidar pessoa</div>
        <h3 style={{ fontWeight: 900, fontSize: 22, color: C.white, letterSpacing: '-0.5px', marginBottom: 6 }}>Adicionar à comunidade</h3>
        <p style={{ fontSize: 14, color: C.gray2, marginBottom: 24, lineHeight: 1.6 }}>
          A pessoa cria a conta pelo link e você define o nível de acesso após o primeiro login.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: C.gray3, marginBottom: 8 }}>Email do convidado</div>
            <input className="field" placeholder="nome@email.com" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: C.gray3, marginBottom: 8 }}>Nível de acesso inicial</div>
            <select className="field" value={role} onChange={e => setRole(e.target.value as UserRole)} style={{ cursor: 'pointer' }}>
              {ROLES.map(r => <option key={r} value={r}>{ROLE_LABELS[r]} — {ROLE_DESC[r]}</option>)}
            </select>
          </div>
        </div>

        {/* Preview do link */}
        <div style={{ background: C.bg3, border: `1px solid ${C.line}`, borderRadius: 6, padding: '12px 14px', marginBottom: 20 }}>
          <div style={{ fontSize: 11, color: C.gray3, marginBottom: 4 }}>Link de acesso</div>
          <div style={{ fontSize: 13, color: C.primary, fontWeight: 600, wordBreak: 'break-all' }}>{link}</div>
        </div>

        <button onClick={copyLink} className="btn-primary" style={{ width: '100%', fontSize: 15, padding: '13px', minHeight: 48 }}>
          {copied ? '✓ Mensagem copiada!' : 'Copiar mensagem de convite'}
        </button>
        <p style={{ fontSize: 12, color: C.gray3, textAlign: 'center', marginTop: 12, lineHeight: 1.6 }}>
          Após o cadastro, defina o role na tabela de usuários.
        </p>
      </div>
    </div>
  )
}

// ─── Page principal ───────────────────────────
export default function UsersPage() {
  const { appUser: currentUser } = useAuth()
  const [users, setUsers]         = useState<AppUser[]>([])
  const [loading, setLoading]     = useState(true)
  const [search, setSearch]       = useState('')
  const [filterRole, setFilterRole] = useState<UserRole | 'all'>('all')
  const [selected, setSelected]   = useState<AppUser | null>(null)
  const [showInvite, setShowInvite] = useState(false)

  useEffect(() => {
    usersService.getAll()
      .then(setUsers)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  async function handleSave(uid: string, data: Partial<AppUser>) {
    await updateDoc(doc(db, 'users', uid), { ...data, updatedAt: serverTimestamp() })
    setUsers(prev => prev.map(u => u.uid === uid ? { ...u, ...data } : u))
  }

  const filtered = users.filter(u => {
    const matchSearch = u.displayName.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
    const matchRole   = filterRole === 'all' || u.role === filterRole
    return matchSearch && matchRole
  })

  // Contagens por role
  const counts = users.reduce((acc, u) => {
    acc[u.role] = (acc[u.role] ?? 0) + 1
    return acc
  }, {} as Record<string, number>)

  return (
    <div style={{ fontFamily: '"Inter",system-ui,sans-serif' }}>
      {selected && <UserModal user={selected} currentUid={currentUser?.uid ?? ''} onClose={() => setSelected(null)} onSave={handleSave} />}
      {showInvite && <InviteModal onClose={() => setShowInvite(false)} />}

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 className="page-title">Usuários</h1>
          <p className="page-sub">{users.length} contas cadastradas</p>
        </div>
        <button onClick={() => setShowInvite(true)} className="btn-primary" style={{ fontSize: 14, padding: '10px 20px', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 18 }}>+</span> Convidar pessoa
        </button>
      </div>

      {/* Cards de resumo por role */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 10, marginBottom: 24 }}>
        {ROLES.slice().reverse().map(r => (
          <button
            key={r}
            onClick={() => setFilterRole(filterRole === r ? 'all' : r)}
            style={{
              background: filterRole === r ? `rgba(196,82,26,0.1)` : C.bg2,
              border: `1px solid ${filterRole === r ? C.primary : C.line}`,
              borderRadius: 8, padding: '14px 12px', cursor: 'pointer',
              textAlign: 'left', transition: 'all 0.15s',
              fontFamily: '"Inter",system-ui,sans-serif',
            }}
          >
            <div style={{ fontWeight: 900, fontSize: 26, color: filterRole === r ? C.primaryL : C.white, letterSpacing: '-1px' }}>
              {counts[r] ?? 0}
            </div>
            <div style={{ fontSize: 11, fontWeight: 700, color: ROLE_BADGE[r].color, marginTop: 4 }}>{ROLE_LABELS[r]}</div>
          </button>
        ))}
      </div>

      {/* Filtros */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        <input
          className="field"
          placeholder="🔍  Buscar por nome ou email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ maxWidth: 320 }}
        />
        {filterRole !== 'all' && (
          <button
            onClick={() => setFilterRole('all')}
            style={{ background: `rgba(196,82,26,0.1)`, border: `1px solid ${C.primaryD}`, borderRadius: 5, padding: '0 14px', color: C.primaryL, fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, minHeight: 48, fontFamily: '"Inter",system-ui,sans-serif' }}
          >
            {ROLE_LABELS[filterRole]} ✕
          </button>
        )}
      </div>

      {/* Tabela */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 48, textAlign: 'center' }}>
            <div className="spinner" style={{ margin: '0 auto' }} />
            <p style={{ color: C.gray3, marginTop: 14, fontSize: 14 }}>Carregando usuários...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: 48, textAlign: 'center', color: C.gray3, fontSize: 15 }}>
            {search ? `Nenhum resultado para "${search}"` : 'Nenhum usuário encontrado.'}
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${C.line}` }}>
                {['Usuário', 'Email', 'Role', 'Status', 'Ações'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 10, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: C.gray3 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(user => {
                const badge = ROLE_BADGE[user.role]
                const isSelf = user.uid === currentUser?.uid
                return (
                  <tr key={user.uid} className="table-row">
                    {/* Usuário */}
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 36, height: 36, borderRadius: '50%', background: `linear-gradient(135deg, ${C.primary}, ${C.primaryL})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 14, color: C.white, flexShrink: 0 }}>
                          {user.displayName?.[0]?.toUpperCase() ?? '?'}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 14, color: C.white }}>
                            {user.displayName}
                            {isSelf && <span style={{ fontSize: 11, color: C.primary, marginLeft: 8 }}>você</span>}
                          </div>
                          <div style={{ fontSize: 11, color: C.gray3 }}>uid: {user.uid.slice(0, 8)}...</div>
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td style={{ padding: '14px 16px', fontSize: 13, color: C.gray2 }}>{user.email}</td>

                    {/* Role */}
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ background: badge.bg, color: badge.color, fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 3, letterSpacing: '1px', textTransform: 'uppercase' }}>
                        {ROLE_LABELS[user.role]}
                      </span>
                    </td>

                    {/* Status */}
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ background: user.active ? 'rgba(82,183,136,0.15)' : 'rgba(106,77,53,0.2)', color: user.active ? '#52B788' : C.gray3, fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 3, textTransform: 'uppercase', letterSpacing: '1px' }}>
                        {user.active ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>

                    {/* Ações */}
                    <td style={{ padding: '14px 16px' }}>
                      <button
                        onClick={() => setSelected(user)}
                        style={{ background: 'none', border: `1px solid ${C.lineHi}`, borderRadius: 5, padding: '7px 14px', color: C.gray2, fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s', fontFamily: '"Inter",system-ui,sans-serif' }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = C.primary; e.currentTarget.style.color = C.primaryL }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = C.lineHi; e.currentTarget.style.color = C.gray2 }}
                      >
                        Editar →
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Rodapé da tabela */}
      {!loading && filtered.length > 0 && (
        <div style={{ marginTop: 12, fontSize: 13, color: C.gray3, textAlign: 'right' }}>
          {filtered.length} de {users.length} usuários
        </div>
      )}
    </div>
  )
}

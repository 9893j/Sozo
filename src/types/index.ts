// ─────────────────────────────────────────────
//  Roles e permissões
// ─────────────────────────────────────────────
export type UserRole = 'super_admin' | 'pastor' | 'lider' | 'membro' | 'visitante'

export const ROLE_LABELS: Record<UserRole, string> = {
  super_admin: 'Super Admin',
  pastor:      'Pastor',
  lider:       'Líder',
  membro:      'Membro',
  visitante:   'Visitante',
}

// O que cada role pode fazer
export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  super_admin: ['*'],
  pastor:      ['dashboard', 'members', 'events', 'escalas', 'ministerios', 'prayer', 'posts', 'live', 'users'],
  lider:       ['dashboard', 'members:read', 'events:read', 'escalas', 'ministerios:read', 'prayer'],
  membro:      ['profile', 'events:read', 'prayer', 'posts:read'],
  visitante:   [],
}

// ─────────────────────────────────────────────
//  Usuário (Firebase Auth + Firestore /users/{uid})
// ─────────────────────────────────────────────
export interface AppUser {
  uid:         string
  email:       string
  displayName: string
  photoURL:    string | null
  role:        UserRole
  ministerios: string[]      // IDs dos ministérios vinculados
  phone:       string | null
  createdAt:   string        // ISO date
  updatedAt:   string
  active:      boolean
}

// ─────────────────────────────────────────────
//  Membro (pode ser diferente de usuário — ex: criança)
// ─────────────────────────────────────────────
export interface Member {
  id:          string
  name:        string
  email:       string | null
  phone:       string | null
  ministerio:  string | null  // ID do ministério principal
  funcao:      string | null  // ex: "Guitarrista", "Intercession Lead"
  status:      'ativo' | 'inativo'
  userUid:     string | null  // vínculo com conta, se houver
  createdAt:   string
  updatedAt:   string
}

// ─────────────────────────────────────────────
//  Ministério
// ─────────────────────────────────────────────
export interface Ministerio {
  id:          string
  name:        string
  description: string
  iconKey:     string
  /** @deprecated campo legado — mantido apenas para registros antigos do Firestore */
  emoji?:      string
  liderUid:    string | null
  membersCount: number
  active:      boolean
  createdAt:   string
}

// ─────────────────────────────────────────────
//  Evento
// ─────────────────────────────────────────────
export interface Evento {
  id:          string
  title:       string
  description: string
  date:        string   // ISO
  time:        string   // "19:00"
  local:       string
  iconKey:     string
  /** @deprecated campo legado — mantido apenas para registros antigos do Firestore */
  emoji?:      string
  inscritos:   number
  maxInscritos: number | null
  status:      'rascunho' | 'publicado' | 'encerrado'
  createdBy:   string
  createdAt:   string
}

// ─────────────────────────────────────────────
//  Escala
// ─────────────────────────────────────────────
export interface Escala {
  id:          string
  memberUid:   string
  memberName:  string
  ministerioId: string
  funcao:      string
  date:        string
  time:        string
  status:      'confirmado' | 'pendente' | 'ausente'
  createdAt:   string
}

// ─────────────────────────────────────────────
//  Pedido de Oração
// ─────────────────────────────────────────────
export type PrayerCategory = 'cura' | 'familia' | 'provisao' | 'libertacao' | 'gratidao' | 'outro'

export interface PrayerRequest {
  id:          string
  text:        string
  category:    PrayerCategory
  anonymous:   boolean
  authorUid:   string | null
  authorName:  string
  prayerCount: number
  answered:    boolean
  createdAt:   string
}

// ─────────────────────────────────────────────
//  Post / Comunicado
// ─────────────────────────────────────────────
export type PostCategory = 'palavra' | 'eventos' | 'oracao' | 'aviso' | 'testemunho'

export interface Post {
  id:          string
  title:       string
  body:        string
  category:    PostCategory
  authorUid:   string
  authorName:  string
  imageUrl:    string | null
  likes:       number
  published:   boolean
  createdAt:   string
  updatedAt:   string
}

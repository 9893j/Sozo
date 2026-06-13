import { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '@/features/auth/AuthContext'
import { logOut } from '@/firebase/auth'
import { SozoLogo } from '@/components/ui'
import { C } from '@/lib/tokens'

interface NavItem { to: string; icon: string; label: string; section?: string; roles?: string[] }

const NAV_ITEMS: NavItem[] = [
  { to:'/admin',             icon:'▦',  label:'Dashboard',   section:'Visão Geral' },
  { to:'/admin/membros',     icon:'👥', label:'Membros',     section:'Igreja' },
  { to:'/admin/ministerios', icon:'⛪', label:'Ministérios' },
  { to:'/admin/escalas',     icon:'📋', label:'Escalas' },
  { to:'/admin/eventos',     icon:'📅', label:'Eventos' },
  { to:'/admin/oracao',      icon:'🙏', label:'Oração',      section:'Comunidade' },
  { to:'/admin/comunicados', icon:'📢', label:'Comunicados' },
  { to:'/admin/transmissao', icon:'📡', label:'Transmissão' },
  { to:'/admin/usuarios',    icon:'🔐', label:'Usuários',    section:'Administração' },
  { to:'/admin/perfil',      icon:'👤', label:'Meu Perfil',  section:'Conta' },
]

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { appUser, role } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await logOut()
    navigate('/')
  }

  const visible = NAV_ITEMS.filter(i => !i.roles || (role && i.roles.includes(role)))

  return (
    <div style={{ display:'flex', height:'100vh', overflow:'hidden', background:C.bg, fontFamily:'"Inter",system-ui,sans-serif' }}>

      {/* Overlay mobile */}
      {sidebarOpen && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.7)', zIndex:30 }} onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── Sidebar ─────────────────────────── */}
      <aside style={{
        position:'fixed', top:0, bottom:0, left:0, zIndex:40,
        width:232, background:'#080503',
        borderRight:`1px solid ${C.line}`,
        display:'flex', flexDirection:'column', overflowY:'auto',
        transform: sidebarOpen ? 'translateX(0)' : undefined,
        transition:'transform 0.2s ease',
      }} className={sidebarOpen ? '' : 'md-sidebar'}>

        {/* Logo */}
        <div style={{ padding:'18px 16px', borderBottom:`1px solid ${C.line}` }}>
          <SozoLogo size={30} />
        </div>

        {/* Nav */}
        <nav style={{ flex:1, paddingTop:8, paddingBottom:8 }}>
          <SidebarNav items={visible} onClose={() => setSidebarOpen(false)} />
        </nav>

        {/* User */}
        <div style={{ padding:'14px 16px', borderTop:`1px solid ${C.line}` }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10 }}>
            <div style={{ width:32, height:32, borderRadius:'50%', background:`linear-gradient(135deg, ${C.primary}, ${C.primaryL})`, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900, fontSize:13, color:C.white, flexShrink:0 }}>
              {appUser?.displayName?.[0] ?? '?'}
            </div>
            <div style={{ minWidth:0 }}>
              <div style={{ fontSize:13, fontWeight:600, color:C.white, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{appUser?.displayName}</div>
              <div style={{ fontSize:11, color:C.primary, textTransform:'capitalize' }}>{appUser?.role?.replace('_',' ')}</div>
            </div>
          </div>
          <button onClick={handleLogout} style={{ background:'none', border:'none', color:C.gray3, fontSize:13, cursor:'pointer', padding:0, transition:'color 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.color='#E07A8A')}
            onMouseLeave={e => (e.currentTarget.style.color=C.gray3)}
          >← Sair</button>
        </div>
      </aside>

      {/* ── Main ────────────────────────────── */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden', marginLeft:232 }}>
        {/* Mobile topbar */}
        <header style={{ display:'none', alignItems:'center', gap:12, padding:'12px 16px', borderBottom:`1px solid ${C.line}`, background:'#080503' }} className="mobile-header">
          <button onClick={() => setSidebarOpen(true)} style={{ background:'none', border:'none', color:C.gray1, fontSize:20, cursor:'pointer', minWidth:40, minHeight:40 }}>☰</button>
          <SozoLogo size={26} />
        </header>

        <main style={{ flex:1, overflowY:'auto', padding:28 }}>
          <Outlet />
        </main>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .md-sidebar { transform: translateX(-100%); }
          .mobile-header { display: flex !important; }
          div[style*="margin-left: 232px"] { margin-left: 0 !important; }
        }
      `}</style>
    </div>
  )
}

function SidebarNav({ items, onClose }: { items: NavItem[]; onClose: () => void }) {
  let lastSection = ''
  return (
    <>
      {items.map(item => {
        const showSection = item.section && item.section !== lastSection
        if (item.section) lastSection = item.section
        return (
          <div key={item.to}>
            {showSection && (
              <div style={{ padding:'16px 20px 6px', fontSize:10, fontWeight:700, letterSpacing:'3px', textTransform:'uppercase', color:C.gray3 }}>
                {item.section}
              </div>
            )}
            <NavLink
              to={item.to}
              end={item.to === '/admin'}
              onClick={onClose}
              className={({ isActive }) => `sb-item${isActive ? ' active' : ''}`}
            >
              <span style={{ width:18, textAlign:'center', fontSize:14, flexShrink:0 }}>{item.icon}</span>
              {item.label}
            </NavLink>
          </div>
        )
      })}
    </>
  )
}

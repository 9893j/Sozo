import { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '@/features/auth/AuthContext'
import { logOut } from '@/firebase/auth'
import { SozoLogo } from '@/components/ui'
import { Icons } from '@/components/ui/icons'
import { C } from '@/lib/tokens'

interface NavItem {
  to: string
  icon: keyof typeof Icons
  label: string
  section?: string
  roles?: string[]
}

const NAV_ITEMS: NavItem[] = [
  { to:'/admin',             icon:'dashboard', label:'Dashboard',   section:'Visão Geral' },
  { to:'/admin/membros',     icon:'users',     label:'Membros',     section:'Igreja' },
  { to:'/admin/ministerios', icon:'ministry',  label:'Ministérios' },
  { to:'/admin/escalas',     icon:'schedule',  label:'Escalas' },
  { to:'/admin/eventos',     icon:'calendar',  label:'Eventos' },
  { to:'/admin/oracao',      icon:'prayer',    label:'Oração',      section:'Comunidade' },
  { to:'/admin/comunicados', icon:'posts',     label:'Comunicados' },
  { to:'/admin/transmissao', icon:'live',      label:'Transmissão' },
  { to:'/admin/usuarios',    icon:'lock',      label:'Usuários',    section:'Administração' },
  { to:'/admin/perfil',      icon:'user',      label:'Meu Perfil',  section:'Conta' },
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

      {sidebarOpen && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', zIndex:30, backdropFilter:'blur(4px)' }} onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── Sidebar ──────────────────────────── */}
      <aside style={{
        position:'fixed', top:0, bottom:0, left:0, zIndex:40,
        width:240, background:'#060402',
        borderRight:`1px solid rgba(255,255,255,0.04)`,
        display:'flex', flexDirection:'column',
        transition:'transform 0.25s cubic-bezier(.4,0,.2,1)',
      }} className="md-sidebar">

        {/* Logo */}
        <div style={{ padding:'22px 20px 18px', borderBottom:`1px solid rgba(255,255,255,0.04)` }}>
          <SozoLogo size={30} />
        </div>

        {/* Nav */}
        <nav style={{ flex:1, padding:'8px 0', overflowY:'auto' }}>
          <SidebarNav items={visible} onClose={() => setSidebarOpen(false)} />
        </nav>

        {/* Rodapé usuário */}
        <div style={{ padding:'16px 20px', borderTop:`1px solid rgba(255,255,255,0.04)` }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }}>
            <div style={{ width:34, height:34, borderRadius:8, background:`linear-gradient(135deg, ${C.primary}, ${C.primaryL})`, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:13, color:C.white, flexShrink:0, letterSpacing:'-0.5px' }}>
              {appUser?.displayName?.[0]?.toUpperCase() ?? '?'}
            </div>
            <div style={{ minWidth:0, flex:1 }}>
              <div style={{ fontSize:13, fontWeight:600, color:C.white, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', letterSpacing:'-0.2px' }}>
                {appUser?.displayName}
              </div>
              <div style={{ fontSize:11, color:C.primary, fontWeight:500, letterSpacing:'0.3px', textTransform:'capitalize', marginTop:1 }}>
                {appUser?.role?.replace('_',' ')}
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            style={{ display:'flex', alignItems:'center', gap:7, background:'none', border:'none', color:C.gray3, fontSize:12, fontWeight:500, cursor:'pointer', padding:0, transition:'color 0.2s', letterSpacing:'0.2px', fontFamily:'"Inter",system-ui,sans-serif' }}
            onMouseEnter={e => (e.currentTarget.style.color='#E07A8A')}
            onMouseLeave={e => (e.currentTarget.style.color=C.gray3)}
          >
            <Icons.logout size={13} />
            Sair da conta
          </button>
        </div>
      </aside>

      {/* ── Main ─────────────────────────────── */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden', marginLeft:240 }}>

        {/* Topbar mobile */}
        <header style={{ display:'none', alignItems:'center', justifyContent:'space-between', padding:'0 20px', height:58, borderBottom:`1px solid rgba(255,255,255,0.04)`, background:'#060402', flexShrink:0 }} className="mobile-header">
          <SozoLogo size={26} />
          <button onClick={() => setSidebarOpen(true)} style={{ background:'none', border:`1px solid ${C.lineHi}`, borderRadius:6, color:C.gray1, cursor:'pointer', width:36, height:36, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M3 12h18M3 6h18M3 18h18" />
            </svg>
          </button>
        </header>

        {/* Conteúdo */}
        <main style={{ flex:1, overflowY:'auto', padding:'32px 36px' }}>
          <Outlet />
        </main>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .md-sidebar { transform: translateX(-100%); }
          .mobile-header { display: flex !important; }
          div[style*="margin-left: 240px"] { margin-left: 0 !important; }
        }
        .md-sidebar-open { transform: translateX(0) !important; }
      `}</style>
    </div>
  )
}

// ─── Sidebar Nav ─────────────────────────────
function SidebarNav({ items, onClose }: { items: NavItem[]; onClose: () => void }) {
  let lastSection = ''
  return (
    <>
      {items.map(item => {
        const showSection = item.section && item.section !== lastSection
        if (item.section) lastSection = item.section
        const IconComp = Icons[item.icon]
        return (
          <div key={item.to}>
            {showSection && (
              <div style={{ padding:'18px 20px 6px', fontSize:9, fontWeight:700, letterSpacing:'2.5px', textTransform:'uppercase', color:'rgba(106,77,53,0.6)' }}>
                {item.section}
              </div>
            )}
            <NavLink
              to={item.to}
              end={item.to === '/admin'}
              onClick={onClose}
              className={({ isActive }) => `sb-item${isActive ? ' active' : ''}`}
            >
              <IconComp size={15} />
              <span style={{ letterSpacing:'-0.1px' }}>{item.label}</span>
            </NavLink>
          </div>
        )
      })}
    </>
  )
}

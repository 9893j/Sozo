import { createBrowserRouter } from 'react-router-dom'
import { PrivateRoute, RoleGuard } from '@/features/auth/PrivateRoute'
import { C } from '@/lib/tokens'

// ── Layouts ────────────────────────────────────
import PublicLayout  from '@/components/layout/PublicLayout'
import AdminLayout   from '@/components/layout/AdminLayout'

// ── Páginas públicas ────────────────────────────
import LandingPage from '@/pages/public/LandingPage'
import LoginPage   from '@/pages/public/LoginPage'

// ── Páginas admin ───────────────────────────────
import DashboardPage   from '@/pages/admin/DashboardPage'
import MembersPage     from '@/pages/admin/MembersPage'
import MinisteriosPage from '@/pages/admin/MinisteriosPage'
import EscalasPage     from '@/pages/admin/EscalasPage'
import EventosPage     from '@/pages/admin/EventosPage'
import PrayerPage      from '@/pages/admin/PrayerPage'
import PostsPage       from '@/pages/admin/PostsPage'
import LivePage        from '@/pages/admin/LivePage'
import UsersPage       from '@/pages/admin/UsersPage'
import ProfilePage     from '@/pages/admin/ProfilePage'

const Page404 = () => (
  <div style={{ minHeight: '100vh', background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '"Inter",system-ui,sans-serif' }}>
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontWeight: 900, fontSize: 96, color: C.primary, letterSpacing: '-4px', lineHeight: 1 }}>404</div>
      <div style={{ fontSize: 16, color: C.gray2, marginTop: 12 }}>Página não encontrada</div>
      <a href="/" style={{ display: 'inline-block', marginTop: 24, color: C.primary, fontSize: 14, fontWeight: 600 }}>← Voltar ao início</a>
    </div>
  </div>
)

export const router = createBrowserRouter([

  // ── Landing — nav próprio, sem PublicLayout ──
  { path: '/', element: <LandingPage /> },

  // ── Login — usa PublicLayout (nav simples) ───
  {
    element: <PublicLayout />,
    children: [
      { path: '/login', element: <LoginPage /> },
    ],
  },

  // ── Admin — protegido por auth ───────────────
  {
    element: <PrivateRoute />,
    children: [{
      path: '/admin',
      element: <AdminLayout />,
      children: [
        { index: true,         element: <DashboardPage /> },
        { path: 'membros',     element: <MembersPage /> },
        { path: 'ministerios', element: <MinisteriosPage /> },
        { path: 'escalas',     element: <EscalasPage /> },
        { path: 'eventos',     element: <EventosPage /> },
        { path: 'oracao',      element: <PrayerPage /> },
        { path: 'comunicados', element: <PostsPage /> },
        { path: 'transmissao', element: <LivePage /> },
        { path: 'perfil',      element: <ProfilePage /> },
        // Visível para pastor e super_admin — o AdminLayout filtra o item do menu
        { path: 'usuarios', element: <UsersPage /> },
      ],
    }],
  },

  // ── 404 ─────────────────────────────────────
  { path: '*', element: <Page404 /> },
])

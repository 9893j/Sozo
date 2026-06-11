import { createBrowserRouter } from 'react-router-dom'
import { PrivateRoute, RoleGuard } from '@/features/auth/PrivateRoute'

// ── Layouts ──────────────────────────────────
import PublicLayout  from '@/components/layout/PublicLayout'
import AdminLayout   from '@/components/layout/AdminLayout'

// ── Public pages ─────────────────────────────
import LandingPage   from '@/pages/public/LandingPage'
import LoginPage     from '@/pages/public/LoginPage'

// ── Admin pages ───────────────────────────────
import DashboardPage     from '@/pages/admin/DashboardPage'
import MembersPage       from '@/pages/admin/MembersPage'
import MinisteriosPage   from '@/pages/admin/MinisteriosPage'
import EscalasPage       from '@/pages/admin/EscalasPage'
import EventosPage       from '@/pages/admin/EventosPage'
import PrayerPage        from '@/pages/admin/PrayerPage'
import PostsPage         from '@/pages/admin/PostsPage'
import LivePage          from '@/pages/admin/LivePage'
import UsersPage         from '@/pages/admin/UsersPage'
import ProfilePage       from '@/pages/admin/ProfilePage'

export const router = createBrowserRouter([
  // ── Landing — nav próprio, sem PublicLayout ─
  { path: '/', element: <LandingPage /> },

  // ── Outras páginas públicas ──────────────────
  {
    element: <PublicLayout />,
    children: [
      { path: '/login', element: <LoginPage /> },
    ],
  },

  // ── Rotas protegidas — qualquer usuário autenticado ──
  {
    element: <PrivateRoute />,
    children: [
      {
        path: '/admin',
        element: <AdminLayout />,
        children: [
          { index: true,          element: <DashboardPage /> },
          { path: 'membros',      element: <MembersPage /> },
          { path: 'ministerios',  element: <MinisteriosPage /> },
          { path: 'escalas',      element: <EscalasPage /> },
          { path: 'eventos',      element: <EventosPage /> },
          { path: 'oracao',       element: <PrayerPage /> },
          { path: 'comunicados',  element: <PostsPage /> },
          { path: 'transmissao',  element: <LivePage /> },
          { path: 'perfil',       element: <ProfilePage /> },

          // ── Super admin / pastor only ────────
          {
            element: <RoleGuard minRole="pastor" />,
            children: [
              { path: 'usuarios', element: <UsersPage /> },
            ],
          },
        ],
      },
    ],
  },

  // ── 404 ─────────────────────────────────────
  {
    path: '*',
    element: (
      <div className="min-h-screen bg-stone-950 flex items-center justify-center text-stone-300">
        <div className="text-center">
          <p className="font-serif text-6xl font-bold text-gold mb-4">404</p>
          <p className="text-stone-500">Página não encontrada</p>
        </div>
      </div>
    ),
  },
])

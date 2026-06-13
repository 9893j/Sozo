import { Outlet } from 'react-router-dom'
import { C } from '@/lib/tokens'
import PublicNav from './PublicNav'

export default function PublicLayout() {
  return (
    <div style={{ minHeight: '100vh', background: C.bg, fontFamily: '"Inter", system-ui, sans-serif' }}>
      <PublicNav />
      <Outlet />
    </div>
  )
}

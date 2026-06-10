import { Outlet } from 'react-router-dom'
import PublicNav from './PublicNav'

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-stone-950">
      <PublicNav />
      <Outlet />
    </div>
  )
}

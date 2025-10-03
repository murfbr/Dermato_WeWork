import { Outlet } from 'react-router-dom'
import { Header } from '@/components/Header'

export default function Layout() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}

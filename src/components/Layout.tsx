import { Outlet } from 'react-router-dom'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Header } from '@/components/Header'
import { Sidebar } from '@/components/Sidebar'
import { BottomNav } from '@/components/BottomNav'
import { useIsMobile } from '@/hooks/use-mobile'

export default function Layout() {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false)
  const isMobile = useIsMobile()

  const toggleSidebar = () => setSidebarCollapsed(!isSidebarCollapsed)
  const toggleMobileMenu = () => setMobileMenuOpen(!isMobileMenuOpen)

  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        toggleCollapse={toggleSidebar}
      />
      <div
        className={cn(
          'flex flex-col flex-1 transition-all duration-300 ease-in-out',
          isMobile ? 'pb-16' : '',
        )}
      >
        <Header onMenuClick={toggleMobileMenu} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
          <Outlet />
        </main>
        <BottomNav />
      </div>
    </div>
  )
}

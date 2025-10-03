import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { Home, MessageSquare, FileText, Calendar, User } from 'lucide-react'

const navItems = [
  { to: '/', icon: Home, label: 'Dashboard' },
  { to: '/comunicacao', icon: MessageSquare, label: 'Chat' },
  { to: '/laudos', icon: FileText, label: 'Laudos' },
  { to: '/calendario', icon: Calendar, label: 'Agenda' },
  { to: '/perfil', icon: User, label: 'Perfil' },
]

export const BottomNav = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden border-t bg-card shadow-[0_-2px_4px_rgba(0,0,0,0.05)]">
      <div className="grid h-16 grid-cols-5">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center justify-center gap-1 text-muted-foreground transition-colors',
                isActive ? 'text-primary' : 'hover:text-primary',
              )
            }
          >
            <item.icon className="h-6 w-6" />
            <span className="text-xs font-medium">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}

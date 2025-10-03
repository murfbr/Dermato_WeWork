import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'
import {
  Home,
  MessageSquare,
  FileText,
  Calendar,
  User,
  ChevronLeft,
  Stethoscope,
} from 'lucide-react'
import { Button } from './ui/button'

const navItems = [
  { to: '/', icon: Home, label: 'Dashboard' },
  { to: '/comunicacao', icon: MessageSquare, label: 'Comunicação' },
  { to: '/laudos', icon: FileText, label: 'Laudos' },
  { to: '/procedimentos', icon: Stethoscope, label: 'Procedimentos' },
  { to: '/calendario', icon: Calendar, label: 'Calendário' },
  { to: '/perfil', icon: User, label: 'Perfil' },
]

interface SidebarProps {
  isCollapsed: boolean
  toggleCollapse: () => void
}

export const Sidebar = ({ isCollapsed, toggleCollapse }: SidebarProps) => {
  return (
    <aside
      className={cn(
        'hidden md:flex flex-col border-r bg-card transition-width duration-300 ease-in-out',
        isCollapsed ? 'w-20' : 'w-64',
      )}
    >
      <div className="flex h-16 items-center justify-between border-b px-4">
        {!isCollapsed && (
          <span className="text-lg font-semibold">Navegação</span>
        )}
        <Button variant="ghost" size="icon" onClick={toggleCollapse}>
          <ChevronLeft
            className={cn(
              'h-5 w-5 transition-transform',
              isCollapsed && 'rotate-180',
            )}
          />
        </Button>
      </div>
      <nav className="flex-1 p-2 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-muted-foreground transition-all hover:bg-primary/10 hover:text-primary',
                isActive &&
                  'bg-primary/10 text-primary border-l-4 border-primary',
                isCollapsed && 'justify-center',
              )
            }
          >
            <item.icon className="h-5 w-5" />
            {!isCollapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}

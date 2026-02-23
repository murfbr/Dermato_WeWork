import { Link, NavLink } from 'react-router-dom'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import {
  Menu,
  Users,
  Home,
  MessageSquare,
  FileText,
  Stethoscope,
  Calendar,
  User,
  Settings,
  LogOut,
} from 'lucide-react'
import { NotificationsSheet } from '@/components/NotificationsSheet'
import { doctor } from '@/lib/mock-data'
import { useClient } from '@/contexts/ClientContext'
import { useAuth } from '@/contexts/AuthContext'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from '@/components/ui/sheet'
import { cn } from '@/lib/utils'

const navItems = [
  {
    to: '/',
    label: 'Dashboard',
    icon: Home,
    roles: ['doctor', 'client', 'admin'],
  },
  {
    to: '/comunicacao',
    label: 'Comunicação',
    icon: MessageSquare,
    roles: ['doctor', 'client', 'admin'],
  },
  {
    to: '/laudos',
    label: 'Laudos',
    icon: FileText,
    roles: ['doctor', 'client', 'admin'],
  },
  {
    to: '/procedimentos',
    label: 'Procedimentos',
    icon: Stethoscope,
    roles: ['doctor', 'client', 'admin'],
  },
  {
    to: '/calendario',
    label: 'Calendário',
    icon: Calendar,
    roles: ['doctor', 'client', 'admin'],
  },
  {
    to: '/perfil',
    label: 'Perfil',
    icon: User,
    roles: ['doctor', 'client', 'admin'],
  },
  {
    to: '/configuracoes',
    label: 'Configurações',
    icon: Settings,
    roles: ['admin'],
  },
]

export const Header = () => {
  const { clients, currentClient, setCurrentClient } = useClient()
  const { role, setRole } = useAuth()

  const doctorInitials = doctor.name
    .split(' ')
    .map((n) => n[0])
    .join('')
  const adminAvatar =
    'https://img.usecurling.com/i?q=clinic&color=azure&shape=outline'

  const userAvatar =
    role === 'admin'
      ? adminAvatar
      : role === 'doctor'
        ? doctor.avatarUrl
        : currentClient?.profile.avatarUrl
  const userName =
    role === 'admin'
      ? 'Administração'
      : role === 'doctor'
        ? doctor.name
        : currentClient?.profile.name
  const userInitials =
    role === 'admin'
      ? 'ADM'
      : role === 'doctor'
        ? doctorInitials
        : currentClient?.profile.name
            .split(' ')
            .map((n) => n[0])
            .join('')

  const filteredNav = navItems.filter((item) => item.roles.includes(role))

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-card px-4 md:px-6 shadow-subtle">
      <nav className="flex items-center gap-6">
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <SheetTitle className="sr-only">Menu de Navegação</SheetTitle>
              <nav className="grid gap-2 text-lg font-medium">
                <Link
                  to="/"
                  className="flex items-center gap-2 text-lg font-semibold mb-4"
                >
                  <img
                    src="https://img.usecurling.com/i?q=caduceus&color=azure"
                    alt="Logo"
                    className="h-8 w-8"
                  />
                  <span>Flavia Novis - clínica integrada</span>
                </Link>
                {filteredNav.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
                        isActive && 'text-primary bg-muted',
                      )
                    }
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </NavLink>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        <Link
          to="/"
          className="hidden items-center gap-2 text-lg font-semibold md:flex"
        >
          <img
            src="https://img.usecurling.com/i?q=caduceus&color=azure"
            alt="Logo"
            className="h-8 w-8"
          />
          <span>Flavia Novis - clínica integrada</span>
        </Link>
        <div className="hidden md:flex items-center gap-4 text-sm lg:gap-6">
          {filteredNav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-2 transition-colors hover:text-foreground',
                  isActive
                    ? 'text-foreground font-semibold'
                    : 'text-muted-foreground',
                )
              }
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          ))}
        </div>
      </nav>

      <div className="ml-auto flex items-center gap-2 md:gap-4">
        {role !== 'client' && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                <span className="hidden md:inline font-medium">
                  {currentClient?.profile.name ?? 'Selecionar Paciente'}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuLabel>Selecionar Paciente</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup
                value={currentClient?.id.toString()}
                onValueChange={(id) => {
                  const client = clients.find((c) => c.id.toString() === id)
                  if (client) setCurrentClient(client)
                }}
              >
                {clients.map((client) => (
                  <DropdownMenuRadioItem
                    key={client.id}
                    value={client.id.toString()}
                  >
                    {client.profile.name}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        <NotificationsSheet />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-10 w-10 border-2 border-primary">
                <AvatarImage src={userAvatar} alt={userName} />
                <AvatarFallback>{userInitials}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{userName}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Alternar Perfil
            </DropdownMenuLabel>
            <DropdownMenuRadioGroup
              value={role}
              onValueChange={(r: any) => setRole(r)}
            >
              <DropdownMenuRadioItem value="admin">
                Administração
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="doctor">
                Médico
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="client">
                Paciente
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/login" className="flex items-center">
                <LogOut className="mr-2 h-4 w-4" />
                Sair
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

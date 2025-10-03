import { Link, useLocation } from 'react-router-dom'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Menu } from 'lucide-react'
import { NotificationsSheet } from '@/components/NotificationsSheet'
import { patient } from '@/lib/mock-data'

interface HeaderProps {
  onMenuClick: () => void
}

const getPageTitle = (pathname: string): string => {
  switch (pathname) {
    case '/':
      return 'Dashboard'
    case '/comunicacao':
      return 'Comunicação'
    case '/laudos':
      return 'Laudos'
    case '/calendario':
      return 'Calendário'
    case '/perfil':
      return 'Perfil'
    default:
      return 'DermApp'
  }
}

export const Header = ({ onMenuClick }: HeaderProps) => {
  const location = useLocation()
  const pageTitle = getPageTitle(location.pathname)
  const userInitials = patient.name
    .split(' ')
    .map((n) => n[0])
    .join('')

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-card px-4 md:px-6 shadow-subtle">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={onMenuClick}
        >
          <Menu className="h-6 w-6" />
        </Button>
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <img
            src="https://img.usecurling.com/i?q=dermatology&color=azure"
            alt="DermApp Logo"
            className="h-8 w-8"
          />
          <span className="hidden md:inline-block text-lg">DermApp</span>
        </Link>
      </div>

      <div className="flex-1">
        <h1 className="font-semibold text-xl ml-4">{pageTitle}</h1>
      </div>

      <div className="flex items-center gap-4">
        <NotificationsSheet />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-10 w-10 border-2 border-primary">
                <AvatarImage src={patient.avatarUrl} alt={patient.name} />
                <AvatarFallback>{userInitials}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>
              Olá, {patient.name.split(' ')[0]}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/perfil">Meu Perfil</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/login">Sair</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

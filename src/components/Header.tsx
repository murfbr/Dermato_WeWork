import { Link, useLocation } from 'react-router-dom'
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
import { Menu, Users, ChevronDown } from 'lucide-react'
import { NotificationsSheet } from '@/components/NotificationsSheet'
import { doctor } from '@/lib/mock-data'
import { useClient } from '@/contexts/ClientContext'

const getPageTitle = (pathname: string): string => {
  switch (pathname) {
    case '/':
      return 'Dashboard do Paciente'
    case '/comunicacao':
      return 'Comunicação'
    case '/laudos':
      return 'Laudos'
    case '/procedimentos':
      return 'Procedimentos'
    case '/calendario':
      return 'Calendário'
    case '/perfil':
      return 'Perfil do Paciente'
    default:
      return 'Dra. Paula Periquito'
  }
}

export const Header = ({ onMenuClick }: { onMenuClick: () => void }) => {
  const location = useLocation()
  const { clients, currentClient, setCurrentClient } = useClient()
  const pageTitle = getPageTitle(location.pathname)
  const doctorInitials = doctor.name
    .split(' ')
    .map((n) => n[0])
    .join('')

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-card px-4 md:px-6 shadow-subtle">
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={onMenuClick}
      >
        <Menu className="h-6 w-6" />
      </Button>
      <div className="flex items-center gap-4">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <img
            src="https://img.usecurling.com/i?q=caduceus&color=azure"
            alt="Logo"
            className="h-8 w-8"
          />
          <span className="hidden md:inline-block text-lg">
            Dra. Paula Periquito
          </span>
        </Link>
      </div>

      <div className="flex-1 flex items-center gap-4">
        <h1 className="font-semibold text-xl ml-4 hidden sm:block">
          {pageTitle}
        </h1>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto sm:ml-4">
              <Users className="mr-2 h-4 w-4" />
              {currentClient?.profile.name ?? 'Selecione um paciente'}
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Pacientes</DropdownMenuLabel>
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
      </div>

      <div className="flex items-center gap-4">
        <NotificationsSheet />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-10 w-10 border-2 border-primary">
                <AvatarImage src={doctor.avatarUrl} alt={doctor.name} />
                <AvatarFallback>{doctorInitials}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{doctor.name}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Configurações</DropdownMenuItem>
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

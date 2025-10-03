import { createContext, useState, useContext, ReactNode } from 'react'
import { clients as mockClients, Client } from '@/lib/mock-data'

interface ClientContextType {
  clients: Client[]
  currentClient: Client | null
  setCurrentClient: (client: Client) => void
}

const ClientContext = createContext<ClientContextType | undefined>(undefined)

export const ClientProvider = ({ children }: { children: ReactNode }) => {
  const [clients] = useState<Client[]>(mockClients)
  const [currentClient, setCurrentClient] = useState<Client | null>(
    clients[0] || null,
  )

  const value = {
    clients,
    currentClient,
    setCurrentClient,
  }

  return (
    <ClientContext.Provider value={value}>{children}</ClientContext.Provider>
  )
}

export const useClient = (): ClientContextType => {
  const context = useContext(ClientContext)
  if (context === undefined) {
    throw new Error('useClient must be used within a ClientProvider')
  }
  return context
}

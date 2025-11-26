import { createContext, useState, useContext, ReactNode } from 'react'
import {
  clients as mockClients,
  Client,
  PerformedProcedure,
} from '@/lib/mock-data'

interface ClientContextType {
  clients: Client[]
  currentClient: Client | null
  setCurrentClient: (client: Client) => void
  addProcedure: (clientId: number, procedure: PerformedProcedure) => void
  updateProcedure: (
    clientId: number,
    procedureId: number,
    data: Partial<PerformedProcedure>,
  ) => void
}

const ClientContext = createContext<ClientContextType | undefined>(undefined)

export const ClientProvider = ({ children }: { children: ReactNode }) => {
  const [clients, setClients] = useState<Client[]>(mockClients)
  const [currentClient, setCurrentClient] = useState<Client | null>(
    clients[0] || null,
  )

  const updateCurrentClient = (updatedClients: Client[]) => {
    if (currentClient) {
      const updated = updatedClients.find((c) => c.id === currentClient.id)
      if (updated) setCurrentClient(updated)
    }
  }

  const addProcedure = (clientId: number, procedure: PerformedProcedure) => {
    const updatedClients = clients.map((client) => {
      if (client.id === clientId) {
        return {
          ...client,
          performedProcedures: [procedure, ...client.performedProcedures],
        }
      }
      return client
    })
    setClients(updatedClients)
    updateCurrentClient(updatedClients)
  }

  const updateProcedure = (
    clientId: number,
    procedureId: number,
    data: Partial<PerformedProcedure>,
  ) => {
    const updatedClients = clients.map((client) => {
      if (client.id === clientId) {
        return {
          ...client,
          performedProcedures: client.performedProcedures.map((proc) => {
            if (proc.id === procedureId) {
              return { ...proc, ...data }
            }
            return proc
          }),
        }
      }
      return client
    })
    setClients(updatedClients)
    updateCurrentClient(updatedClients)
  }

  const value = {
    clients,
    currentClient,
    setCurrentClient,
    addProcedure,
    updateProcedure,
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

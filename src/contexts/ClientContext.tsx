import { createContext, useState, useContext, ReactNode } from 'react'
import {
  clients as mockClients,
  Client,
  PerformedProcedure,
  procedures as mockProcedures,
  Procedure,
  Report,
  Notification,
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
  proceduresConfig: Procedure[]
  updateProcedureConfig: (id: string, delayDays: number) => void
  addReport: (clientId: number, report: Report) => void
  addNotification: (clientId: number, notification: Notification) => void
}

const ClientContext = createContext<ClientContextType | undefined>(undefined)

export const ClientProvider = ({ children }: { children: ReactNode }) => {
  const [clients, setClients] = useState<Client[]>(mockClients)
  const [currentClient, setCurrentClient] = useState<Client | null>(
    clients[0] || null,
  )
  const [proceduresConfig, setProceduresConfig] =
    useState<Procedure[]>(mockProcedures)

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

  const updateProcedureConfig = (id: string, delayDays: number) => {
    setProceduresConfig((prev) =>
      prev.map((p) => (p.id === id ? { ...p, delayDays } : p)),
    )
  }

  const addReport = (clientId: number, report: Report) => {
    const updatedClients = clients.map((client) => {
      if (client.id === clientId) {
        return {
          ...client,
          reports: [report, ...client.reports],
        }
      }
      return client
    })
    setClients(updatedClients)
    updateCurrentClient(updatedClients)
  }

  const addNotification = (clientId: number, notification: Notification) => {
    const updatedClients = clients.map((client) => {
      if (client.id === clientId) {
        return {
          ...client,
          notifications: [notification, ...client.notifications],
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
    proceduresConfig,
    updateProcedureConfig,
    addReport,
    addNotification,
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

import { createContext, useState, useContext, ReactNode } from 'react'
import {
  clients as mockClients,
  Client,
  PerformedProcedure,
  procedures as mockProcedures,
  Procedure,
  Report,
  Notification,
  Appointment,
  Message,
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
  addAppointment: (clientId: number, appointment: Appointment) => void
  addMessage: (clientId: number, convId: number, message: Message) => void
  registerClient: (clientData: any) => void
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

  const addAppointment = (clientId: number, appointment: Appointment) => {
    const updatedClients = clients.map((client) => {
      if (client.id === clientId) {
        return {
          ...client,
          appointments: [...client.appointments, appointment].sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
          ),
        }
      }
      return client
    })
    setClients(updatedClients)
    updateCurrentClient(updatedClients)
  }

  const addMessage = (clientId: number, convId: number, message: Message) => {
    const updatedClients = clients.map((client) => {
      if (client.id === clientId) {
        return {
          ...client,
          conversations: client.conversations.map((c) =>
            c.id === convId
              ? {
                  ...c,
                  messages: [...c.messages, message],
                  lastMessage: message.text,
                  timestamp: message.timestamp,
                }
              : c,
          ),
        }
      }
      return client
    })
    setClients(updatedClients)
    updateCurrentClient(updatedClients)
  }

  const registerClient = (clientData: any) => {
    const newClient: Client = {
      id: Date.now(),
      profile: {
        name: clientData.fullName,
        email: clientData.email,
        phone: clientData.phone,
        dob: clientData.dob,
        cpf: clientData.cpf,
        address: '',
        avatarUrl: `https://img.usecurling.com/ppl/medium?seed=${Date.now()}`,
      },
      notifications: [],
      appointments: [],
      reports: [],
      conversations: [
        {
          id: 1,
          contactName: 'Clínica',
          contactAvatar:
            'https://img.usecurling.com/i?q=clinic&color=azure&shape=outline',
          lastMessage: 'Bem-vindo(a) à clínica!',
          timestamp: 'Agora',
          unreadCount: 0,
          messages: [
            {
              id: 1,
              sender: 'Clínica',
              text: 'Bem-vindo(a) à Clínica DermApp! Estamos felizes em tê-lo(a) conosco.',
              timestamp: new Date().toLocaleTimeString('pt-BR', {
                hour: '2-digit',
                minute: '2-digit',
              }),
              read: true,
            },
          ],
        },
      ],
      performedProcedures: [],
    }
    setClients([...clients, newClient])
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
    addAppointment,
    addMessage,
    registerClient,
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

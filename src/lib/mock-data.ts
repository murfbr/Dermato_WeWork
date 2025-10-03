export const doctor = {
  name: 'Dra. Paula Periquito',
  email: 'paula.periquito@derma.com',
  avatarUrl: 'https://img.usecurling.com/ppl/medium?gender=female&seed=10',
}

export interface Profile {
  name: string
  email: string
  phone: string
  dob: string
  cpf: string
  address: string
  avatarUrl: string
}

export interface Notification {
  id: number
  read: boolean
  title: string
  description: string
  time: string
}

export interface Appointment {
  id: number
  date: string
  doctor: string
  type: string
  status: 'Confirmado' | 'Realizado' | 'Cancelado'
  location: string
}

export interface Report {
  id: number
  date: string
  type: string
  doctor: string
  status: 'Disponível' | 'Em Análise'
}

export interface Message {
  id: number
  sender: string
  text: string
  timestamp: string
  read: boolean
}

export interface Conversation {
  id: number
  contactName: string
  contactAvatar: string
  lastMessage: string
  timestamp: string
  unreadCount: number
  messages: Message[]
}

export interface AfterImage {
  url: string
  date: string
}

export interface PerformedProcedure {
  id: number
  date: string
  name: 'Botox' | 'Preenchimento' | 'Rotina' | 'Lifting Facial'
  beforeImageUrl: string
  afterImages: AfterImage[]
}

export interface Client {
  id: number
  profile: Profile
  notifications: Notification[]
  appointments: Appointment[]
  reports: Report[]
  conversations: Conversation[]
  performedProcedures: PerformedProcedure[]
}

export interface Procedure {
  id: string
  name: string
  description: string
  imageUrl: string
}

export const procedures: Procedure[] = [
  {
    id: 'botox',
    name: 'Botox',
    description:
      'Aplicação de toxina botulínica para suavizar rugas e linhas de expressão.',
    imageUrl: 'https://img.usecurling.com/p/400/300?q=botox%20injection',
  },
  {
    id: 'preenchimento',
    name: 'Preenchimento',
    description:
      'Uso de ácido hialurônico para restaurar volume e contorno facial.',
    imageUrl: 'https://img.usecurling.com/p/400/300?q=facial%20filler',
  },
  {
    id: 'rotina',
    name: 'Rotina',
    description:
      'Consultas regulares para acompanhamento da saúde da pele e prevenção.',
    imageUrl: 'https://img.usecurling.com/p/400/300?q=skincare%20routine',
  },
  {
    id: 'lifting',
    name: 'Lifting Facial',
    description:
      'Procedimentos para combater a flacidez e promover o rejuvenescimento da pele.',
    imageUrl: 'https://img.usecurling.com/p/400/300?q=face%20lifting',
  },
]

const generateMockProcedures = (): PerformedProcedure[] => {
  const procedures: PerformedProcedure[] = []
  const procedureNames: PerformedProcedure['name'][] = [
    'Botox',
    'Preenchimento',
    'Rotina',
    'Lifting Facial',
  ]
  const today = new Date()
  const currentYear = today.getFullYear()
  const currentMonth = today.getMonth()
  let idCounter = 1

  for (let month = 0; month <= currentMonth; month++) {
    const daysInMonth = new Date(currentYear, month + 1, 0).getDate()
    const numProcedures = Math.floor(Math.random() * 3) + 1

    for (let i = 0; i < numProcedures; i++) {
      const day = Math.floor(Math.random() * daysInMonth) + 1
      const procedureDate = new Date(currentYear, month, day)
      const procedureName =
        procedureNames[Math.floor(Math.random() * procedureNames.length)]

      if (procedureName === 'Rotina') {
        procedures.push({
          id: idCounter++,
          date: procedureDate.toISOString(),
          name: procedureName,
          beforeImageUrl: '',
          afterImages: [],
        })
        continue
      }

      const beforeImageUrl = `https://img.usecurling.com/p/800/600?q=${procedureName}%20before&seed=${idCounter}`

      const afterImages: AfterImage[] = []
      const numAfterImages = Math.floor(Math.random() * 3) + 1
      for (let j = 0; j < numAfterImages; j++) {
        const afterDate = new Date(procedureDate)
        afterDate.setDate(procedureDate.getDate() + (j + 1) * 15)
        afterImages.push({
          url: `https://img.usecurling.com/p/800/600?q=${procedureName}%20after&seed=${idCounter + j + 1}`,
          date: afterDate.toISOString(),
        })
      }

      procedures.push({
        id: idCounter++,
        date: procedureDate.toISOString(),
        name: procedureName,
        beforeImageUrl,
        afterImages,
      })
    }
  }
  return procedures.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  )
}

export const clients: Client[] = [
  {
    id: 1,
    profile: {
      name: 'Ana Silva',
      email: 'ana.silva@example.com',
      phone: '(11) 98765-4321',
      dob: '1990-05-15',
      cpf: '123.456.789-00',
      address: 'Rua das Flores, 123, São Paulo, SP',
      avatarUrl: 'https://img.usecurling.com/ppl/medium?gender=female&seed=1',
    },
    notifications: [
      {
        id: 1,
        read: false,
        title: 'Novo laudo disponível',
        description: 'Seu exame de Biópsia de Pele está pronto.',
        time: 'há 5 minutos',
      },
      {
        id: 2,
        read: false,
        title: 'Lembrete de consulta',
        description: 'Sua consulta com Dra. Paula é amanhã às 10:00.',
        time: 'há 2 horas',
      },
    ],
    appointments: [
      {
        id: 1,
        date: '2025-10-28T10:00:00',
        doctor: 'Dra. Paula Periquito',
        type: 'Consulta de Rotina',
        status: 'Confirmado',
        location: 'Clínica DermApp, Sala 3',
      },
      {
        id: 2,
        date: '2025-09-20T09:00:00',
        doctor: 'Dra. Paula Periquito',
        type: 'Retorno',
        status: 'Realizado',
        location: 'Clínica DermApp, Sala 3',
      },
    ],
    reports: [
      {
        id: 1,
        date: '2025-10-20',
        type: 'Biópsia de Pele',
        doctor: 'Dra. Paula Periquito',
        status: 'Disponível',
      },
      {
        id: 2,
        date: '2025-09-05',
        type: 'Dermatoscopia',
        doctor: 'Dra. Paula Periquito',
        status: 'Disponível',
      },
    ],
    conversations: [
      {
        id: 1,
        contactName: 'Clínica',
        contactAvatar:
          'https://img.usecurling.com/i?q=clinic&color=azure&shape=outline',
        lastMessage: 'Seus resultados de exame já estão disponíveis.',
        timestamp: '10:40',
        unreadCount: 1,
        messages: [
          {
            id: 1,
            sender: 'Clínica',
            text: 'Olá Ana, seus resultados de exame já estão disponíveis no app.',
            timestamp: '10:40',
            read: true,
          },
          {
            id: 2,
            sender: 'Ana Silva',
            text: 'Ótimo, muito obrigada por avisar!',
            timestamp: '10:42',
            read: false,
          },
        ],
      },
    ],
    performedProcedures: generateMockProcedures(),
  },
  {
    id: 2,
    profile: {
      name: 'Bruno Costa',
      email: 'bruno.costa@example.com',
      phone: '(21) 91234-5678',
      dob: '1985-08-22',
      cpf: '098.765.432-11',
      address: 'Avenida Copacabana, 456, Rio de Janeiro, RJ',
      avatarUrl: 'https://img.usecurling.com/ppl/medium?gender=male&seed=2',
    },
    notifications: [
      {
        id: 1,
        read: true,
        title: 'Consulta confirmada',
        description: 'Sua consulta de rotina foi confirmada.',
        time: 'há 3 dias',
      },
    ],
    appointments: [
      {
        id: 1,
        date: '2025-11-15T14:30:00',
        doctor: 'Dra. Paula Periquito',
        type: 'Procedimento a Laser',
        status: 'Confirmado',
        location: 'Online',
      },
      {
        id: 2,
        date: '2025-10-01T11:00:00',
        doctor: 'Dra. Paula Periquito',
        type: 'Consulta de Rotina',
        status: 'Realizado',
        location: 'Clínica DermApp, Sala 3',
      },
    ],
    reports: [
      {
        id: 1,
        date: '2025-10-18',
        type: 'Exame de Sangue',
        doctor: 'Dra. Paula Periquito',
        status: 'Disponível',
      },
    ],
    conversations: [
      {
        id: 1,
        contactName: 'Clínica',
        contactAvatar:
          'https://img.usecurling.com/i?q=clinic&color=azure&shape=outline',
        lastMessage: 'Lembrete: Sua consulta é na próxima semana.',
        timestamp: 'Ontem',
        unreadCount: 0,
        messages: [
          {
            id: 1,
            sender: 'Clínica',
            text: 'Olá Bruno, apenas um lembrete amigável sobre sua consulta na próxima semana.',
            timestamp: 'Ontem 11:00',
            read: true,
          },
          {
            id: 2,
            sender: 'Bruno Costa',
            text: 'Confirmado, obrigado!',
            timestamp: 'Ontem 11:05',
            read: true,
          },
        ],
      },
    ],
    performedProcedures: generateMockProcedures(),
  },
  {
    id: 3,
    profile: {
      name: 'Carla Dias',
      email: 'carla.dias@example.com',
      phone: '(31) 95555-4444',
      dob: '1992-01-30',
      cpf: '111.222.333-44',
      address: 'Rua da Bahia, 789, Belo Horizonte, MG',
      avatarUrl: 'https://img.usecurling.com/ppl/medium?gender=female&seed=3',
    },
    notifications: [
      {
        id: 1,
        read: false,
        title: 'Nova mensagem',
        description: 'Você tem uma nova mensagem da clínica.',
        time: 'há 1 hora',
      },
    ],
    appointments: [
      {
        id: 1,
        date: '2025-11-05T16:00:00',
        doctor: 'Dra. Paula Periquito',
        type: 'Avaliação Estética',
        status: 'Confirmado',
        location: 'Clínica DermApp, Sala 3',
      },
      {
        id: 2,
        date: '2025-10-10T15:00:00',
        doctor: 'Dra. Paula Periquito',
        type: 'Consulta de Rotina',
        status: 'Realizado',
        location: 'Online',
      },
    ],
    reports: [
      {
        id: 1,
        date: '2025-11-05',
        type: 'Análise de Pele',
        doctor: 'Dra. Paula Periquito',
        status: 'Em Análise',
      },
    ],
    conversations: [
      {
        id: 1,
        contactName: 'Clínica',
        contactAvatar:
          'https://img.usecurling.com/i?q=clinic&color=azure&shape=outline',
        lastMessage: 'Poderia me enviar uma foto da região?',
        timestamp: '14:30',
        unreadCount: 1,
        messages: [
          {
            id: 1,
            sender: 'Carla Dias',
            text: 'Olá, estou com uma dúvida sobre o pós-procedimento.',
            timestamp: '14:28',
            read: true,
          },
          {
            id: 2,
            sender: 'Clínica',
            text: 'Olá Carla, claro. Poderia me enviar uma foto da região?',
            timestamp: '14:30',
            read: false,
          },
        ],
      },
    ],
    performedProcedures: generateMockProcedures(),
  },
]

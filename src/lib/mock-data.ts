export const patient = {
  name: 'Ana Silva',
  email: 'ana.silva@example.com',
  phone: '(11) 98765-4321',
  dob: '1990-05-15',
  cpf: '123.456.789-00',
  address: 'Rua das Flores, 123, São Paulo, SP',
  avatarUrl: 'https://img.usecurling.com/ppl/medium?gender=female&seed=1',
}

export const notifications = [
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
    description: 'Sua consulta com Dr. Ricardo é amanhã às 10:00.',
    time: 'há 2 horas',
  },
  {
    id: 3,
    read: true,
    title: 'Nova mensagem',
    description: 'A clínica enviou uma nova mensagem para você.',
    time: 'há 1 dia',
  },
  {
    id: 4,
    read: true,
    title: 'Consulta confirmada',
    description: 'Sua consulta de rotina foi confirmada.',
    time: 'há 3 dias',
  },
]

export const appointments = [
  {
    id: 1,
    date: '2025-10-28T10:00:00',
    doctor: 'Dr. Ricardo Gomes',
    type: 'Consulta de Rotina',
    status: 'Confirmado',
    location: 'Clínica DermApp, Sala 3',
  },
  {
    id: 2,
    date: '2025-11-15T14:30:00',
    doctor: 'Dra. Carla Dias',
    type: 'Procedimento a Laser',
    status: 'Confirmado',
    location: 'Online',
  },
  {
    id: 3,
    date: '2025-09-20T09:00:00',
    doctor: 'Dr. Ricardo Gomes',
    type: 'Retorno',
    status: 'Realizado',
    location: 'Clínica DermApp, Sala 3',
  },
]

export const reports = [
  {
    id: 1,
    date: '2025-10-20',
    type: 'Biópsia de Pele',
    doctor: 'Dr. Ricardo Gomes',
    status: 'Disponível',
  },
  {
    id: 2,
    date: '2025-10-18',
    type: 'Exame de Sangue',
    doctor: 'Dra. Carla Dias',
    status: 'Disponível',
  },
  {
    id: 3,
    date: '2025-11-05',
    type: 'Dermatoscopia',
    doctor: 'Dr. Ricardo Gomes',
    status: 'Em Análise',
  },
]

export const conversations = [
  {
    id: 1,
    contactName: 'Clínica DermApp',
    contactAvatar:
      'https://img.usecurling.com/i?q=clinic&color=azure&shape=outline',
    lastMessage:
      'Olá Ana, seus resultados de exame já estão disponíveis no app.',
    timestamp: '10:40',
    unreadCount: 1,
    messages: [
      {
        id: 1,
        sender: 'Clínica DermApp',
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
  {
    id: 2,
    contactName: 'Dr. Ricardo Gomes',
    contactAvatar: 'https://img.usecurling.com/ppl/medium?gender=male&seed=2',
    lastMessage: 'Perfeito, nos vemos na consulta.',
    timestamp: 'Ontem',
    unreadCount: 0,
    messages: [
      {
        id: 1,
        sender: 'Ana Silva',
        text: 'Dr. Ricardo, bom dia. Confirmei minha consulta para o dia 28.',
        timestamp: 'Ontem 15:20',
        read: true,
      },
      {
        id: 2,
        sender: 'Dr. Ricardo Gomes',
        text: 'Perfeito, nos vemos na consulta.',
        timestamp: 'Ontem 15:22',
        read: true,
      },
    ],
  },
]

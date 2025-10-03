import { useMemo } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Users, Activity, DollarSign, Calendar } from 'lucide-react'
import { useClient } from '@/contexts/ClientContext'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { KeyIndicators } from './KeyIndicators'

export const DoctorDashboard = () => {
  const { clients } = useClient()

  const allAppointments = clients
    .flatMap((client) =>
      client.appointments.map((appt) => ({ ...appt, client })),
    )
    .filter((appt) => new Date(appt.date) > new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5)

  const allPerformedProcedures = useMemo(() => {
    return clients.flatMap((client) => client.performedProcedures)
  }, [clients])

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
          Painel do Médico
        </h1>
        <p className="text-muted-foreground">
          Visão geral da clínica e atividades recentes.
        </p>
      </section>

      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Faturamento Mensal
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 45.231,89</div>
            <p className="text-xs text-muted-foreground">
              +20.1% em relação ao mês passado
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Pacientes Ativos
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clients.length}</div>
            <p className="text-xs text-muted-foreground">+3 novos este mês</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Consultas Mês</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+124</div>
            <p className="text-xs text-muted-foreground">
              +12% em relação ao mês passado
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Taxa de Ocupação
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92%</div>
            <p className="text-xs text-muted-foreground">
              +2% em relação à semana passada
            </p>
          </CardContent>
        </Card>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">
          Indicadores de Procedimentos (Geral)
        </h2>
        <KeyIndicators performedProcedures={allPerformedProcedures} />
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Próximos Agendamentos</CardTitle>
            <CardDescription>
              Os próximos 5 agendamentos da sua agenda.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Paciente</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead className="text-right">Data e Hora</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allAppointments.map((appt) => (
                  <TableRow key={`${appt.client.id}-${appt.id}`}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={appt.client.profile.avatarUrl} />
                          <AvatarFallback>
                            {appt.client.profile.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">
                          {appt.client.profile.name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{appt.type}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {format(new Date(appt.date), "dd/MM 'às' HH:mm", {
                        locale: ptBR,
                      })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Atividade Recente</CardTitle>
            <CardDescription>
              Novos laudos e mensagens de pacientes.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center">
              <Avatar className="h-9 w-9">
                <AvatarImage
                  src="https://img.usecurling.com/ppl/thumbnail?gender=female&seed=1"
                  alt="Avatar"
                />
                <AvatarFallback>AS</AvatarFallback>
              </Avatar>
              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none">
                  Ana Silva enviou uma nova mensagem.
                </p>
                <p className="text-sm text-muted-foreground">
                  "Olá, estou com uma dúvida..."
                </p>
              </div>
              <div className="ml-auto font-medium text-sm">há 5 min</div>
            </div>
            <div className="flex items-center">
              <Avatar className="h-9 w-9">
                <AvatarImage
                  src="https://img.usecurling.com/ppl/thumbnail?gender=male&seed=2"
                  alt="Avatar"
                />
                <AvatarFallback>BC</AvatarFallback>
              </Avatar>
              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none">
                  Novo laudo de Bruno Costa disponível.
                </p>
                <p className="text-sm text-muted-foreground">
                  Exame de Sangue.
                </p>
              </div>
              <div className="ml-auto font-medium text-sm">há 1 hora</div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}

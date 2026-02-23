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
import { Users, Activity, DollarSign, Calendar, Clock } from 'lucide-react'
import { useClient } from '@/contexts/ClientContext'
import { useAuth } from '@/contexts/AuthContext'
import { format, addDays, isBefore } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { KeyIndicators } from './KeyIndicators'
import { ScrollArea } from '@/components/ui/scroll-area'

export const DoctorDashboard = () => {
  const { clients, proceduresConfig } = useClient()
  const { role } = useAuth()

  const allAppointments = clients
    .flatMap((client) =>
      client.appointments.map((appt) => ({ ...appt, client })),
    )
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  const upcomingAppointments = allAppointments
    .filter((appt) => new Date(appt.date) > new Date())
    .slice(0, 5)

  const allPerformedProcedures = useMemo(() => {
    return clients.flatMap((client) => client.performedProcedures)
  }, [clients])

  const pendingFollowUps = useMemo(() => {
    return clients
      .flatMap((client) => {
        return client.performedProcedures
          .map((proc) => {
            const config = proceduresConfig.find((p) => p.name === proc.name)
            if (!config || config.delayDays === 0) return null
            const returnDate = addDays(new Date(proc.date), config.delayDays)
            return {
              client,
              proc,
              returnDate,
            }
          })
          .filter(Boolean)
      })
      .filter((f) => f && f.returnDate > new Date())
      .sort((a, b) => a!.returnDate.getTime() - b!.returnDate.getTime())
      .slice(0, 5)
  }, [clients, proceduresConfig])

  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()

  const currentMonthAppointments = allAppointments.filter(
    (appt) =>
      new Date(appt.date).getMonth() === currentMonth &&
      new Date(appt.date).getFullYear() === currentYear,
  )
  const prevMonthAppointments = allAppointments.filter(
    (appt) => new Date(appt.date).getMonth() === currentMonth - 1,
  )

  const consultasMes = currentMonthAppointments.length
  const faturamento = consultasMes * 350
  const faturamentoPrev = prevMonthAppointments.length * 350
  const faturamentoGrowth =
    faturamentoPrev === 0
      ? 100
      : ((faturamento - faturamentoPrev) / faturamentoPrev) * 100
  const consultasGrowth =
    prevMonthAppointments.length === 0
      ? 100
      : ((consultasMes - prevMonthAppointments.length) /
          prevMonthAppointments.length) *
        100

  const title =
    role === 'admin' ? 'Painel da Administração' : 'Painel do Médico'
  const description =
    role === 'admin'
      ? 'Visão geral gerencial da clínica, faturamento e estatísticas.'
      : 'Visão geral da clínica e atividades recentes com seus pacientes.'

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
          {title}
        </h1>
        <p className="text-muted-foreground">{description}</p>
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
            <div className="text-2xl font-bold">
              R${' '}
              {faturamento.toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
              })}
            </div>
            <p className="text-xs text-muted-foreground">
              {faturamentoGrowth >= 0 ? '+' : ''}
              {faturamentoGrowth.toFixed(1)}% em relação ao mês passado
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
            <p className="text-xs text-muted-foreground">Total no sistema</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Consultas Mês</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{consultasMes}</div>
            <p className="text-xs text-muted-foreground">
              {consultasGrowth >= 0 ? '+' : ''}
              {consultasGrowth.toFixed(1)}% em relação ao mês passado
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

      <section className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Próximos Agendamentos</CardTitle>
            <CardDescription>
              Os próximos 5 agendamentos na agenda da clínica.
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
                {upcomingAppointments.length > 0 ? (
                  upcomingAppointments.map((appt) => (
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
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-4">
                      Nenhum agendamento futuro.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Retornos e Acompanhamentos Pendentes</CardTitle>
            <CardDescription>
              Pacientes que precisam agendar retorno de procedimentos.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[250px] pr-4">
              <div className="space-y-4">
                {pendingFollowUps.length > 0 ? (
                  pendingFollowUps.map((followUp, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 border rounded-lg bg-muted/20"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 border-2 border-warning">
                          <AvatarImage
                            src={followUp?.client.profile.avatarUrl}
                            alt="Avatar"
                          />
                          <AvatarFallback>
                            {followUp?.client.profile.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-semibold">
                            {followUp?.client.profile.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Pós {followUp?.proc.name}
                          </p>
                        </div>
                      </div>
                      <div className="text-right flex items-center gap-1">
                        <Clock className="h-3 w-3 text-warning" />
                        <span className="text-sm font-medium text-warning">
                          {format(followUp!.returnDate, 'dd/MM/yyyy')}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center pt-8">
                    Nenhum retorno pendente.
                  </p>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">
          Indicadores de Procedimentos (Geral)
        </h2>
        <KeyIndicators performedProcedures={allPerformedProcedures} />
      </section>
    </div>
  )
}

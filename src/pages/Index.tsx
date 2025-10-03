import { Link } from 'react-router-dom'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { appointments, reports, conversations, patient } from '@/lib/mock-data'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  Calendar,
  FileText,
  MessageSquare,
  User,
  PlusCircle,
  MessageCircle,
  UserCircle,
} from 'lucide-react'

const Dashboard = () => {
  const nextAppointment = appointments.find(
    (a) => new Date(a.date) > new Date(),
  )
  const latestReport = reports[0]
  const recentConversation = conversations[0]

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
          Olá, {patient.name.split(' ')[0]}!
        </h1>
        <p className="text-muted-foreground">
          Bem-vindo(a) ao seu painel de controle de saúde.
        </p>
      </section>

      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:shadow-interactive-hover transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold">
              Próximos Agendamentos
            </CardTitle>
            <Calendar className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {nextAppointment ? (
              <div>
                <p className="text-2xl font-bold">
                  {format(new Date(nextAppointment.date), "dd 'de' MMMM", {
                    locale: ptBR,
                  })}
                </p>
                <p className="text-muted-foreground">
                  {format(new Date(nextAppointment.date), 'HH:mm')} com{' '}
                  {nextAppointment.doctor}
                </p>
              </div>
            ) : (
              <p className="text-muted-foreground">
                Nenhum agendamento futuro.
              </p>
            )}
          </CardContent>
          <CardFooter>
            <Button asChild size="sm" className="w-full">
              <Link to="/calendario">
                {nextAppointment ? 'Ver Todos' : 'Agendar Consulta'}
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="hover:shadow-interactive-hover transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold">
              Últimos Laudos
            </CardTitle>
            <FileText className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {latestReport ? (
              <div>
                <p className="text-xl font-bold">{latestReport.type}</p>
                <p className="text-muted-foreground">
                  Disponível desde{' '}
                  {format(new Date(latestReport.date), 'dd/MM/yyyy')}
                </p>
              </div>
            ) : (
              <p className="text-muted-foreground">Nenhum laudo disponível.</p>
            )}
          </CardContent>
          <CardFooter>
            <Button asChild size="sm" className="w-full">
              <Link to="/laudos">Ver Todos</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="hover:shadow-interactive-hover transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold">
              Mensagens Recentes
            </CardTitle>
            <MessageSquare className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {recentConversation ? (
              <div>
                <p className="font-bold">{recentConversation.contactName}</p>
                <p className="text-muted-foreground truncate">
                  {recentConversation.lastMessage}
                </p>
              </div>
            ) : (
              <p className="text-muted-foreground">Nenhuma mensagem recente.</p>
            )}
          </CardContent>
          <CardFooter>
            <Button asChild size="sm" className="w-full">
              <Link to="/comunicacao">
                {recentConversation ? 'Ver Mensagens' : 'Iniciar Conversa'}
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Acesso Rápido</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <Button
            asChild
            variant="outline"
            size="lg"
            className="flex flex-col h-24 gap-2"
          >
            <Link to="/calendario">
              <PlusCircle className="h-6 w-6" />
              <span>Agendar Consulta</span>
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="flex flex-col h-24 gap-2"
          >
            <Link to="/comunicacao">
              <MessageCircle className="h-6 w-6" />
              <span>Falar com a Clínica</span>
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="flex flex-col h-24 gap-2"
          >
            <Link to="/perfil">
              <UserCircle className="h-6 w-6" />
              <span>Ver Meu Perfil</span>
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}

export default Dashboard

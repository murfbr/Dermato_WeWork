import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { format, isSameDay } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Clock } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { useClient } from '@/contexts/ClientContext'
import { Appointment } from '@/lib/mock-data'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { toast } from '@/hooks/use-toast'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

type AppointmentWithClient = Appointment & {
  client: { name: string; avatarUrl: string }
}

export const DoctorCalendar = () => {
  const { clients } = useClient()
  const [date, setDate] = useState<Date | undefined>(new Date())

  const allAppointments = useMemo(() => {
    const appointments: AppointmentWithClient[] = []
    clients.forEach((client) => {
      client.appointments.forEach((appt) => {
        appointments.push({
          ...appt,
          client: {
            name: client.profile.name,
            avatarUrl: client.profile.avatarUrl,
          },
        })
      })
    })
    return appointments.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    )
  }, [clients])

  const appointmentsForSelectedDay = useMemo(() => {
    if (!date) return []
    return allAppointments.filter((appt) =>
      isSameDay(new Date(appt.date), date),
    )
  }, [allAppointments, date])

  const handleBlockTime = () => {
    toast({
      title: 'Horário Bloqueado',
      description: 'O período selecionado foi bloqueado na sua agenda.',
    })
  }

  return (
    <div className="space-y-6 relative">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Agenda da Clínica</h1>
          <p className="text-muted-foreground">
            Visualize e gerencie todos os agendamentos.
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Clock className="mr-2 h-4 w-4" />
              Bloquear Horário
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Bloquear Horário na Agenda</DialogTitle>
              <DialogDescription>
                Selecione a data e o período que deseja bloquear.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="date" className="text-right">
                  Data
                </Label>
                <Input
                  id="date"
                  type="date"
                  className="col-span-3"
                  defaultValue={format(new Date(), 'yyyy-MM-dd')}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="startTime" className="text-right">
                  Início
                </Label>
                <Input id="startTime" type="time" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="endTime" className="text-right">
                  Fim
                </Label>
                <Input id="endTime" type="time" className="col-span-3" />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleBlockTime}>
                Bloquear
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="p-3"
              />
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>
                Agenda para{' '}
                {date ? format(date, 'PPP', { locale: ptBR }) : 'Hoje'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 max-h-[60vh] overflow-y-auto">
              {appointmentsForSelectedDay.length > 0 ? (
                appointmentsForSelectedDay.map((a) => (
                  <div
                    key={a.id}
                    className="flex items-center gap-4 p-4 border rounded-lg"
                  >
                    <div className="font-semibold text-lg">
                      {format(new Date(a.date), 'HH:mm')}
                    </div>
                    <div className="flex-1 flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={a.client.avatarUrl} />
                        <AvatarFallback>
                          {a.client.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">{a.client.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {a.type}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant={
                        a.status === 'Confirmado' ? 'default' : 'secondary'
                      }
                    >
                      {a.status}
                    </Badge>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <p>Nenhum agendamento para esta data.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

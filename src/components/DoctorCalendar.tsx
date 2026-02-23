import { useState, useMemo } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  format,
  isSameDay,
  startOfWeek,
  addDays,
  eachDayOfInterval,
} from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Clock, Plus, ChevronLeft, ChevronRight } from 'lucide-react'
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
import { toast } from '@/hooks/use-toast'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type AppointmentWithClient = Appointment & {
  client: { name: string; avatarUrl: string }
}

type View = 'month' | 'week' | 'day'

export const DoctorCalendar = () => {
  const { clients, addAppointment } = useClient()
  const [date, setDate] = useState<Date>(new Date())
  const [view, setView] = useState<View>('month')
  const [blockAllDay, setBlockAllDay] = useState(false)

  const [selectedAppt, setSelectedAppt] =
    useState<AppointmentWithClient | null>(null)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [newApptData, setNewApptData] = useState({
    clientId: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    time: '10:00',
    type: 'Consulta de Rotina',
  })

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

  const handleBlockTime = () => {
    toast({
      title: 'Horário Bloqueado',
      description: 'O período selecionado foi bloqueado na sua agenda.',
    })
  }

  const handleAddAppt = () => {
    const { clientId, date, time, type } = newApptData
    if (!clientId || !date || !time) return

    const [hours, minutes] = time.split(':')
    const apptDate = new Date(date)
    apptDate.setHours(parseInt(hours), parseInt(minutes))

    const newAppointment: Appointment = {
      id: Date.now(),
      date: apptDate.toISOString(),
      doctor: 'Dra. Flavia Novis',
      type,
      status: 'Confirmado',
      location: 'Clínica DermApp',
    }

    addAppointment(parseInt(clientId), newAppointment)
    setIsAddOpen(false)
    toast({
      title: 'Sucesso',
      description: 'Agendamento criado com sucesso.',
    })
  }

  const weekDays = eachDayOfInterval({
    start: startOfWeek(date, { locale: ptBR }),
    end: addDays(startOfWeek(date, { locale: ptBR }), 6),
  })

  const renderAppointmentsForDay = (day: Date) => {
    const appointments = allAppointments.filter((appt) =>
      isSameDay(new Date(appt.date), day),
    )
    return (
      <div className="space-y-2">
        {appointments.length > 0 ? (
          appointments.map((a) => (
            <div
              key={a.id}
              onClick={() => setSelectedAppt(a)}
              className="flex items-center gap-2 p-2 border rounded-lg text-sm cursor-pointer hover:bg-muted/50 transition-colors"
            >
              <div className="font-semibold">
                {format(new Date(a.date), 'HH:mm')}
              </div>
              <Avatar className="h-6 w-6">
                <AvatarImage src={a.client.avatarUrl} />
                <AvatarFallback>{a.client.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-semibold truncate">{a.client.name}</p>
                <p className="text-xs text-muted-foreground">{a.type}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-xs text-muted-foreground text-center pt-2">
            Nenhum agendamento.
          </p>
        )}
      </div>
    )
  }

  const renderView = () => {
    switch (view) {
      case 'month':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1">
              <CardContent className="p-0 flex justify-center">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(d) => setDate(d || new Date())}
                  className="p-3"
                />
              </CardContent>
            </Card>
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>
                  Agenda para {format(date, 'PPP', { locale: ptBR })}
                </CardTitle>
              </CardHeader>
              <CardContent className="max-h-[60vh] overflow-y-auto">
                {renderAppointmentsForDay(date)}
              </CardContent>
            </Card>
          </div>
        )
      case 'week':
        return (
          <Card>
            <CardHeader className="flex flex-row justify-between items-center">
              <CardTitle>
                Semana de {format(weekDays[0], 'd MMM')} a{' '}
                {format(weekDays[6], 'd MMM, yyyy', { locale: ptBR })}
              </CardTitle>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setDate(addDays(date, -7))}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setDate(addDays(date, 7))}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-7 gap-2">
              {weekDays.map((day) => (
                <div key={day.toString()} className="border rounded-lg p-2">
                  <h3 className="font-semibold text-center text-sm mb-2">
                    {format(day, 'EEE, dd', { locale: ptBR })}
                  </h3>
                  <ScrollArea className="h-64">
                    {renderAppointmentsForDay(day)}
                  </ScrollArea>
                </div>
              ))}
            </CardContent>
          </Card>
        )
      case 'day':
        return (
          <Card>
            <CardHeader className="flex flex-row justify-between items-center">
              <CardTitle>
                Agenda para {format(date, 'PPPP', { locale: ptBR })}
              </CardTitle>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setDate(addDays(date, -1))}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setDate(addDays(date, 1))}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="max-h-[70vh] overflow-y-auto">
              {renderAppointmentsForDay(date)}
            </CardContent>
          </Card>
        )
    }
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Agenda da Clínica</h1>
          <p className="text-muted-foreground">
            Visualize e gerencie todos os agendamentos.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <ToggleGroup
            type="single"
            defaultValue="month"
            value={view}
            onValueChange={(v: View) => v && setView(v)}
          >
            <ToggleGroupItem value="month">Mês</ToggleGroupItem>
            <ToggleGroupItem value="week">Semana</ToggleGroupItem>
            <ToggleGroupItem value="day">Dia</ToggleGroupItem>
          </ToggleGroup>

          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button variant="default">
                <Plus className="mr-2 h-4 w-4" />
                Agendar
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Novo Agendamento</DialogTitle>
                <DialogDescription>
                  Adicione um novo evento na agenda da clínica.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label>Paciente</Label>
                  <Select
                    value={newApptData.clientId}
                    onValueChange={(v) =>
                      setNewApptData({ ...newApptData, clientId: v })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o paciente" />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.map((c) => (
                        <SelectItem key={c.id} value={c.id.toString()}>
                          {c.profile.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Tipo de Consulta</Label>
                  <Select
                    value={newApptData.type}
                    onValueChange={(v) =>
                      setNewApptData({ ...newApptData, type: v })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Consulta de Rotina">
                        Consulta de Rotina
                      </SelectItem>
                      <SelectItem value="Avaliação de Procedimento">
                        Avaliação de Procedimento
                      </SelectItem>
                      <SelectItem value="Retorno">Retorno</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Data</Label>
                    <Input
                      type="date"
                      value={newApptData.date}
                      onChange={(e) =>
                        setNewApptData({ ...newApptData, date: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Hora</Label>
                    <Input
                      type="time"
                      value={newApptData.time}
                      onChange={(e) =>
                        setNewApptData({ ...newApptData, time: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleAddAppt}>Confirmar</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
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
                <div className="flex items-center space-x-2">
                  <Switch
                    id="block-all-day"
                    checked={blockAllDay}
                    onCheckedChange={setBlockAllDay}
                  />
                  <Label htmlFor="block-all-day">Bloquear o dia todo</Label>
                </div>
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
                {!blockAllDay && (
                  <>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="startTime" className="text-right">
                        Início
                      </Label>
                      <Input
                        id="startTime"
                        type="time"
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="endTime" className="text-right">
                        Fim
                      </Label>
                      <Input id="endTime" type="time" className="col-span-3" />
                    </div>
                  </>
                )}
              </div>
              <DialogFooter>
                <Button type="submit" onClick={handleBlockTime}>
                  Bloquear
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </header>
      {renderView()}

      <Dialog
        open={!!selectedAppt}
        onOpenChange={(open) => !open && setSelectedAppt(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detalhes do Agendamento</DialogTitle>
          </DialogHeader>
          {selectedAppt && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12 border">
                  <AvatarImage src={selectedAppt.client.avatarUrl} />
                  <AvatarFallback>
                    {selectedAppt.client.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-lg">
                    {selectedAppt.client.name}
                  </p>
                  <p className="text-sm text-muted-foreground">Paciente</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 bg-muted/30 p-4 rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground font-medium">
                    Procedimento
                  </p>
                  <p>{selectedAppt.type}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-medium">
                    Data e Hora
                  </p>
                  <p>
                    {format(
                      new Date(selectedAppt.date),
                      "dd/MM/yyyy 'às' HH:mm",
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-medium">
                    Status
                  </p>
                  <p>{selectedAppt.status}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-medium">
                    Local
                  </p>
                  <p>{selectedAppt.location}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

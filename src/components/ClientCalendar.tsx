import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Plus } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useClient } from '@/contexts/ClientContext'
import { Label } from '@/components/ui/label'
import { toast } from '@/hooks/use-toast'
import { Appointment } from '@/lib/mock-data'

export const ClientCalendar = () => {
  const { currentClient, addAppointment } = useClient()
  const appointments = currentClient?.appointments || []
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [selectedTime, setSelectedTime] = useState<string>('')
  const [selectedType, setSelectedType] = useState<string>('Consulta de Rotina')
  const [step, setStep] = useState(1)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const availableTimes = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00']

  const handleNewAppointment = () => {
    if (!currentClient || !date || !selectedTime) return

    const [hours, minutes] = selectedTime.split(':')
    const apptDate = new Date(date)
    apptDate.setHours(parseInt(hours), parseInt(minutes))

    const newAppointment: Appointment = {
      id: Date.now(),
      date: apptDate.toISOString(),
      doctor: 'Dra. Flavia Novis',
      type: selectedType,
      status: 'Confirmado',
      location: 'Clínica DermApp',
    }

    addAppointment(currentClient.id, newAppointment)

    toast({
      title: 'Agendamento Confirmado!',
      description: `Sua ${selectedType} foi agendada para ${date.toLocaleDateString(
        'pt-BR',
      )} às ${selectedTime}.`,
      variant: 'default',
    })
    setIsDialogOpen(false)
    setStep(1)
    setDate(new Date())
    setSelectedTime('')
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div>
            <DialogDescription>
              Selecione o serviço, a data e o horário desejado para o
              agendamento.
            </DialogDescription>
            <div className="space-y-4 mt-4">
              <div>
                <Label>Serviço</Label>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tipo de Consulta" />
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
              <div className="flex flex-col items-center">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={(date) => date < new Date()}
                />
              </div>
              <div>
                <Label>Horário</Label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {availableTimes.map((time) => (
                    <Button
                      key={time}
                      variant={selectedTime === time ? 'default' : 'outline'}
                      onClick={() => setSelectedTime(time)}
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )
      case 2:
        return (
          <div>
            <DialogDescription>
              Confirme os detalhes do agendamento para{' '}
              <strong>{currentClient?.profile.name}</strong>.
            </DialogDescription>
            <div className="mt-4 space-y-2 text-sm p-4 bg-muted rounded-lg">
              <p>
                <strong>Serviço:</strong> {selectedType}
              </p>
              <p>
                <strong>Data:</strong>{' '}
                {date ? format(date, 'PPP', { locale: ptBR }) : ''}
              </p>
              <p>
                <strong>Horário:</strong> {selectedTime}
              </p>
              <p>
                <strong>Médico:</strong> Dra. Flavia Novis
              </p>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-6 relative">
      <header>
        <h1 className="text-2xl md:text-3xl font-bold">
          Calendário e Agendamentos
        </h1>
        <p className="text-muted-foreground">
          Gerencie suas consultas e agende novos horários.
        </p>
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Calendário</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Seus Agendamentos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {appointments.length > 0 ? (
              appointments.map((a) => (
                <div key={a.id} className="p-4 border rounded-lg">
                  <p className="font-semibold">
                    {a.type} com {a.doctor}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(a.date), 'PPPPp', { locale: ptBR })} -{' '}
                    {a.status}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground">Nenhum agendamento.</p>
            )}
          </CardContent>
        </Card>
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button className="fixed bottom-20 right-6 md:bottom-8 md:right-8 h-16 w-16 rounded-full shadow-lg hover:scale-105 transition-transform">
            <Plus className="h-8 w-8" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agendar Nova Consulta - Etapa {step}/2</DialogTitle>
          </DialogHeader>
          <div className="py-4">{renderStep()}</div>
          <DialogFooter>
            {step > 1 && (
              <Button variant="outline" onClick={() => setStep((s) => s - 1)}>
                Voltar
              </Button>
            )}
            {step < 2 ? (
              <Button
                onClick={() => setStep((s) => s + 1)}
                disabled={!date || !selectedTime}
              >
                Avançar
              </Button>
            ) : (
              <Button onClick={handleNewAppointment}>Confirmar</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

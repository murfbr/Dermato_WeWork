import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { appointments as mockAppointments } from '@/lib/mock-data'
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

export default function Calendario() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [appointments] = useState(mockAppointments)
  const [step, setStep] = useState(1)

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div>
            <DialogDescription>Selecione o serviço desejado.</DialogDescription>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Tipo de Consulta" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rotina">Consulta de Rotina</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )
      case 2:
        return (
          <div>
            <DialogDescription>Escolha o profissional.</DialogDescription>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Dermatologista" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dr-ricardo">Dr. Ricardo Gomes</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )
      case 3:
        return (
          <div>
            <DialogDescription>Selecione a data e hora.</DialogDescription>
            <Calendar mode="single" selected={date} onSelect={setDate} />
          </div>
        )
      case 4:
        return (
          <div>
            <DialogDescription>
              Confirme os detalhes do seu agendamento.
            </DialogDescription>
            <p>
              Consulta de Rotina com Dr. Ricardo Gomes em{' '}
              {date?.toLocaleDateString()}.
            </p>
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
        <p className="text-muted-foreground">Gerencie suas consultas.</p>
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
            <CardTitle>Agendamentos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {appointments.map((a) => (
              <div key={a.id} className="p-4 border rounded-lg">
                <p className="font-semibold">
                  {a.type} com {a.doctor}
                </p>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(a.date), 'PPPPp', { locale: ptBR })} -{' '}
                  {a.status}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="fixed bottom-20 right-6 md:bottom-8 md:right-8 h-16 w-16 rounded-full shadow-lg">
            <Plus className="h-8 w-8" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agendar Nova Consulta - Etapa {step}/4</DialogTitle>
          </DialogHeader>
          <div className="py-4">{renderStep()}</div>
          <DialogFooter>
            {step > 1 && (
              <Button variant="outline" onClick={() => setStep((s) => s - 1)}>
                Voltar
              </Button>
            )}
            {step < 4 ? (
              <Button onClick={() => setStep((s) => s + 1)}>Avançar</Button>
            ) : (
              <Button>Confirmar</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

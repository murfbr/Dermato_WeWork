import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { doctor, procedures, Procedure } from '@/lib/mock-data'
import { toast } from '@/components/ui/use-toast'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Badge } from '@/components/ui/badge'
import { Check, ChevronsUpDown, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export const DoctorProfile = () => {
  const [doctorData, setDoctorData] = useState(doctor)
  const [selectedProcedures, setSelectedProcedures] = useState<Procedure[]>(
    procedures.filter((p) => doctor.practicedProcedures.includes(p.id)),
  )
  const [open, setOpen] = useState(false)

  const handleSave = (section: string) => {
    toast({
      title: 'Sucesso!',
      description: `As informações da seção "${section}" foram salvas.`,
    })
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <header>
        <h1 className="text-2xl md:text-3xl font-bold">Perfil do Médico</h1>
        <p className="text-muted-foreground">
          Gerencie suas informações profissionais e preferências.
        </p>
      </header>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20 border-4 border-primary">
              <AvatarImage src={doctorData.avatarUrl} alt={doctorData.name} />
              <AvatarFallback>
                {doctorData.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">{doctorData.name}</CardTitle>
              <CardDescription>{doctorData.email}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Label htmlFor="name">Nome</Label>
          <Input
            id="name"
            value={doctorData.name}
            onChange={(e) =>
              setDoctorData({ ...doctorData, name: e.target.value })
            }
          />
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            value={doctorData.bio}
            onChange={(e) =>
              setDoctorData({ ...doctorData, bio: e.target.value })
            }
            rows={4}
          />
        </CardContent>
        <CardFooter>
          <Button onClick={() => handleSave('Informações Pessoais')}>
            Salvar Alterações
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Procedimentos Realizados</CardTitle>
          <CardDescription>
            Selecione os procedimentos que você realiza na clínica.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between h-auto min-h-10"
              >
                <div className="flex gap-1 flex-wrap">
                  {selectedProcedures.length > 0 ? (
                    selectedProcedures.map((proc) => (
                      <Badge
                        variant="secondary"
                        key={proc.id}
                        className="mr-1 mb-1"
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedProcedures(
                            selectedProcedures.filter((p) => p.id !== proc.id),
                          )
                        }}
                      >
                        {proc.name}
                        <X className="ml-1 h-3 w-3" />
                      </Badge>
                    ))
                  ) : (
                    <span className="text-muted-foreground">
                      Selecione os procedimentos...
                    </span>
                  )}
                </div>
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
              <Command>
                <CommandInput placeholder="Buscar procedimento..." />
                <CommandList>
                  <CommandEmpty>Nenhum procedimento encontrado.</CommandEmpty>
                  <CommandGroup>
                    {procedures.map((proc) => (
                      <CommandItem
                        key={proc.id}
                        onSelect={() => {
                          const isSelected = selectedProcedures.some(
                            (p) => p.id === proc.id,
                          )
                          if (isSelected) {
                            setSelectedProcedures(
                              selectedProcedures.filter(
                                (p) => p.id !== proc.id,
                              ),
                            )
                          } else {
                            setSelectedProcedures([...selectedProcedures, proc])
                          }
                        }}
                      >
                        <Check
                          className={cn(
                            'mr-2 h-4 w-4',
                            selectedProcedures.some((p) => p.id === proc.id)
                              ? 'opacity-100'
                              : 'opacity-0',
                          )}
                        />
                        {proc.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </CardContent>
        <CardFooter>
          <Button onClick={() => handleSave('Procedimentos')}>
            Salvar Procedimentos
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Preferências de Notificação</CardTitle>
          <CardDescription>
            Escolha como você deseja ser notificado.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <Label htmlFor="new-appointments">Novos Agendamentos</Label>
              <p className="text-sm text-muted-foreground">
                Receber alerta quando um novo agendamento for feito.
              </p>
            </div>
            <Switch
              id="new-appointments"
              checked={doctorData.notificationSettings.newAppointments}
              onCheckedChange={(checked) =>
                setDoctorData({
                  ...doctorData,
                  notificationSettings: {
                    ...doctorData.notificationSettings,
                    newAppointments: checked,
                  },
                })
              }
            />
          </div>
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <Label htmlFor="chat-messages">Mensagens no Chat</Label>
              <p className="text-sm text-muted-foreground">
                Receber alerta para novas mensagens de pacientes.
              </p>
            </div>
            <Switch
              id="chat-messages"
              checked={doctorData.notificationSettings.chatMessages}
              onCheckedChange={(checked) =>
                setDoctorData({
                  ...doctorData,
                  notificationSettings: {
                    ...doctorData.notificationSettings,
                    chatMessages: checked,
                  },
                })
              }
            />
          </div>
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <Label htmlFor="report-available">Novos Laudos Disponíveis</Label>
              <p className="text-sm text-muted-foreground">
                Receber alerta quando um laudo de paciente for liberado.
              </p>
            </div>
            <Switch
              id="report-available"
              checked={doctorData.notificationSettings.reportAvailable}
              onCheckedChange={(checked) =>
                setDoctorData({
                  ...doctorData,
                  notificationSettings: {
                    ...doctorData.notificationSettings,
                    reportAvailable: checked,
                  },
                })
              }
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={() => handleSave('Notificações')}>
            Salvar Preferências
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

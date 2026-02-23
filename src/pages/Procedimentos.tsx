import { useState } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import { useClient } from '@/contexts/ClientContext'
import { PerformedProcedure } from '@/lib/mock-data'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  Stethoscope,
  Image as ImageIcon,
  Info,
  Camera,
  Plus,
} from 'lucide-react'
import { BeforeAfterSlider } from '@/components/BeforeAfterSlider'
import { Skeleton } from '@/components/ui/skeleton'
import { useAuth } from '@/contexts/AuthContext'
import { PhotoUploadDialog } from '@/components/PhotoUploadDialog'
import { toast } from 'sonner'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'

const ProcedureHistoryCard = ({
  procedure,
  role,
  onManagePhotos,
}: {
  procedure: PerformedProcedure
  role: string
  onManagePhotos: (proc: PerformedProcedure) => void
}) => {
  const hasImages = procedure.beforeImageUrl && procedure.afterImages.length > 0

  return (
    <Card className="flex flex-col group hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-center gap-4">
          <div className="bg-primary/10 p-3 rounded-full group-hover:scale-110 transition-transform">
            <Stethoscope className="h-6 w-6 text-primary" />
          </div>
          <div>
            <CardTitle>{procedure.name}</CardTitle>
            <CardDescription>
              Realizado em:{' '}
              {format(new Date(procedure.date), 'dd/MM/yyyy', { locale: ptBR })}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground">
          {procedure.name === 'Botox'
            ? 'Aplicação para relaxamento muscular e suavização de rugas.'
            : procedure.name === 'Preenchimento'
              ? 'Uso de preenchedores para restaurar volume e contorno.'
              : procedure.name === 'Lifting Facial'
                ? 'Técnicas para promover o rejuvenescimento e firmeza da pele.'
                : 'Consulta de acompanhamento e cuidados com a pele.'}
        </p>
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        {hasImages ? (
          <Dialog>
            <DialogTrigger asChild>
              <Button className="w-full bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary">
                <ImageIcon className="mr-2 h-4 w-4" />
                Ver Evolução
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-6xl w-[95vw] h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Comparativo: {procedure.name}</DialogTitle>
                <DialogDescription>
                  Procedimento de{' '}
                  {format(new Date(procedure.date), 'dd/MM/yyyy', {
                    locale: ptBR,
                  })}
                </DialogDescription>
              </DialogHeader>
              <BeforeAfterSlider
                beforeImage={procedure.beforeImageUrl}
                afterImages={procedure.afterImages}
              />
            </DialogContent>
          </Dialog>
        ) : (
          <Button
            variant="outline"
            disabled
            className="w-full cursor-not-allowed opacity-50"
          >
            <Info className="mr-2 h-4 w-4" />
            Sem comparativo
          </Button>
        )}

        {role !== 'client' && (
          <Button
            variant="secondary"
            className="w-full"
            onClick={() => onManagePhotos(procedure)}
          >
            <Camera className="mr-2 h-4 w-4" />
            Gerenciar Fotos
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

export default function Procedimentos() {
  const {
    currentClient,
    addProcedure,
    updateProcedure,
    proceduresConfig,
    addNotification,
  } = useClient()
  const { role } = useAuth()
  const [selectedProcedure, setSelectedProcedure] =
    useState<PerformedProcedure | null>(null)

  const [isAddProcedureOpen, setIsAddProcedureOpen] = useState(false)
  const [newProcedureName, setNewProcedureName] = useState<string>('')

  const handleAddProcedureConfirm = () => {
    if (!currentClient || !newProcedureName) return
    const newProcedure: PerformedProcedure = {
      id: Date.now(),
      date: new Date().toISOString(),
      name: newProcedureName as any,
      beforeImageUrl: '',
      afterImages: [],
    }
    addProcedure(currentClient.id, newProcedure)

    // Check delay for automated notification
    const config = proceduresConfig.find((p) => p.name === newProcedureName)
    if (config && config.delayDays > 0) {
      addNotification(currentClient.id, {
        id: Date.now(),
        read: false,
        title: 'Retorno Agendado',
        description: `Seu retorno para avaliação de ${newProcedureName} está programado para daqui a ${config.delayDays} dias.`,
        time: 'agora',
      })
      toast.success(
        `Procedimento adicionado. Retorno agendado em ${config.delayDays} dias.`,
      )
    } else {
      toast.success('Novo procedimento adicionado com sucesso!')
    }

    setIsAddProcedureOpen(false)
    setNewProcedureName('')
  }

  if (!currentClient) {
    return (
      <div className="space-y-6">
        <header>
          <Skeleton className="h-8 w-1/2 mb-2" />
          <Skeleton className="h-5 w-3/4" />
        </header>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    )
  }

  const { performedProcedures, profile } = currentClient

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">
            Histórico de Procedimentos
          </h1>
          <p className="text-muted-foreground">
            Veja a evolução dos tratamentos de {profile.name.split(' ')[0]}.
          </p>
        </div>
        {role !== 'client' && (
          <Dialog
            open={isAddProcedureOpen}
            onOpenChange={setIsAddProcedureOpen}
          >
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Novo Procedimento
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Registrar Novo Procedimento</DialogTitle>
                <DialogDescription>
                  Selecione o tipo de procedimento realizado.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4 space-y-4">
                <div className="space-y-2">
                  <Label>Procedimento</Label>
                  <Select
                    value={newProcedureName}
                    onValueChange={setNewProcedureName}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      {proceduresConfig.map((p) => (
                        <SelectItem key={p.id} value={p.name}>
                          {p.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsAddProcedureOpen(false)}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleAddProcedureConfirm}
                  disabled={!newProcedureName}
                >
                  Salvar Registro
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </header>

      {performedProcedures.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {performedProcedures.map((procedure) => (
            <ProcedureHistoryCard
              key={procedure.id}
              procedure={procedure}
              role={role}
              onManagePhotos={setSelectedProcedure}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center py-16 border-2 border-dashed rounded-lg bg-muted/30">
          <Stethoscope className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
          <h3 className="text-xl font-semibold">
            Nenhum procedimento encontrado
          </h3>
          <p className="text-muted-foreground mt-2">
            O histórico de procedimentos deste paciente está vazio.
          </p>
        </div>
      )}

      <Dialog
        open={!!selectedProcedure}
        onOpenChange={(open) => !open && setSelectedProcedure(null)}
      >
        <DialogContent className="max-w-2xl">
          {selectedProcedure && (
            <PhotoUploadDialog
              procedure={selectedProcedure}
              onSave={(data) => {
                if (currentClient) {
                  updateProcedure(currentClient.id, selectedProcedure.id, data)
                }
              }}
              onClose={() => setSelectedProcedure(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

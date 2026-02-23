import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
  Microscope,
  TestTube,
  Search,
  FileDown,
  FileText,
  Plus,
  Upload,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { useClient } from '@/contexts/ClientContext'
import { useAuth } from '@/contexts/AuthContext'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Report } from '@/lib/mock-data'

const getIconForType = (type: string) => {
  if (type.toLowerCase().includes('biópsia'))
    return <Microscope className="h-8 w-8 text-primary" />
  if (type.toLowerCase().includes('sangue'))
    return <TestTube className="h-8 w-8 text-primary" />
  return <FileText className="h-8 w-8 text-primary" />
}

export default function Laudos() {
  const { currentClient, addReport } = useClient()
  const { role } = useAuth()
  const reports = currentClient?.reports || []
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('todos')
  const [sortBy, setSortBy] = useState('recentes')

  const [isAddReportOpen, setIsAddReportOpen] = useState(false)
  const [newReportType, setNewReportType] = useState('')
  const [isUploading, setIsUploading] = useState(false)

  const filteredReports = useMemo(() => {
    return reports
      .filter((report) => {
        const searchMatch =
          report.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
          report.doctor.toLowerCase().includes(searchTerm.toLowerCase())
        const typeMatch =
          filterType === 'todos' ||
          report.type.toLowerCase().includes(filterType.toLowerCase())
        return searchMatch && typeMatch
      })
      .sort((a, b) => {
        if (sortBy === 'recentes') {
          return new Date(b.date).getTime() - new Date(a.date).getTime()
        }
        return new Date(a.date).getTime() - new Date(b.date).getTime()
      })
  }, [reports, searchTerm, filterType, sortBy])

  const handleAddReport = () => {
    if (!newReportType || !currentClient) {
      toast.error('Preencha o tipo de exame.')
      return
    }

    setIsUploading(true)
    setTimeout(() => {
      const report: Report = {
        id: Date.now(),
        date: new Date().toISOString(),
        type: newReportType,
        doctor:
          role === 'client' ? 'Enviado pelo Paciente' : 'Clínica / Dra. Flavia',
        status: role === 'client' ? 'Em Análise' : 'Disponível',
      }
      addReport(currentClient.id, report)
      setIsUploading(false)
      setIsAddReportOpen(false)
      setNewReportType('')
      toast.success('Laudo adicionado com sucesso!')
    }, 1500)
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">
            Laudos de {currentClient?.profile.name}
          </h1>
          <p className="text-muted-foreground">
            Visualize e gerencie os resultados de exames do paciente.
          </p>
        </div>
        <Dialog open={isAddReportOpen} onOpenChange={setIsAddReportOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Novo Laudo
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Novo Laudo</DialogTitle>
              <DialogDescription>
                Faça o upload do resultado de exame.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="reportType">Tipo de Exame</Label>
                <Input
                  id="reportType"
                  placeholder="Ex: Hemograma, Biópsia..."
                  value={newReportType}
                  onChange={(e) => setNewReportType(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Arquivo</Label>
                <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-muted-foreground hover:bg-muted/50 cursor-pointer transition-colors">
                  <Upload className="h-8 w-8 mb-2" />
                  <p className="text-sm">
                    Clique para selecionar ou arraste o arquivo aqui
                  </p>
                  <p className="text-xs mt-1 opacity-70">
                    PDF, JPG ou PNG (Max 5MB)
                  </p>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsAddReportOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleAddReport}
                disabled={isUploading || !newReportType}
              >
                {isUploading ? 'Enviando...' : 'Salvar Laudo'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </header>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            <div className="relative w-full md:max-w-xs">
              <Input
                placeholder="Buscar por palavra-chave..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filtrar por tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os Tipos</SelectItem>
                  <SelectItem value="Biópsia de Pele">
                    Biópsia de Pele
                  </SelectItem>
                  <SelectItem value="Exame de Sangue">
                    Exame de Sangue
                  </SelectItem>
                  <SelectItem value="Dermatoscopia">Dermatoscopia</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recentes">Mais Recentes</SelectItem>
                  <SelectItem value="antigos">Mais Antigos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredReports.length > 0 ? (
              filteredReports.map((report) => (
                <div
                  key={report.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg hover:bg-muted/50 gap-4 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    {getIconForType(report.type)}
                    <div>
                      <p className="font-semibold text-lg">{report.type}</p>
                      <p className="text-sm text-muted-foreground">
                        Data:{' '}
                        {new Date(report.date).toLocaleDateString('pt-BR', {
                          timeZone: 'UTC',
                        })}{' '}
                        | {report.doctor}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                    <Badge
                      className={cn({
                        'bg-success/20 text-success-foreground border-success/20':
                          report.status === 'Disponível',
                        'bg-warning/20 text-warning-foreground border-warning/20':
                          report.status !== 'Disponível',
                      })}
                    >
                      {report.status}
                    </Badge>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          disabled={report.status !== 'Disponível'}
                        >
                          Ver Laudo
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>{report.type}</DialogTitle>
                          <DialogDescription>
                            Laudo de{' '}
                            {new Date(report.date).toLocaleDateString('pt-BR', {
                              timeZone: 'UTC',
                            })}{' '}
                            - {report.doctor}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="py-4 space-y-2">
                          <p className="font-semibold">Resultados:</p>
                          <div className="p-4 border rounded-md bg-muted/50 text-sm space-y-2">
                            <p>
                              <strong>Paciente:</strong>{' '}
                              {currentClient?.profile.name}
                            </p>
                            <p>
                              <strong>Amostra:</strong> Tecido cutâneo, região
                              dorsal.
                            </p>
                            <p>
                              <strong>Diagnóstico:</strong> Nevo melanocítico
                              intradérmico, sem atipias.
                            </p>
                            <p>
                              <strong>Comentários:</strong> Margens cirúrgicas
                              livres de lesão.
                            </p>
                          </div>
                        </div>
                        <Button className="w-full sm:w-auto">
                          <FileDown className="mr-2 h-4 w-4" /> Baixar PDF
                        </Button>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-16 border-2 border-dashed rounded-lg text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="font-semibold text-lg">Nenhum laudo encontrado</p>
                <p className="text-sm mt-1">
                  Tente ajustar os filtros ou adicione um novo laudo.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

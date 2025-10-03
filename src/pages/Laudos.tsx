import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
} from '@/components/ui/dialog'
import { reports as mockReports } from '@/lib/mock-data'
import { Microscope, TestTube, Search, FileDown, FileText } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const getIconForType = (type: string) => {
  if (type.toLowerCase().includes('biópsia'))
    return <Microscope className="h-8 w-8 text-primary" />
  if (type.toLowerCase().includes('sangue'))
    return <TestTube className="h-8 w-8 text-primary" />
  return <FileText className="h-8 w-8 text-primary" />
}

export default function Laudos() {
  const [reports] = useState(mockReports)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('todos')
  const [sortBy, setSortBy] = useState('recentes')

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

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl md:text-3xl font-bold">Meus Laudos</h1>
        <p className="text-muted-foreground">
          Visualize e gerencie seus resultados de exames.
        </p>
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
            <div className="flex gap-4">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-full md:w-[180px]">
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
                <SelectTrigger className="w-full md:w-[180px]">
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
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg hover:bg-muted/50 gap-4"
                >
                  <div className="flex items-center gap-4">
                    {getIconForType(report.type)}
                    <div>
                      <p className="font-semibold">{report.type}</p>
                      <p className="text-sm text-muted-foreground">
                        Data:{' '}
                        {new Date(report.date).toLocaleDateString('pt-BR', {
                          timeZone: 'UTC',
                        })}{' '}
                        | Dr(a). {report.doctor}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <Badge
                      className={cn({
                        'bg-success/20 text-success-foreground border-success/20 hover:bg-success/30':
                          report.status === 'Disponível',
                        'bg-warning/20 text-warning-foreground border-warning/20 hover:bg-warning/30':
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
                            - Dr(a). {report.doctor}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="py-4 space-y-2">
                          <p className="font-semibold">Resultados:</p>
                          <div className="p-4 border rounded-md bg-muted/50 text-sm">
                            <p>
                              <strong>Paciente:</strong> Ana Silva
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
                        <Button>
                          <FileDown className="mr-2 h-4 w-4" /> Baixar Laudo
                        </Button>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <p className="font-semibold">Nenhum laudo encontrado</p>
                <p className="text-sm">
                  Tente ajustar os filtros ou o termo de busca.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

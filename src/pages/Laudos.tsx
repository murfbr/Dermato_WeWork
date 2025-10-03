import { useState } from 'react'
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
import { Microscope, TestTube, Search, FileDown } from 'lucide-react'

const getIconForType = (type: string) => {
  if (type.toLowerCase().includes('biópsia'))
    return <Microscope className="h-8 w-8 text-primary" />
  if (type.toLowerCase().includes('sangue'))
    return <TestTube className="h-8 w-8 text-primary" />
  return <FileText className="h-8 w-8 text-primary" />
}

export default function Laudos() {
  const [reports] = useState(mockReports)

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
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            </div>
            <div className="flex gap-4">
              <Select>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Filtrar por tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="biopsia">Biópsia</SelectItem>
                  <SelectItem value="sangue">Sangue</SelectItem>
                </SelectContent>
              </Select>
              <Select>
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
            {reports.map((report) => (
              <div
                key={report.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50"
              >
                <div className="flex items-center gap-4">
                  {getIconForType(report.type)}
                  <div>
                    <p className="font-semibold">{report.type}</p>
                    <p className="text-sm text-muted-foreground">
                      Data: {report.date} | Dr(a). {report.doctor}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-sm font-medium px-2 py-1 rounded-full ${report.status === 'Disponível' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}
                  >
                    {report.status}
                  </span>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>Ver Laudo</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{report.type}</DialogTitle>
                        <DialogDescription>
                          Laudo de {report.date} - Dr(a). {report.doctor}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="py-4">
                        <p className="font-semibold">Resultados:</p>
                        <p>
                          Conteúdo do laudo em PDF ou formato estruturado seria
                          exibido aqui.
                        </p>
                      </div>
                      <Button>
                        <FileDown className="mr-2 h-4 w-4" /> Baixar Laudo
                      </Button>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

import { useClient } from '@/contexts/ClientContext'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { toast } from 'sonner'
import { useAuth } from '@/contexts/AuthContext'
import { Navigate } from 'react-router-dom'

export default function Configuracoes() {
  const { proceduresConfig, updateProcedureConfig } = useClient()
  const { role } = useAuth()

  const [delays, setDelays] = useState<Record<string, number>>(
    proceduresConfig.reduce((acc, p) => ({ ...acc, [p.id]: p.delayDays }), {}),
  )

  if (role === 'client') {
    return <Navigate to="/" replace />
  }

  const handleSave = (id: string) => {
    updateProcedureConfig(id, delays[id])
    toast.success('Configuração salva com sucesso!')
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <header>
        <h1 className="text-2xl md:text-3xl font-bold">
          Configurações do Sistema
        </h1>
        <p className="text-muted-foreground">
          Parametrize as regras de negócios da clínica.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>
            Acompanhamento de Procedimentos (Resultados Tardios)
          </CardTitle>
          <CardDescription>
            Configure o tempo em dias para notificar o paciente sobre o retorno
            para avaliação final do procedimento.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {proceduresConfig.map((proc) => (
            <div
              key={proc.id}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex-1">
                <p className="font-semibold text-lg">{proc.name}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {proc.description}
                </p>
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="flex flex-col gap-1">
                  <Label
                    htmlFor={`delay-${proc.id}`}
                    className="text-xs text-muted-foreground"
                  >
                    Dias de espera
                  </Label>
                  <Input
                    id={`delay-${proc.id}`}
                    type="number"
                    min="0"
                    className="w-24 text-center"
                    value={delays[proc.id]}
                    onChange={(e) =>
                      setDelays({
                        ...delays,
                        [proc.id]: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>
                <Button
                  variant="secondary"
                  className="mt-5"
                  onClick={() => handleSave(proc.id)}
                >
                  Salvar
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

import { useMemo } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from 'recharts'
import { format, getMonth, getYear, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { PerformedProcedure } from '@/lib/mock-data'
import { Badge } from '@/components/ui/badge'

interface KeyIndicatorsProps {
  performedProcedures: PerformedProcedure[]
}

type MonthlyData = {
  month: string
  total: number
}

type MonthlyBreakdown = {
  monthName: string
  total: number
  topProcedures: { name: string; count: number }[]
}

export const KeyIndicators = ({ performedProcedures }: KeyIndicatorsProps) => {
  const { chartData, monthlyBreakdown } = useMemo(() => {
    const currentYear = new Date().getFullYear()
    const monthlyData: { [key: number]: PerformedProcedure[] } = {}

    for (let i = 0; i < 12; i++) {
      monthlyData[i] = []
    }

    performedProcedures.forEach((proc) => {
      const procDate = parseISO(proc.date)
      if (getYear(procDate) === currentYear) {
        const month = getMonth(procDate)
        monthlyData[month].push(proc)
      }
    })

    const chartDataResult: MonthlyData[] = []
    const monthlyBreakdownResult: MonthlyBreakdown[] = []
    const currentMonth = new Date().getMonth()

    for (let i = 0; i <= currentMonth; i++) {
      const monthProcedures = monthlyData[i]
      const monthName = format(new Date(currentYear, i), 'MMMM', {
        locale: ptBR,
      })
      const monthAbbr = format(new Date(currentYear, i), 'MMM', {
        locale: ptBR,
      })

      chartDataResult.push({
        month: monthAbbr.charAt(0).toUpperCase() + monthAbbr.slice(1),
        total: monthProcedures.length,
      })

      const procedureCounts: { [key: string]: number } = {}
      monthProcedures.forEach((proc) => {
        procedureCounts[proc.name] = (procedureCounts[proc.name] || 0) + 1
      })

      const topProcedures = Object.entries(procedureCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3)
        .map(([name, count]) => ({ name, count }))

      monthlyBreakdownResult.push({
        monthName: monthName.charAt(0).toUpperCase() + monthName.slice(1),
        total: monthProcedures.length,
        topProcedures,
      })
    }

    return {
      chartData: chartDataResult,
      monthlyBreakdown: monthlyBreakdownResult.reverse(),
    }
  }, [performedProcedures])

  const chartConfig = {
    total: {
      label: 'Total',
      color: 'hsl(var(--primary))',
    },
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Total de Atendimentos por Mês</CardTitle>
          <CardDescription>Ano de {new Date().getFullYear()}</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[250px] w-full">
            <ResponsiveContainer>
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 20, left: -10, bottom: 5 }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                />
                <YAxis />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dot" />}
                />
                <Bar dataKey="total" fill="var(--color-total)" radius={4} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {monthlyBreakdown.map((monthData) => (
          <Card key={monthData.monthName}>
            <CardHeader>
              <CardTitle>{monthData.monthName}</CardTitle>
              <CardDescription>
                Total de {monthData.total} atendimentos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <h4 className="font-semibold mb-2">Top 3 Procedimentos</h4>
              <ul className="space-y-2">
                {monthData.topProcedures.length > 0 ? (
                  monthData.topProcedures.map((proc) => (
                    <li
                      key={proc.name}
                      className="flex justify-between items-center text-sm"
                    >
                      <span>{proc.name}</span>
                      <Badge variant="secondary">{proc.count}</Badge>
                    </li>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Nenhum procedimento registrado.
                  </p>
                )}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

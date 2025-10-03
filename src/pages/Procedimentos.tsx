import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { procedures, Procedure } from '@/lib/mock-data'
import { AspectRatio } from '@/components/ui/aspect-ratio'

export default function Procedimentos() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl md:text-3xl font-bold">Procedimentos</h1>
        <p className="text-muted-foreground">
          Conheça os principais procedimentos oferecidos pela clínica.
        </p>
      </header>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {procedures.map((procedure: Procedure) => (
          <Card
            key={procedure.id}
            className="overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <AspectRatio ratio={16 / 9}>
              <img
                src={procedure.imageUrl}
                alt={procedure.name}
                className="object-cover w-full h-full"
              />
            </AspectRatio>
            <CardHeader>
              <CardTitle>{procedure.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>{procedure.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

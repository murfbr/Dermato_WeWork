import { useState, useEffect } from 'react'
import { Slider } from '@/components/ui/slider'
import { AfterImage } from '@/lib/mock-data'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel'
import { Card } from '@/components/ui/card'

interface BeforeAfterSliderProps {
  beforeImage: string
  afterImages: AfterImage[]
}

export const BeforeAfterSlider = ({
  beforeImage,
  afterImages,
}: BeforeAfterSliderProps) => {
  const [sliderValue, setSliderValue] = useState(50)
  const [currentAfterIndex, setCurrentAfterIndex] = useState(0)
  const [api, setApi] = useState<CarouselApi>()

  useEffect(() => {
    if (!api) {
      return
    }
    api.scrollTo(currentAfterIndex)
  }, [api, currentAfterIndex])

  if (!beforeImage || afterImages.length === 0) {
    return (
      <div className="flex items-center justify-center h-96 bg-muted rounded-lg border-2 border-dashed">
        <p className="text-muted-foreground text-lg">
          Imagens para comparação não disponíveis.
        </p>
      </div>
    )
  }

  const currentAfterImage = afterImages[currentAfterIndex]

  return (
    <div className="w-full space-y-8">
      {/* Main Comparison Area - Larger */}
      <div className="relative w-full h-[50vh] md:h-[65vh] rounded-xl overflow-hidden group shadow-2xl border bg-muted select-none">
        <img
          src={beforeImage}
          alt="Antes"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        />
        <img
          src={currentAfterImage.url}
          alt="Depois"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          style={{
            clipPath: `polygon(0 0, ${sliderValue}% 0, ${sliderValue}% 100%, 0 100%)`,
          }}
        />

        {/* Slider Handle Line */}
        <div
          className="absolute inset-y-0 bg-white w-1 cursor-ew-resize z-10 shadow-[0_0_10px_rgba(0,0,0,0.5)]"
          style={{ left: `calc(${sliderValue}% - 2px)` }}
        >
          <div className="bg-white rounded-full h-10 w-10 absolute top-1/2 -translate-y-1/2 -translate-x-[18px] border-4 border-primary shadow-lg flex items-center justify-center transition-transform hover:scale-110">
            <div className="flex gap-0.5">
              <div className="w-0.5 h-4 bg-primary/50 rounded-full" />
              <div className="w-0.5 h-4 bg-primary/50 rounded-full" />
            </div>
          </div>
        </div>

        {/* Labels overlay */}
        <div className="absolute top-6 left-6 bg-black/60 text-white px-3 py-1.5 rounded-md text-sm font-semibold pointer-events-none backdrop-blur-md border border-white/10">
          Antes
        </div>
        <div className="absolute top-6 right-6 bg-black/60 text-white px-3 py-1.5 rounded-md text-sm font-semibold pointer-events-none backdrop-blur-md border border-white/10">
          Depois ({format(new Date(currentAfterImage.date), 'dd/MM/yyyy')})
        </div>
      </div>

      <Slider
        value={[sliderValue]}
        onValueChange={(value) => setSliderValue(value[0])}
        className="mt-6 w-full max-w-3xl mx-auto"
      />

      {/* Navigation Bar */}
      <Card className="p-6 bg-card/50 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
          <div>
            <h3 className="text-lg font-semibold">Linha do Tempo</h3>
            <p className="text-sm text-muted-foreground">
              Selecione uma data para comparar a evolução do tratamento.
            </p>
          </div>
          <div className="text-sm font-medium bg-primary/10 text-primary px-3 py-1 rounded-full">
            {currentAfterIndex + 1} de {afterImages.length} registros
          </div>
        </div>

        <div className="flex justify-center px-8">
          <Carousel
            setApi={setApi}
            className="w-full max-w-2xl"
            opts={{
              align: 'start',
              loop: false,
            }}
          >
            <CarouselContent className="-ml-4">
              {afterImages.map((img, idx) => (
                <CarouselItem key={idx} className="pl-4 basis-1/2 md:basis-1/3">
                  <button
                    onClick={() => setCurrentAfterIndex(idx)}
                    className={cn(
                      'relative w-full aspect-square rounded-lg overflow-hidden border-2 transition-all duration-200 group',
                      currentAfterIndex === idx
                        ? 'border-primary ring-4 ring-primary/10 scale-105 z-10 shadow-lg'
                        : 'border-transparent opacity-70 hover:opacity-100 hover:scale-105',
                    )}
                  >
                    <img
                      src={img.url}
                      alt={`Registro de ${format(new Date(img.date), 'dd/MM')}`}
                      className="h-full w-full object-cover"
                    />
                    <div
                      className={cn(
                        'absolute inset-x-0 bottom-0 p-2 text-xs font-medium text-white text-center transition-colors',
                        currentAfterIndex === idx
                          ? 'bg-primary'
                          : 'bg-black/60',
                      )}
                    >
                      {format(new Date(img.date), 'dd/MM/yyyy')}
                    </div>
                  </button>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="-left-12 h-10 w-10" />
            <CarouselNext className="-right-12 h-10 w-10" />
          </Carousel>
        </div>
      </Card>
    </div>
  )
}

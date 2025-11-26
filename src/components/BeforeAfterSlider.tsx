import { useState } from 'react'
import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { AfterImage } from '@/lib/mock-data'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { cn } from '@/lib/utils'

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

  if (!beforeImage || afterImages.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-muted rounded-lg border-2 border-dashed">
        <p className="text-muted-foreground">
          Imagens para comparação não disponíveis.
        </p>
      </div>
    )
  }

  const currentAfterImage = afterImages[currentAfterIndex]

  const handleNext = () => {
    setCurrentAfterIndex((prev) => (prev + 1) % afterImages.length)
  }

  const handlePrev = () => {
    setCurrentAfterIndex(
      (prev) => (prev - 1 + afterImages.length) % afterImages.length,
    )
  }

  return (
    <div className="w-full space-y-6">
      <div className="relative w-full aspect-video rounded-lg overflow-hidden group shadow-lg border bg-muted">
        <img
          src={beforeImage}
          alt="Antes"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <img
          src={currentAfterImage.url}
          alt="Depois"
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            clipPath: `polygon(0 0, ${sliderValue}% 0, ${sliderValue}% 100%, 0 100%)`,
          }}
        />
        <div
          className="absolute inset-y-0 bg-white w-1 cursor-ew-resize z-10"
          style={{ left: `calc(${sliderValue}% - 2px)` }}
        >
          <div className="bg-white rounded-full h-8 w-8 absolute top-1/2 -translate-y-1/2 -translate-x-[14px] border-4 border-primary shadow-md flex items-center justify-center">
            <div className="w-1 h-4 bg-primary/20 rounded-full" />
          </div>
        </div>

        {/* Labels overlay */}
        <div className="absolute top-4 left-4 bg-black/50 text-white px-2 py-1 rounded text-xs font-medium pointer-events-none backdrop-blur-sm">
          Antes
        </div>
        <div className="absolute top-4 right-4 bg-black/50 text-white px-2 py-1 rounded text-xs font-medium pointer-events-none backdrop-blur-sm">
          Depois
        </div>
      </div>

      <Slider
        value={[sliderValue]}
        onValueChange={(value) => setSliderValue(value[0])}
        className="mt-4"
      />

      {/* Navigation Bar */}
      <div className="bg-card border rounded-lg p-4 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm font-medium">Evolução do Tratamento</div>
          <div className="text-xs text-muted-foreground">
            {currentAfterIndex + 1} de {afterImages.length} registros
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={handlePrev}
            disabled={afterImages.length <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="flex-1 flex justify-center gap-2 overflow-x-auto py-2 scrollbar-hide">
            {afterImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentAfterIndex(idx)}
                className={cn(
                  'relative h-16 w-16 rounded-md overflow-hidden border-2 transition-all flex-shrink-0',
                  currentAfterIndex === idx
                    ? 'border-primary ring-2 ring-primary/20 opacity-100'
                    : 'border-transparent opacity-60 hover:opacity-100',
                )}
              >
                <img
                  src={img.url}
                  alt={`Data ${idx}`}
                  className="h-full w-full object-cover"
                />
                <div className="absolute bottom-0 inset-x-0 bg-black/60 text-[10px] text-white text-center truncate px-1">
                  {format(new Date(img.date), 'dd/MM')}
                </div>
              </button>
            ))}
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={handleNext}
            disabled={afterImages.length <= 1}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="text-center mt-2">
          <p className="text-sm text-muted-foreground">
            Comparando com registro de:{' '}
            <span className="font-medium text-foreground">
              {format(new Date(currentAfterImage.date), 'dd/MM/yyyy', {
                locale: ptBR,
              })}
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}

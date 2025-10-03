import { useState } from 'react'
import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { AfterImage } from '@/lib/mock-data'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

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
      <div className="flex items-center justify-center h-64 bg-muted rounded-lg">
        <p className="text-muted-foreground">Imagens não disponíveis.</p>
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
    <div className="w-full">
      <div className="relative w-full aspect-video rounded-lg overflow-hidden group">
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
          className="absolute inset-y-0 bg-white w-1 cursor-ew-resize"
          style={{ left: `calc(${sliderValue}% - 2px)` }}
        >
          <div className="bg-white rounded-full h-4 w-4 absolute top-1/2 -translate-y-1/2 -translate-x-[7px] border-2 border-primary ring-2 ring-white" />
        </div>
      </div>
      <Slider
        value={[sliderValue]}
        onValueChange={(value) => setSliderValue(value[0])}
        className="mt-4"
      />
      <div className="flex justify-between items-center mt-4">
        <span className="text-sm font-semibold">Antes</span>
        <span className="text-sm font-semibold">Depois</span>
      </div>

      {afterImages.length > 1 && (
        <div className="flex items-center justify-center gap-4 mt-6">
          <Button variant="outline" size="icon" onClick={handlePrev}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="text-center">
            <p className="font-medium">
              Foto {currentAfterIndex + 1} de {afterImages.length}
            </p>
            <p className="text-sm text-muted-foreground">
              Tirada em:{' '}
              {format(new Date(currentAfterImage.date), 'dd/MM/yyyy', {
                locale: ptBR,
              })}
            </p>
          </div>
          <Button variant="outline" size="icon" onClick={handleNext}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {afterImages.length === 1 && (
        <div className="text-center mt-6">
          <p className="text-sm text-muted-foreground">
            Foto "Depois" tirada em:{' '}
            {format(new Date(currentAfterImage.date), 'dd/MM/yyyy', {
              locale: ptBR,
            })}
          </p>
        </div>
      )}
    </div>
  )
}

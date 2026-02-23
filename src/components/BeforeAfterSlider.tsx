import { useState, useMemo } from 'react'
import { Slider } from '@/components/ui/slider'
import { AfterImage } from '@/lib/mock-data'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'

interface BeforeAfterSliderProps {
  beforeImage: string
  afterImages: AfterImage[]
  procedureDate?: string
}

export const BeforeAfterSlider = ({
  beforeImage,
  afterImages,
  procedureDate = new Date().toISOString(),
}: BeforeAfterSliderProps) => {
  const [sliderValue, setSliderValue] = useState(50)

  const timelineImages = useMemo(() => {
    const list = [
      { url: beforeImage, date: procedureDate, label: 'Original' },
      ...afterImages.map((img) => ({ ...img, label: 'Evolução' })),
    ]
    return list.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    )
  }, [beforeImage, procedureDate, afterImages])

  const [leftIndex, setLeftIndex] = useState(0)
  const [rightIndex, setRightIndex] = useState(
    timelineImages.length > 1 ? timelineImages.length - 1 : 0,
  )

  if (!beforeImage && afterImages.length === 0) {
    return (
      <div className="flex items-center justify-center h-96 bg-muted rounded-lg border-2 border-dashed">
        <p className="text-muted-foreground text-lg">
          Imagens para comparação não disponíveis.
        </p>
      </div>
    )
  }

  const leftImage = timelineImages[leftIndex]
  const rightImage = timelineImages[rightIndex]

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 bg-muted/30 p-4 rounded-xl border">
        <div className="flex-1 space-y-2">
          <Label>Imagem Esquerda (Antes)</Label>
          <Select
            value={leftIndex.toString()}
            onValueChange={(v) => setLeftIndex(parseInt(v))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {timelineImages.map((img, idx) => (
                <SelectItem key={idx} value={idx.toString()}>
                  {format(new Date(img.date), 'dd/MM/yyyy')} - {img.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1 space-y-2">
          <Label>Imagem Direita (Depois)</Label>
          <Select
            value={rightIndex.toString()}
            onValueChange={(v) => setRightIndex(parseInt(v))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {timelineImages.map((img, idx) => (
                <SelectItem key={idx} value={idx.toString()}>
                  {format(new Date(img.date), 'dd/MM/yyyy')} - {img.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="relative w-full h-[50vh] md:h-[60vh] rounded-xl overflow-hidden group shadow-xl border bg-muted select-none">
        <img
          src={leftImage?.url}
          alt="Antes"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        />
        <img
          src={rightImage?.url}
          alt="Depois"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          style={{
            clipPath: `polygon(0 0, ${sliderValue}% 0, ${sliderValue}% 100%, 0 100%)`,
          }}
        />

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

        <div className="absolute top-6 left-6 bg-black/60 text-white px-3 py-1.5 rounded-md text-sm font-semibold pointer-events-none backdrop-blur-md border border-white/10">
          {leftImage?.label} (
          {leftImage && format(new Date(leftImage.date), 'dd/MM/yy')})
        </div>
        <div className="absolute top-6 right-6 bg-black/60 text-white px-3 py-1.5 rounded-md text-sm font-semibold pointer-events-none backdrop-blur-md border border-white/10">
          {rightImage?.label} (
          {rightImage && format(new Date(rightImage.date), 'dd/MM/yy')})
        </div>
      </div>

      <Slider
        value={[sliderValue]}
        onValueChange={(value) => setSliderValue(value[0])}
        className="pt-4 w-full max-w-2xl mx-auto"
      />
    </div>
  )
}

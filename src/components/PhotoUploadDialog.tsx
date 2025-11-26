import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { PerformedProcedure, AfterImage } from '@/lib/mock-data'
import { Upload, X, Plus, Image as ImageIcon } from 'lucide-react'
import { toast } from 'sonner'
import { ScrollArea } from '@/components/ui/scroll-area'

interface PhotoUploadDialogProps {
  procedure: PerformedProcedure
  onSave: (updatedProcedure: Partial<PerformedProcedure>) => void
  onClose: () => void
}

export const PhotoUploadDialog = ({
  procedure,
  onSave,
  onClose,
}: PhotoUploadDialogProps) => {
  const [beforeImage, setBeforeImage] = useState(procedure.beforeImageUrl)
  const [afterImages, setAfterImages] = useState<AfterImage[]>(
    procedure.afterImages,
  )
  const [isUploading, setIsUploading] = useState(false)

  const handleUploadBefore = () => {
    setIsUploading(true)
    // Mock upload
    setTimeout(() => {
      const mockUrl = `https://img.usecurling.com/p/800/600?q=${procedure.name}%20before&seed=${Date.now()}`
      setBeforeImage(mockUrl)
      setIsUploading(false)
      toast.success('Foto "Antes" carregada com sucesso!')
    }, 1500)
  }

  const handleUploadAfter = () => {
    setIsUploading(true)
    // Mock upload
    setTimeout(() => {
      const mockUrl = `https://img.usecurling.com/p/800/600?q=${procedure.name}%20after&seed=${Date.now()}`
      const newAfterImage: AfterImage = {
        url: mockUrl,
        date: new Date().toISOString(),
      }
      setAfterImages([...afterImages, newAfterImage])
      setIsUploading(false)
      toast.success('Foto "Depois" adicionada com sucesso!')
    }, 1500)
  }

  const handleRemoveAfter = (index: number) => {
    const newImages = [...afterImages]
    newImages.splice(index, 1)
    setAfterImages(newImages)
  }

  const handleSave = () => {
    onSave({
      beforeImageUrl: beforeImage,
      afterImages: afterImages,
    })
    onClose()
    toast.success('Alterações salvas com sucesso!')
  }

  return (
    <div className="space-y-6">
      <DialogHeader>
        <DialogTitle>Gerenciar Fotos: {procedure.name}</DialogTitle>
        <DialogDescription>
          Adicione ou altere as fotos de "Antes" e "Depois" para este
          procedimento.
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Foto "Antes"</Label>
          <div className="flex items-center gap-4 border rounded-lg p-4 bg-muted/30">
            {beforeImage ? (
              <div className="relative h-32 w-32 rounded-md overflow-hidden border bg-background">
                <img
                  src={beforeImage}
                  alt="Antes"
                  className="h-full w-full object-cover"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-1 right-1 h-6 w-6"
                  onClick={() => setBeforeImage('')}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ) : (
              <div className="h-32 w-32 rounded-md border-2 border-dashed flex items-center justify-center bg-muted">
                <ImageIcon className="h-8 w-8 text-muted-foreground" />
              </div>
            )}
            <div className="flex-1">
              <p className="text-sm text-muted-foreground mb-2">
                A foto "Antes" serve como base para comparação.
              </p>
              <Button
                onClick={handleUploadBefore}
                disabled={isUploading || !!beforeImage}
                variant="outline"
              >
                <Upload className="mr-2 h-4 w-4" />
                {isUploading ? 'Carregando...' : 'Carregar Foto'}
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Fotos "Depois" ({afterImages.length})</Label>
            <Button
              size="sm"
              variant="outline"
              onClick={handleUploadAfter}
              disabled={isUploading}
            >
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Nova
            </Button>
          </div>

          <ScrollArea className="h-[200px] border rounded-lg p-4 bg-muted/30">
            {afterImages.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {afterImages.map((img, idx) => (
                  <div key={idx} className="relative group">
                    <div className="aspect-square rounded-md overflow-hidden border bg-background">
                      <img
                        src={img.url}
                        alt={`Depois ${idx}`}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-md">
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleRemoveAfter(idx)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-center mt-1 text-muted-foreground">
                      {new Date(img.date).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <ImageIcon className="h-8 w-8 mb-2 opacity-50" />
                <p>Nenhuma foto "Depois" adicionada.</p>
              </div>
            )}
          </ScrollArea>
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button onClick={handleSave}>Salvar Alterações</Button>
      </DialogFooter>
    </div>
  )
}

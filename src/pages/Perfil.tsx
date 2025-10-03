import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { patient as mockPatient } from '@/lib/mock-data'
import { Separator } from '@/components/ui/separator'
import { useNavigate } from 'react-router-dom'

export default function Perfil() {
  const [patient, setPatient] = useState(mockPatient)
  const [isEditing, setIsEditing] = useState(false)
  const navigate = useNavigate()

  const handleLogout = () => {
    navigate('/login')
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <header>
        <h1 className="text-2xl md:text-3xl font-bold">Meu Perfil</h1>
        <p className="text-muted-foreground">
          Gerencie suas informações pessoais e de segurança.
        </p>
      </header>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20 border-4 border-primary">
              <AvatarImage src={patient.avatarUrl} alt={patient.name} />
              <AvatarFallback>
                {patient.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">{patient.name}</CardTitle>
              <CardDescription>{patient.email}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Informações Pessoais</h3>
              <Button
                variant="outline"
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? 'Cancelar' : 'Editar Perfil'}
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fullName">Nome Completo</Label>
                <Input
                  id="fullName"
                  value={patient.name}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={patient.email}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label htmlFor="phone">Telefone</Label>
                <Input id="phone" value={patient.phone} disabled={!isEditing} />
              </div>
              <div>
                <Label htmlFor="dob">Data de Nascimento</Label>
                <Input
                  id="dob"
                  type="date"
                  value={patient.dob}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label htmlFor="cpf">CPF</Label>
                <Input id="cpf" value={patient.cpf} disabled />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="address">Endereço</Label>
                <Input
                  id="address"
                  value={patient.address}
                  disabled={!isEditing}
                />
              </div>
            </div>
            {isEditing && <Button className="mt-4">Salvar Alterações</Button>}
          </div>
          <Separator />
          <div>
            <h3 className="text-lg font-semibold mb-4">Segurança</h3>
            <div className="space-y-4">
              <Label htmlFor="currentPassword">Senha Atual</Label>
              <Input id="currentPassword" type="password" />
              <Label htmlFor="newPassword">Nova Senha</Label>
              <Input id="newPassword" type="password" />
              <Label htmlFor="confirmNewPassword">Confirmar Nova Senha</Label>
              <Input id="confirmNewPassword" type="password" />
              <Button>Alterar Senha</Button>
            </div>
          </div>
          <Separator />
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            <div>
              <Button variant="link" className="p-0">
                Termos de Uso
              </Button>{' '}
              |{' '}
              <Button variant="link" className="p-0">
                Política de Privacidade
              </Button>
            </div>
            <Button variant="destructive" onClick={handleLogout}>
              Sair (Logout)
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

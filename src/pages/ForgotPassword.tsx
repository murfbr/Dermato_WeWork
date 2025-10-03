import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Link } from 'react-router-dom'
import { toast } from '@/hooks/use-toast'

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: 'Por favor, insira um e-mail válido.' }),
})

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>

export default function ForgotPassword() {
  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  })

  const onSubmit = (data: ForgotPasswordFormValues) => {
    console.log('Forgot password for:', data.email)
    toast({
      title: 'Instruções Enviadas',
      description:
        'Se houver uma conta associada a este e-mail, enviaremos as instruções de recuperação.',
    })
    form.reset()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Esqueceu a senha?</CardTitle>
        <CardDescription>
          Sem problemas. Insira seu e-mail e enviaremos um link para redefinir
          sua senha.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail</FormLabel>
                  <FormControl>
                    <Input placeholder="seuemail@exemplo.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              Enviar Link de Recuperação
            </Button>
          </form>
        </Form>
        <div className="mt-6 text-center text-sm">
          Lembrou da senha?{' '}
          <Link
            to="/login"
            className="font-semibold text-primary hover:underline"
          >
            Fazer Login
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

import { useAuth } from '@/contexts/AuthContext'
import { ClientCalendar } from '@/components/ClientCalendar'
import { DoctorCalendar } from '@/components/DoctorCalendar'

export default function Calendario() {
  const { role } = useAuth()

  if (role === 'doctor') {
    return <DoctorCalendar />
  }

  return <ClientCalendar />
}

import { useAuth } from '@/contexts/AuthContext'
import { DoctorProfile } from '@/components/DoctorProfile'
import { PatientProfile } from '@/components/PatientProfile'

export default function Perfil() {
  const { role } = useAuth()

  if (role === 'doctor') {
    return <DoctorProfile />
  }

  return <PatientProfile />
}

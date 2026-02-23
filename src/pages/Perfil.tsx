import { useAuth } from '@/contexts/AuthContext'
import { DoctorProfile } from '@/components/DoctorProfile'
import { PatientProfile } from '@/components/PatientProfile'
import { Navigate } from 'react-router-dom'

export default function Perfil() {
  const { role } = useAuth()

  if (role === 'admin') {
    return <Navigate to="/configuracoes" replace />
  }

  if (role === 'doctor') {
    return <DoctorProfile />
  }

  return <PatientProfile />
}

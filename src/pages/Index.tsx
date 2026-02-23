import { useAuth } from '@/contexts/AuthContext'
import { ClientDashboard } from '@/components/ClientDashboard'
import { DoctorDashboard } from '@/components/DoctorDashboard'

const Dashboard = () => {
  const { role } = useAuth()

  if (role === 'doctor' || role === 'admin') {
    return <DoctorDashboard />
  }

  return <ClientDashboard />
}

export default Dashboard

import { useAuth } from '@/contexts/AuthContext'
import { ClientDashboard } from '@/components/ClientDashboard'
import { DoctorDashboard } from '@/components/DoctorDashboard'

const Dashboard = () => {
  const { role } = useAuth()

  if (role === 'doctor') {
    return <DoctorDashboard />
  }

  return <ClientDashboard />
}

export default Dashboard

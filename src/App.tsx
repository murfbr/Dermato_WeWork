import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import Layout from './components/Layout'
import AuthLayout from './pages/AuthLayout'
import Dashboard from './pages/Index'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import Comunicacao from './pages/Comunicacao'
import Laudos from './pages/Laudos'
import Calendario from './pages/Calendario'
import Perfil from './pages/Perfil'
import NotFound from './pages/NotFound'
import { ClientProvider } from './contexts/ClientContext'
import Procedimentos from './pages/Procedimentos'

const App = () => (
  <BrowserRouter>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Routes>
        {/* Authenticated Routes */}
        <Route
          element={
            <ClientProvider>
              <Layout />
            </ClientProvider>
          }
        >
          <Route path="/" element={<Dashboard />} />
          <Route path="/comunicacao" element={<Comunicacao />} />
          <Route path="/laudos" element={<Laudos />} />
          <Route path="/procedimentos" element={<Procedimentos />} />
          <Route path="/calendario" element={<Calendario />} />
          <Route path="/perfil" element={<Perfil />} />
        </Route>

        {/* Authentication Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </TooltipProvider>
  </BrowserRouter>
)

export default App

import { createContext, useState, useContext, ReactNode, useMemo } from 'react'

type Role = 'doctor' | 'client'

interface AuthContextType {
  role: Role
  setRole: (role: Role) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [role, setRole] = useState<Role>('doctor')

  const value = useMemo(
    () => ({
      role,
      setRole,
    }),
    [role],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

import { Outlet, Link } from 'react-router-dom'

export default function AuthLayout() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Link to="/" className="flex items-center gap-3 font-semibold">
            <img
              src="https://img.usecurling.com/i?q=caduceus&color=azure"
              alt="Logo"
              className="h-12 w-12"
            />
            <span className="text-2xl font-bold">
              Flavia Novis - clínica integrada
            </span>
          </Link>
        </div>
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  )
}

import { Outlet, Link } from 'react-router-dom'

export default function AuthLayout() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <img
              src="https://img.usecurling.com/i?q=dermatology&color=azure"
              alt="DermApp Logo"
              className="h-12 w-12"
            />
            <span className="text-2xl font-bold">DermApp</span>
          </Link>
        </div>
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  )
}

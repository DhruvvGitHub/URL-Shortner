import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'
import { Button } from './components/ui/button'
import AppLayout from './Layouts/AppLayout'
import Dashborad from './pages/Dashborad'
import LandingPage from './pages/LandingPage'
import Auth from './pages/Auth'
import Link from './pages/Link'
import RedirectLink from './pages/RedirectLink'
import UrlProvider from './Context'
import RequireAuth from './components/RequireAuth'

const router = createBrowserRouter([
  {
    element: <AppLayout />, 
    children: [
      {
        path: "/",
        element: <LandingPage />
      },
            {
        path: "/dashboard",
        element: <RequireAuth>
          <Dashborad />
        </RequireAuth> 
      },
            {
        path: "/auth",
        element: <Auth />
      },
            {
        path: "/link/:id",
        element: <RequireAuth>
          <Link />
        </RequireAuth> 
      },
            {
        path: ":id",
        element: <RedirectLink />
      },
    ]
  }
])

function App() {

  return (
    <UrlProvider>
      <RouterProvider router={router} />
    </UrlProvider>
  )
}

export default App
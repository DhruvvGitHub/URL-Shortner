import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'
import { Button } from './components/ui/button'
import AppLayout from './Layouts/AppLayout'
import Dashborad from './pages/Dashborad'
import LandingPage from './pages/LandingPage'
import Auth from './pages/Auth'
import Link from './pages/Link'
import RedirectLink from './pages/RedirectLink'

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
        element: <Dashborad />
      },
            {
        path: "/auth",
        element: <Auth />
      },
            {
        path: "/link/:id",
        element: <Link />
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
    <div className=''>
      <RouterProvider router={router} />
    </div>
  )
}

export default App
import { createBrowserRouter } from 'react-router-dom'
import { AppContainer } from './pages/_layouts/app-container'
import { Home } from './pages/home'
import { NotFound } from './pages/not-found'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppContainer />,
    children: [
      { path: '/', element: <Home /> },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
])

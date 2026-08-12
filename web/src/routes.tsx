import { createBrowserRouter } from 'react-router-dom'
import { AppContainer } from './pages/_layouts/app-container'
import { Home } from './pages/home'
import { NotFound } from './pages/not-found'
import { Redirect } from './pages/redirect'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppContainer />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/:slug', element: <Redirect /> },
      {
        path: 'not-found',
        element: <NotFound />,
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
])

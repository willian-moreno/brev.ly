import { Outlet } from 'react-router-dom'

export function AppContainer() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col p-3">
      <Outlet />
    </div>
  )
}

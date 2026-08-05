import { Outlet } from 'react-router-dom'

export function AppContainer() {
  return (
    <div className="p-5">
      <Outlet />
    </div>
  )
}

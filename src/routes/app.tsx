import { Outlet, createFileRoute } from '@tanstack/react-router'
import AppHead from '../AppHead'

export const Route = createFileRoute('/app')({
  component: AppLayout
})

function AppLayout() {
  return (
    <>
      <AppHead />
      <Outlet />
    </>
  )
}

import { Outlet, createFileRoute } from '@tanstack/react-router'
import AppHead from '../shared/components/AppHead'

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

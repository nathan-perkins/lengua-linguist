import { Outlet, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/app/workspace')({
  component: WorkspaceLayout
})

function WorkspaceLayout() {
  return (
    <>
      <Outlet />
    </>
  )
}

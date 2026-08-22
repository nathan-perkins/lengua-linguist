import { createFileRoute } from '@tanstack/react-router'
import Workspace from '../../../workspace/pages/Workspace'

export const Route = createFileRoute('/app/workspace/$videoId')({
  component: Workspace
})

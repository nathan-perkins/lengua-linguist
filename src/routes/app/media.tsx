import { createFileRoute } from '@tanstack/react-router'
import SourceMedia from '../../source-media/pages/SourceMedia'

export const Route = createFileRoute('/app/media')({
  component: SourceMedia
})

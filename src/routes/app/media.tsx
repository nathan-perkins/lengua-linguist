import { createFileRoute } from '@tanstack/react-router'
import { SearchParamsSchema } from '../../source-media/schemas'
import SourceMedia from '../../source-media/pages/SourceMedia'

export const Route = createFileRoute('/app/media')({
  validateSearch: SearchParamsSchema,
  component: SourceMedia
})

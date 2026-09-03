import { createFileRoute } from '@tanstack/react-router'
import { SearchParamsSchema } from '../../source-media/schemas'
import SourceMedia from '../../source-media/pages/SourceMedia'

const videoIdRegex = /^[a-zA-Z0-9_-]{11}$/

export const Route = createFileRoute('/app/media')({
  validateSearch: (search: Record<string, unknown>) => {
    const parsed = SearchParamsSchema.parse(search)

    if (parsed.q && videoIdRegex.test(parsed.q)) {
      return {
        ...parsed,
        q: ''
      }
    }

    return parsed
  },
  component: SourceMedia
})

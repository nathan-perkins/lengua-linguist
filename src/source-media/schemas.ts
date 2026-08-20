import { z } from 'zod'

export const SearchParamsSchema = z.object({
  q: z.string().min(1)
})

export const YouTubeSearchResultSchema = z.object({
  kind: z.literal('youtube#searchResult'),
  id: z.object({
    kind: z.string(),
    videoId: z.string()
  }),
  snippet: z.object({
    title: z.string(),
    description: z.string(),
    thumbnails: z.object({
      medium: z.object({
        url: z.string(),
        width: z.number(),
        height: z.number()
      })
    }),
    channelTitle: z.string()
  })
})

export const YouTubeSearchListResponseSchema = z.object({
  kind: z.literal('youtube#searchListResponse'),
  items: z.array(YouTubeSearchResultSchema)
})

export type SearchParams = z.infer<typeof SearchParamsSchema>
export type YouTubeSearchResult = z.infer<typeof YouTubeSearchResultSchema>
export type YouTubeSearchListResponse = z.infer<typeof YouTubeSearchListResponseSchema>

import { z, ZodType, ZodError } from 'zod'

export function createEndpoint<TSchema extends ZodType>(
  schema: TSchema,
  handler: (request: Request, query: z.infer<TSchema>) => Promise<Response>
) {
  return async (request: Request): Promise<Response> => {
    try {
      const url = new URL(request.url)
      const queryParams = Object.fromEntries(url.searchParams.entries())
      const parsedQuery = schema.parse(queryParams)

      return await handler(request, parsedQuery)
    } catch (error) {
      if (error instanceof ZodError) {
        return Response.json(
          { error: 'Invalid Parameters', details: error.issues },
          { status: 400 }
        )
      }
      console.error(error)
      return Response.json({ error: 'Internal Server Error' }, { status: 500 })
    }
  }
}

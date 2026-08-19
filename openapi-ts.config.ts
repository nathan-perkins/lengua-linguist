import { defineConfig } from '@hey-api/openapi-ts'

export default defineConfig({
  input: 'https://api.apis.guru/v2/specs/googleapis.com/youtube/v3/openapi.json',
  output: './src/client',
  parser: {
    filters: {
      operations: {
        include: ['/youtube/v3/search']
      }
    }
  },
  plugins: [
    {
      name: '@hey-api/client-fetch',
      runtimeConfigPath: './src/hey-api.ts'
    }
  ]
})

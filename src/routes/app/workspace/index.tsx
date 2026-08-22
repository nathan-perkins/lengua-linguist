import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/app/workspace/')({
  beforeLoad: () => {
    const fallbackVideoId = 'JmgBtUM5opI'

    throw redirect({
      to: '/app/workspace/$videoId',
      params: { videoId: fallbackVideoId },
      replace: true
    })
  }
})

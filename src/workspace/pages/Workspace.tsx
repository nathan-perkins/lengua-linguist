import { useParams } from '@tanstack/react-router'

export default function Workspace() {
  const { videoId } = useParams({ from: '/app/workspace/$videoId' })

  return <div>{videoId}</div>
}

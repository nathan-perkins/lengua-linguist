import YouTube from 'react-youtube'

type YouTubeVideoProps = {
  videoId: string
}

export default function YouTubeVideo({ videoId }: YouTubeVideoProps) {
  return <YouTube videoId={videoId} />
}

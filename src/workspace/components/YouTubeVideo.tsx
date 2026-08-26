import ReactPlayer from 'react-player'

type YouTubeVideoProps = {
  videoId: string
}

export default function YouTubeVideo({ videoId }: YouTubeVideoProps) {
  const createYouTubeUrl = (videoId: string) => `https://www.youtube.com/watch?v=${videoId}`
  return <ReactPlayer src={createYouTubeUrl(videoId)} />
}

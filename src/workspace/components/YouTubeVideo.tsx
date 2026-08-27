import ReactPlayer from 'react-player'
import '../css/YouTubeVideo.css'

type YouTubeVideoProps = {
  videoId: string
  isPlaying: boolean
}

export default function YouTubeVideo({ videoId, isPlaying }: YouTubeVideoProps) {
  const createYouTubeUrl = (videoId: string) => `https://www.youtube.com/watch?v=${videoId}`
  return (
    <div className="youtube-video">
      <ReactPlayer className="player" src={createYouTubeUrl(videoId)} playing={isPlaying} />
    </div>
  )
}

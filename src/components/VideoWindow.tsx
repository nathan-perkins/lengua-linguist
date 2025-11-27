import YouTube, { type YouTubeEvent, type YouTubeProps } from 'react-youtube'

interface VideoWindowProps {
  activeVideo: string | null
  startPoint?: number | null
  endPoint?: number | null
}

interface YouTubePlayer {
  seekTo: (seconds: number, allowSeekAhead: boolean) => void
  pauseVideo: () => void
}

function VideoWindow({ activeVideo, startPoint, endPoint }: VideoWindowProps) {
  if (!activeVideo) return null

  const resetToStartpoint: YouTubeProps['onEnd'] = (event: YouTubeEvent) => {
    const player = event.target as YouTubePlayer
    if (
      event.data === 0 &&
      startPoint &&
      player &&
      typeof player.seekTo === 'function' &&
      typeof player.pauseVideo === 'function'
    ) {
      player.seekTo(startPoint, true)
      player.pauseVideo()
    }
  }

  return (
    <div className="video-window">
      <YouTube
        videoId={activeVideo}
        opts={{
          playerVars: {
            start: startPoint ? startPoint : undefined,
            end: endPoint ? endPoint : undefined,
          }
        }}
        onEnd={resetToStartpoint}
      />
    </div>
  )
}

export default VideoWindow
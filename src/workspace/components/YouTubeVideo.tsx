type YouTubeVideoProps = {
  videoId: string
}

export default function YouTubeVideo({ videoId }: YouTubeVideoProps) {
  return <div>{videoId}</div>
}

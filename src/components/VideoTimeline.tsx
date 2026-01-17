interface VideoTimelineProps {
  currentTime: number
  duration: number
}

function VideoTimeline({ currentTime, duration}: VideoTimelineProps) {
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <div className="video-timeline-bar">
      <div className="video-timeline-progress" style={{ width: `${progressPercent}%` }}></div>
    </div>
  )
}

export default VideoTimeline
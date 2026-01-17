import React from 'react'

interface Segment {
  start: number
  end: number
}

interface VideoTimelineProps {
  currentTime: number
  duration: number
  segments?: Segment[]
}

function getSegmentKey(segment: Segment) {
  return `${segment.start}-${segment.end}`
}

function VideoTimeline({ currentTime, duration, segments }: VideoTimelineProps) {
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <div className="video-timeline-bar">
      {segments && segments.map(segment => {
        if (duration <= 0) return null

        const startMarker = (segment.start / duration) * 100
        const endMarker = (segment.end / duration) * 100
        const keyBase = getSegmentKey(segment)

        return (
          <React.Fragment key={keyBase}>
            <div
              className="video-timeline-tick"
              style={{ left: `${startMarker}%` }}
              aria-label={`Segment start at ${segment.start}s`}
              key={`${keyBase}-start`}
            />
            <div
              className="video-timeline-tick"
              style={{ left: `${endMarker}%` }}
              aria-label={`Segment end at ${segment.end}s`}
              key={`${keyBase}-end`}
            />
          </React.Fragment>
        )
      })}
      <div className="video-timeline-progress" style={{ width: `${progressPercent}%` }}></div>
    </div>
  )
}

export default VideoTimeline
import React, { useRef } from 'react'
import TimelineIndicator from './TimelineIndicator'
import { DndContext, type DragEndEvent } from '@dnd-kit/core'

interface Segment {
  start: number
  end: number
}

interface VideoTimelineProps {
  currentTime: number
  duration: number
  segments?: Segment[]
  activeSegmentIndex: number
  pendingSegmentStart: number | null
  onSeek?: (time: number) => void
}

function getSegmentKey(segment: Segment) {
  return `${segment.start}-${segment.end}`
}

function VideoTimeline({ currentTime, duration, segments, activeSegmentIndex, pendingSegmentStart, onSeek }: VideoTimelineProps) {
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0
  const barRef = useRef<HTMLDivElement>(null)

  const handleDragEnd = (event: DragEndEvent) => {
    if (!duration || !barRef.current) return

    if (
      event.activatorEvent &&
      'clientX' in event.activatorEvent &&
      typeof (event.activatorEvent as MouseEvent).clientX === 'number'
    ) {
      const rect = barRef.current.getBoundingClientRect()
      const transform = event?.delta.x ?? 0
      const initialLeft = (currentTime / duration) * rect.width
      const finalLeft = initialLeft + transform
      const percent = Math.max(0, Math.min(1, finalLeft / rect.width))
      const seekTime = percent * duration
      if (onSeek) onSeek(seekTime)
    }
  }

  let pendingMarker

  if (pendingSegmentStart) {
    pendingMarker = (pendingSegmentStart / duration) * 100
  }

  return (
    <div className="video-timeline-bar" ref={barRef}>
      {pendingSegmentStart && (
        <div
          className="video-timeline-tick active-timeline-tick"
          style={{ left: `${pendingMarker}%` }}
          aria-label={`Pending segment start at ${pendingMarker}s`}
        />
      )}
      {segments && segments.map((segment, idx) => {
        if (duration <= 0) return null

        const startMarker = (segment.start / duration) * 100
        const endMarker = (segment.end / duration) * 100
        const keyBase = getSegmentKey(segment)
        const isActive = idx === activeSegmentIndex

        return (
          <React.Fragment key={keyBase}>
            <div
              className={`video-timeline-tick${isActive ? ' active-timeline-tick' : ''}`}
              style={{ left: `${startMarker}%` }}
              aria-label={`Segment start at ${segment.start}s`}
              key={`${keyBase}-start`}
            />
            <div
              className={`video-timeline-tick${isActive ? ' active-timeline-tick' : ''}`}
              style={{ left: `${endMarker}%` }}
              aria-label={`Segment end at ${segment.end}s`}
              key={`${keyBase}-end`}
            />
          </React.Fragment>
        )
      })}
      <div className="video-timeline-progress" style={{ width: `${progressPercent}%` }} />
      <DndContext onDragEnd={handleDragEnd}>
        <TimelineIndicator currentTime={currentTime} duration={duration} />
      </DndContext>
    </div>
  )
}

export default VideoTimeline
import React, { useRef } from 'react'
import TimelineIndicator from './TimelineIndicator'
import { DndContext, type DragEndEvent } from '@dnd-kit/core'

interface Segment {
  index: number
  start: number
  end: number
}

interface VideoTimelineProps {
  currentTime: number
  duration: number
  segments?: Segment[]
  activeSegmentIndex: number | null
  pendingSegmentStart: number | null
  onSeek?: (time: number) => void
  loopController?: boolean
}

function getSegmentKey(segment: Segment) {
  return `${segment.start}-${segment.end}`
}

function VideoTimeline({ currentTime, duration, segments, activeSegmentIndex, pendingSegmentStart, onSeek, loopController }: VideoTimelineProps) {
  const barRef = useRef<HTMLDivElement>(null)

  if (duration <= 0) return

  let progressPercent = 0
  let controllerStart = 0
  let controllerEnd = 0
  let controllerDuration = 0

  if (loopController && segments && segments.length > 0) {
    if (segments.length === 3) {
      // [previousSegment, activeSegment, nextSegment]
      controllerStart = segments[0].start
      controllerEnd = segments[segments.length - 1].end

      controllerDuration = controllerEnd - controllerStart
      progressPercent = controllerDuration > 0
        ? ((currentTime - controllerStart) / controllerDuration) * 100
        : 0

      progressPercent = Math.max(0, Math.min(progressPercent, 100))
    } else if (segments.length === 2 && activeSegmentIndex === segments[0].index) {
      // [activeSegment, nextSegment]
      const activeSegmentLength = segments[1].end - segments[1].start
      controllerStart = Math.max(0, segments[0].start - activeSegmentLength)
      controllerEnd = segments[1].end

      controllerDuration = controllerEnd - controllerStart
      progressPercent = controllerDuration > 0
        ? ((currentTime - controllerStart) / controllerDuration) * 100
        : 0

      progressPercent = Math.max(0, Math.min(progressPercent, 100))
    } else if (segments.length === 2 && activeSegmentIndex === segments[1].index) {
      // [previousSegment, activeSegment]
      const activeSegmentLength = segments[1].end - segments[1].start
      controllerStart = segments[0].start
      controllerEnd = Math.min(segments[1].end + activeSegmentLength, duration)

      controllerDuration = controllerEnd - controllerStart
      progressPercent = controllerDuration > 0
        ? ((currentTime - controllerStart) / controllerDuration) * 100
        : 0

      progressPercent = Math.max(0, Math.min(progressPercent, 100))
    } else if (segments.length === 1) {
      // [activeSegment]
      const activeSegmentLength = segments[0].end - segments[0].start
      controllerStart = Math.max(0, segments[0].start - activeSegmentLength)
      controllerEnd = Math.min(segments[0].end + activeSegmentLength, duration)

      controllerDuration = controllerEnd - controllerStart
      progressPercent = controllerDuration > 0
        ? ((currentTime - controllerStart) / controllerDuration) * 100
        : 0
      
      progressPercent = Math.max(0, Math.min(progressPercent, 100))
    }
  } else {
    progressPercent = (currentTime / duration) * 100
  }

  const timelineDuration = controllerDuration > 0
    ? controllerDuration
    : duration

  const handleDragEnd = (event: DragEndEvent) => {
    if (!timelineDuration || !barRef.current) return

    if (
      event.activatorEvent &&
      'clientX' in event.activatorEvent &&
      typeof (event.activatorEvent as MouseEvent).clientX === 'number'
    ) {
      const rect = barRef.current.getBoundingClientRect()
      const transform = event?.delta.x ?? 0
      const initialLeft = (currentTime / timelineDuration) * rect.width
      const finalLeft = initialLeft + transform
      const percent = Math.max(0, Math.min(1, finalLeft / rect.width))
      const seekTime = percent * timelineDuration
      if (onSeek) onSeek(seekTime)
    }
  }

  let pendingMarker

  if (pendingSegmentStart !== null) {
    pendingMarker = (pendingSegmentStart / timelineDuration) * 100
  }

  const indicatorTime = loopController && segments && segments.length > 0
    ? currentTime - controllerStart
    : currentTime

  const showIndicator = indicatorTime >= 0 && indicatorTime <= timelineDuration

  return (
    <div className="video-timeline-bar" ref={barRef}>
      {pendingSegmentStart !== null && (
        <div
          className="video-timeline-tick active-timeline-tick"
          style={{ left: `${pendingMarker}%` }}
          aria-label={`Pending segment start at ${pendingMarker}s`}
        />
      )}
      {segments && segments.map((segment, idx) => {
        const startMarker = ((segment.start - controllerStart) / timelineDuration) * 100
        const endMarker = ((segment.end - controllerStart) / timelineDuration) * 100
        const keyBase = getSegmentKey(segment)
        const isActive = loopController
          ? activeSegmentIndex === segment.index
          : idx === activeSegmentIndex && pendingSegmentStart === null

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
        {showIndicator && (
          <TimelineIndicator currentTime={loopController && segments && segments.length > 0 ? currentTime - controllerStart : currentTime} duration={timelineDuration} />
        )}
      </DndContext>
    </div>
  )
}

export default VideoTimeline
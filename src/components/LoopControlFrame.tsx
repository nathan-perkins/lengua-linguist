import VideoTimeline from './VideoTimeline'
import Recorder from './Recorder'

interface Segment {
  index: number
  start: number
  end: number
}

interface LoopControlFrameProps {
  currentTime: number
  duration: number
  segments: Segment[]
  activeSegmentIndex: number | null
  pendingSegmentStart: number | null
  onSeek?: (time: number) => void
  onSegmentUpdate?: (index: number, newEnd: number) => void
  activeVideo: string
  loopController: boolean
}

function LoopControlFrame({ currentTime, duration, segments, activeSegmentIndex, pendingSegmentStart, onSeek, onSegmentUpdate, activeVideo, loopController }: LoopControlFrameProps) {
  return (
    <div className="loop-control-frame">
      <div className="control-timeline">
        <VideoTimeline
          currentTime={currentTime}
          duration={duration}
          segments={segments}
          activeSegmentIndex={activeSegmentIndex}
          pendingSegmentStart={pendingSegmentStart}
          onSeek={onSeek}
          onSegmentUpdate={onSegmentUpdate}
          loopController={loopController}
        />
        {typeof activeSegmentIndex === 'number' && segments[activeSegmentIndex] && (
          <Recorder videoId={activeVideo} startSegment={segments[activeSegmentIndex].start} endSegment={segments[activeSegmentIndex].end} />
        )}
      </div>
    </div>
  )
}

export default LoopControlFrame
import { useState } from 'react'
import VideoTimeline from './VideoTimeline'
import Recorder from './Recorder'
import LoopNameEditPopup from './LoopNameEditPopup'

interface Segment {
  index: number
  start: number
  end: number
  initialEnd: number
  name?: string
}

interface LoopControlFrameProps {
  currentTime: number
  duration: number
  segments: Segment[]
  activeSegmentIndex: number | null
  pendingSegmentStart: number | null
  onSeek?: (time: number) => void
  onSegmentUpdate?: (index: number, newEnd: number, newName?: string) => void
  activeVideo: string
  loopController: boolean
}

function LoopControlFrame({
  currentTime,
  duration,
  segments,
  activeSegmentIndex,
  pendingSegmentStart,
  onSeek,
  onSegmentUpdate,
  activeVideo,
  loopController
}: LoopControlFrameProps) {
  const [isEditingName, setIsEditingName] = useState<boolean>(false)
  const [nameInput, setNameInput] = useState<string>('')

  const activeSegment =
    typeof activeSegmentIndex === 'number' && segments[activeSegmentIndex]
      ? segments[activeSegmentIndex]
      : null

  const handleNameClick = () => {
    if (activeSegment) {
      setNameInput(activeSegment.name ?? `Loop ${activeSegment.index + 1}`)
      setIsEditingName(true)
    }
  }

  const handleNameSave = (newName: string) => {
    if (activeSegment && onSegmentUpdate) {
      onSegmentUpdate(activeSegment.index, activeSegment.end, newName)
    }
    setIsEditingName(false)
  }

  return (
    <div className="loop-control-frame">
      <div className="loop-name-field">
        {activeSegment && (
          <>
            <p
              className="video-loop-name"
              onClick={handleNameClick}
              title="Click to edit name"
            >
              {activeSegment.name ?? `Loop ${activeSegment.index + 1}`}
            </p>
            {isEditingName && (
              <LoopNameEditPopup
                initialValue={nameInput}
                onSave={(newName) => {
                  handleNameSave(newName)
                }}
                onCancel={() => setIsEditingName(false)}
              />
            )}
          </>
        )}
      </div>
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
        {typeof activeSegmentIndex === 'number' &&
          segments[activeSegmentIndex] && (
            <Recorder
              key={`${activeVideo}-${segments[activeSegmentIndex].start}-${segments[activeSegmentIndex].end}`}
              videoId={activeVideo}
              startSegment={segments[activeSegmentIndex].start}
              endSegment={segments[activeSegmentIndex].end}
            />
          )}
      </div>
    </div>
  )
}

export default LoopControlFrame

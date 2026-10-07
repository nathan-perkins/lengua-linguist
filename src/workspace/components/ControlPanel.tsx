import {
  IconPlayerPlayFilled,
  IconPlayerPauseFilled,
  IconPlayerTrackNextFilled,
  IconPlayerTrackPrevFilled,
  IconRepeat
} from '@tabler/icons-react'
import type { Player } from '../types'
import Timeline from './Timeline'
import TimelineLoop from './TimelineLoop'
import { format } from '../utils/formatTime'
import '../css/ControlPanel.css'

type ControlPanelProps = {
  player: Player
}

export default function ControlPanel({ player: { state, handlers } }: ControlPanelProps) {
  return (
    <div className="control-panel">
      <div className="timeline-container">
        <Timeline state={state} />
        {state.isActiveLoop &&
          state.activeLoops.map((loop) => (
            <TimelineLoop key={loop.id} loop={loop} videoDuration={state.duration} />
          ))}
      </div>
      <div className="control-icons">
        <button className="icon-btn" onClick={handlers.handleLoopBackwardStep}>
          <IconPlayerTrackPrevFilled className="icon" />
        </button>
        <button className="icon-btn" onClick={handlers.handlePlayPause}>
          {state.playing ? (
            <IconPlayerPauseFilled className="icon" />
          ) : (
            <IconPlayerPlayFilled className="icon" />
          )}
        </button>
        <button className="icon-btn" onClick={handlers.handleLoopForwardStep}>
          <IconPlayerTrackNextFilled className="icon" />
        </button>
        <span>{format(state.playedSeconds)}</span>
        <button
          className={`icon-btn loop-control-btn ${state.isActiveLoop ? 'active' : ''}`}
          onClick={handlers.handleToggleLoops}
        >
          <IconRepeat className="icon" />
        </button>
      </div>
    </div>
  )
}

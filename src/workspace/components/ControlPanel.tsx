import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay, faPause, faForwardStep, faBackwardStep } from '@fortawesome/free-solid-svg-icons'
import type { Player } from '../types'
import Timeline from './Timeline'
import { format } from '../utils/formatTime'
import '../css/ControlPanel.css'

type ControlPanelProps = {
  player: Player
}

export default function ControlPanel({ player: { state, handlers } }: ControlPanelProps) {
  return (
    <div className="control-panel">
      <Timeline state={state} />
      <div className="control-icons">
        <button className="icon-btn">
          <FontAwesomeIcon className="icon" icon={faBackwardStep} />
        </button>
        <button className="icon-btn" onClick={handlers.handlePlayPause}>
          {state.playing ? (
            <FontAwesomeIcon className="icon" icon={faPause} />
          ) : (
            <FontAwesomeIcon className="icon" icon={faPlay} />
          )}
        </button>
        <button className="icon-btn">
          <FontAwesomeIcon className="icon" icon={faForwardStep} />
        </button>
      </div>
      <span>{format(state.playedSeconds)}</span>
    </div>
  )
}

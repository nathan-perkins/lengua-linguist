import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay, faPause, faForwardStep, faBackwardStep } from '@fortawesome/free-solid-svg-icons'
import '../css/ControlPanel.css'

type ControlPanelProps = {
  isPlaying: boolean
  handlePlayPause: () => void
}

export default function ControlPanel({ isPlaying, handlePlayPause }: ControlPanelProps) {
  return (
    <div className="control-panel">
      <div className="timeline" />
      <div className="control-icons">
        <button className="icon-btn">
          <FontAwesomeIcon className="icon" icon={faBackwardStep} />
        </button>
        <button className="icon-btn" onClick={handlePlayPause}>
          {isPlaying ? (
            <FontAwesomeIcon className="icon" icon={faPause} />
          ) : (
            <FontAwesomeIcon className="icon" icon={faPlay} />
          )}
        </button>
        <button className="icon-btn">
          <FontAwesomeIcon className="icon" icon={faForwardStep} />
        </button>
      </div>
    </div>
  )
}

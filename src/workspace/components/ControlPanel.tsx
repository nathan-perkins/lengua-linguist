import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay, faForwardStep, faBackwardStep } from '@fortawesome/free-solid-svg-icons'
import '../css/ControlPanel.css'

export default function ControlPanel() {
  return (
    <div className="control-panel">
      <div className="timeline" />
      <div className="control-icons">
        <FontAwesomeIcon className="icon" icon={faBackwardStep} />
        <FontAwesomeIcon className="icon" icon={faPlay} />
        <FontAwesomeIcon className="icon" icon={faForwardStep} />
      </div>
    </div>
  )
}

import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMicrophone, faStop } from '@fortawesome/free-solid-svg-icons'

function Recorder() {
  const [isRecording, setIsRecording] = useState<boolean>(false)

  const handleRecord = () => {
    setIsRecording(true)
  }

  const handleStopRecord = () => {
    setIsRecording(false)
  }

  return (
    <div className="recorder-panel">
      {isRecording ? (
        <div className="recorder-popup">
          <FontAwesomeIcon icon={faStop} onClick={handleStopRecord} className="record-icon" />
        </div>
      ) : (
        <FontAwesomeIcon icon={faMicrophone} onClick={handleRecord} className="record-icon" />
      )}
    </div>
  )
}

export default Recorder
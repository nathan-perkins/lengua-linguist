import { useState, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMicrophone, faStop } from '@fortawesome/free-solid-svg-icons'

function Recorder() {
  const [permissionStatus, setPermissionStatus] = useState<'granted' | 'denied' | 'prompt'>('prompt')
  const [isRecording, setIsRecording] = useState<boolean>(false)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const streamRef = useRef<MediaStream | null>(null)

  const handleRecord = async () => {
    if (permissionStatus === 'denied') {
      alert('You denied microphone access. Please enable it in your browser settings.')
      return
    }

    if (permissionStatus === 'prompt') {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        streamRef.current = stream
        setPermissionStatus('granted')
        startRecording(stream)
      } catch (error) {
        console.error('Microphone access denied:', error)
        setPermissionStatus('denied')
        alert('Microphone access was denied. Please grant permission to record.')
      }
    } else {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      startRecording(stream)
    }
  }

  const startRecording = (stream: MediaStream) => {
    const mediaRecorder = new MediaRecorder(stream)
    mediaRecorderRef.current = mediaRecorder
    audioChunksRef.current = []

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunksRef.current.push(event.data)
      }
    }

    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
      const url = URL.createObjectURL(audioBlob)
      setAudioUrl(url)

      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
        streamRef.current = null
      }
    }

    mediaRecorder.start()
    setIsRecording(true)
  }

  const handleReset = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl)
    }
    setAudioUrl(null)
    audioChunksRef.current = []
  }

  const handleStopRecord = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  return (
    <div className="recorder-panel">
      {isRecording ? (
        <div className="recorder-popup">
          <FontAwesomeIcon icon={faStop} onClick={handleStopRecord} className="record-icon" />
          <span>🔴 Recording...</span>
        </div>
      ) : audioUrl ? (
        <div>
          <audio src={audioUrl} controls />
          <button type="button" onClick={handleReset}></button>
        </div>
      ) : (
        <FontAwesomeIcon icon={faMicrophone} onClick={handleRecord} className="record-icon" />
      )}
    </div>
  )
}

export default Recorder
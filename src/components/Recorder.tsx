import { useState, useEffect, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMicrophone, faStop } from '@fortawesome/free-solid-svg-icons'

interface RecorderProps {
  videoId: string
  startSegment: number
  endSegment: number
}

function Recorder({ videoId, startSegment, endSegment }: RecorderProps) {
  const [permissionStatus, setPermissionStatus] = useState<'granted' | 'denied' | 'prompt'>('prompt')
  const [isRecording, setIsRecording] = useState<boolean>(false)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const streamRef = useRef<MediaStream | null>(null)

  const segmentKey = `recording-${videoId}-${startSegment}-${endSegment}`

  useEffect(() => {
    const savedRecording = sessionStorage.getItem(segmentKey)
    if (savedRecording) {
      setAudioUrl(savedRecording)
    } else {
      setAudioUrl(null)
    }
  }, [segmentKey])

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

      const reader = new FileReader()
      reader.onloadend = () => {
        const base64data = reader.result as string
        sessionStorage.setItem(segmentKey, base64data)
        setAudioUrl(base64data)
      }
      reader.readAsDataURL(audioBlob)

      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
        streamRef.current = null
      }
    }

    mediaRecorder.start()
    setIsRecording(true)
  }

  const handleDelete = () => {
    if (audioUrl) {
      sessionStorage.removeItem(segmentKey)
      setAudioUrl(null)
      audioChunksRef.current = []
    }
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
          <button type="button" onClick={handleDelete}></button>
        </div>
      ) : (
        <FontAwesomeIcon icon={faMicrophone} onClick={handleRecord} className="record-icon" />
      )}
    </div>
  )
}

export default Recorder
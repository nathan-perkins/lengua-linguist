import { useEffect, useRef, useState } from 'react'
import { IconMicrophone, IconSquareFilled, IconXFilled } from '@tabler/icons-react'
import '../css/Recorder.css'

export default function Recorder() {
  const [isRecording, setIsRecording] = useState(false)
  const [recordedUrl, setRecordedUrl] = useState('')
  const mediaStream = useRef<MediaStream>(null)
  const mediaRecorder = useRef<MediaRecorder>(null)
  const chunks = useRef<Blob[]>([])

  const startRecording = async () => {
    try {
      console.log('record')
      setIsRecording(true)
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaStream.current = stream
      mediaRecorder.current = new MediaRecorder(stream)
      mediaRecorder.current.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.current.push(e.data)
      }
      mediaRecorder.current.onstop = () => {
        const recordedBlob = new Blob(chunks.current, { type: 'audio/webm' })
        const url = URL.createObjectURL(recordedBlob)
        setRecordedUrl(url)
        chunks.current = []
      }
      mediaRecorder.current.start()
    } catch (error) {
      console.error('Error accessing microphone:', error)
    }
  }

  const stopRecording = () => {
    console.log('lets go')
    setIsRecording(false)
    if (mediaRecorder.current && mediaRecorder.current.state === 'recording') {
      mediaRecorder.current.stop()
    }
    if (mediaStream.current) {
      mediaStream.current.getTracks().forEach((track) => track.stop())
    }
  }

  useEffect(() => {
    const keyDown = async (e: KeyboardEvent) => {
      if (e.key === 'F12') return

      e.preventDefault()

      if (e.code === 'KeyR') {
        if (isRecording) {
          stopRecording()
        } else {
          await startRecording()
        }
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => void keyDown(e)

    window.addEventListener('keydown', handleKeyDown)

    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isRecording])

  return (
    <div className="recorder">
      {recordedUrl ? (
        <div className="recording-container">
          <audio controls src={recordedUrl} />
          <button className="icon-btn" onClick={() => setRecordedUrl('')}>
            <IconXFilled className="icon" />
          </button>
        </div>
      ) : (
        <div className="recorder-control-btns">
          {isRecording ? (
            <button className="icon-btn" onClick={stopRecording}>
              <IconSquareFilled className="icon" />
            </button>
          ) : (
            <button className="icon-btn" onClick={() => void startRecording()}>
              <IconMicrophone className="icon" />
            </button>
          )}
        </div>
      )}
    </div>
  )
}

import { useRef, useState } from 'react'
import { IconMicrophone, IconSquareFilled } from '@tabler/icons-react'
import '../css/Recorder.css'

export default function Recorder() {
  const [isRecording, setIsRecording] = useState(false)
  const [recordedUrl, setRecordedUrl] = useState('')
  const mediaStream = useRef<MediaStream>(null)
  const mediaRecorder = useRef<MediaRecorder>(null)
  const chunks = useRef<Blob[]>([])
  const startRecording = async () => {
    try {
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
    setIsRecording(false)
    if (mediaRecorder.current && mediaRecorder.current.state === 'recording') {
      mediaRecorder.current.stop()
    }
    if (mediaStream.current) {
      mediaStream.current.getTracks().forEach((track) => track.stop())
    }
  }

  return (
    <div className="recorder">
      {recordedUrl && <audio controls src={recordedUrl} />}
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
    </div>
  )
}

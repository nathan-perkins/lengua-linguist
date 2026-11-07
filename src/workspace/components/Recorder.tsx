import { useRef, useState } from 'react'
import '../css/Recorder.css'

export default function Recorder() {
  const [recordedUrl, setRecordedUrl] = useState('')
  const mediaStream = useRef<MediaStream>(null)
  const mediaRecorder = useRef<MediaRecorder>(null)
  const chunks = useRef<Blob[]>([])
  const startRecording = async () => {
    try {
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
    if (mediaRecorder.current && mediaRecorder.current.state === 'recording') {
      mediaRecorder.current.stop()
    }
    if (mediaStream.current) {
      mediaStream.current.getTracks().forEach((track) => track.stop())
    }
  }

  return (
    <div className="recorder">
      <audio controls src={recordedUrl} />
      <div className="recorder-control-btns">
        <button onClick={() => void startRecording}>Start Recording</button>
        <button onClick={stopRecording}>Stop Recording</button>
      </div>
    </div>
  )
}

import { useState } from 'react'
import { useVideoQuery } from '../hooks/useVideoQuery'
import QueryForm from '../components/QueryForm'
import '../css/SourceMedia.css'

export default function SourceMedia() {
  const [submittedQuery, setSubmittedQuery] = useState('')
  const { videos, isError, error } = useVideoQuery(submittedQuery)

  if (isError) throw new Error(String(error))

  console.log(videos)

  return (
    <div className="source-media">
      <QueryForm setSubmittedQuery={setSubmittedQuery} />
    </div>
  )
}

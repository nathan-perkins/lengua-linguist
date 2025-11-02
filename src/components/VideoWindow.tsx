interface VideoWindowProps {
  activeVideo: string | null
}

function VideoWindow({ activeVideo }: VideoWindowProps) {
  if (!activeVideo) return null

  const embedUrl = `https://www.youtube.com/embed/${activeVideo}`

  return (
    <div className="video-window">
      <iframe
        width="560"
        height="315"
        src={embedUrl}
        title="YouTube video player"
        style={{ border: "none" }}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
        // eslint-disable-next-line react-dom/no-unsafe-iframe-sandbox
        sandbox="allow-scripts allow-same-origin allow-popups allow-presentation"
      ></iframe>
    </div>
  )
}

export default VideoWindow
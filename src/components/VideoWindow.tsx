function VideoWindow() {
  return (
    <div className="video-window">
      <iframe
        width="100%"
        src="https://www.youtube.com/embed/LQH9PKVZh4A?si=FBFEvjcbuP1b4Psl"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
        title="YouTube video player"
      />
    </div>
  )
}

export default VideoWindow
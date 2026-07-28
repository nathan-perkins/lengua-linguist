import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: Index
})

function Index() {
  return (
    <div className="container home-container">
      <h1 className="home-heading">
        Lengua<span className="accent">Linguist</span>
      </h1>
      <p className="home-body">
        Improve your accent in your target language by shadowing native speakers. Find a native
        speaker on YouTube whom you want to emulate and shadow them in bite sized segments.
      </p>
      <Link to="/app">
        <button type="button" className="action-btn">
          Get Started
        </button>
      </Link>
    </div>
  )
}

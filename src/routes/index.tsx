import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: Index
})

function Index() {
  return (
    <div className="hero">
      <h1>
        Lengua<span className="accent">Linguist</span>
      </h1>
      <p>
        Improve your accent in your target language by shadowing native speakers. Find a native
        speaker on YouTube whom you want to emulate and shadow them in bite sized segments.
      </p>
      <Link to="/app">
        <button type="button">Get Started</button>
      </Link>
    </div>
  )
}

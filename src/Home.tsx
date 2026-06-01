import { Link } from 'react-router'
import './css/App.css'

function Home() {
  return (
    <div className="container home-container">
      <h1 className="home-heading">Lengua<span className="accent">Linguist</span></h1>
      <p className="home-body">Improve your accent in your target language by shadowing native speakers. Find a native speaker on YouTube whom you want to emulate and shadow them in bite sized segments.</p>
      <Link to="/app">
        <button type="button" className="action-btn">Get Started</button>
      </Link>
      {/* <Link to="/new">
        <button type="button" className="secondary-btn">Try New Interface</button>
      </Link> */}
    </div>
  )
}

export default Home
import { Routes, Route } from 'react-router'
import Home from '../Home'
import App from '../App'
import NewApp from '../NewApp'

function Router() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/app" element={<App />} />
      <Route path="/new" element={<NewApp />} />
    </Routes>
  )
}

export default Router

import { Routes, Route } from 'react-router'
import Home from '../Home'
import App from '../App'

function Router() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/app" element={<App />} />
    </Routes>
  )
}

export default Router
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import Router from './routes/Router.tsx'
import { Analytics } from '@vercel/analytics/react'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Analytics />
    <BrowserRouter>
      <Router />
    </BrowserRouter>
  </StrictMode>
)

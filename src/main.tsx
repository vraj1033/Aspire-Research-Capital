import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// The preloader curtain should always lift onto the hero. Browsers otherwise
// restore a mid-page scroll position on reload, which would reveal whatever
// section happened to be last in view.
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual'
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Self-hosted variable fonts: no external requests, so the page also works
// on a Tailscale network without internet access.
import '@fontsource-variable/fraunces/full.css'
import '@fontsource-variable/fraunces/full-italic.css'
import '@fontsource-variable/geist'
import '@fontsource-variable/geist-mono'
import './styles.css'
import App from './App'
import { LangProvider } from './i18n'
import { SmoothScroll } from './lib/scroll'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LangProvider>
      <SmoothScroll>
        <App />
      </SmoothScroll>
    </LangProvider>
  </StrictMode>,
)

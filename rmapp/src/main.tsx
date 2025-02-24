import './index.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Main } from './game/components/Main'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Main />
  </StrictMode>
)

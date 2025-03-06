import './index.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import { Main } from './game/components/Main'
import { Stage } from './game/components/Stage'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* <Main /> */}
    <Stage />
  </StrictMode>
)

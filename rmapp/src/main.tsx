import './index.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import { Main } from './game/components/Main'
import { Stage } from './game/components/Stage'
import { BrowserRouter, Routes, Route } from 'react-router'
import { MainScreen } from './game/pages/MainScreen'
import { CharacterCreationScreen } from './game/pages/CharacterCreationScreen'
import { CustomizeCPUScreen } from './game/pages/CustomizeCPUScreen'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* <Main /> */}
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Stage />}>
          <Route index element={<MainScreen />} />
          <Route path="/create" element={<CharacterCreationScreen />} />
          <Route path="/custom_cpu" element={<CustomizeCPUScreen />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
)

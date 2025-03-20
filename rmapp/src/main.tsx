import './index.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Stage } from './game/components/Stage'
import { BrowserRouter, Routes, Route } from 'react-router'
import { MainScreen } from './game/pages/MainScreen'
import { CharacterCreationScreen } from './game/pages/CharacterCreationScreen'
import { CustomizeCPUScreen } from './game/pages/CustomizeCPUScreen'
import { CharacterNamingScreen } from './game/pages/CharacterNamingScreen'
import { CreateGameAccount } from './game/pages/CreateGameAccount'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Stage />}>
          <Route index element={<MainScreen />} />
          <Route path="/create" element={<CharacterCreationScreen />} />
          <Route path="/custom_cpu" element={<CustomizeCPUScreen />} />
          <Route path="/create_name" element={<CharacterNamingScreen />} />
          <Route path="/create_game_account" element={<CreateGameAccount />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
)

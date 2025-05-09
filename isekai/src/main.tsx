import './index.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router'
import { Root } from './pages/Root'
import { Blueprints } from './pages/Blueprints'
import { WalletAdapter } from './components/WalletAdapter'
import { Conditions } from './pages/Conditions'
import { EditCondition } from './pages/EditCondition'
import { EditAction } from './pages/EditAction'
import { EditSpawn } from './pages/EditSpawn'
import { BlueprintIntegration } from './pages/BlueprintIntegration'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <WalletAdapter>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Root />}>
            <Route index element={<Blueprints />} />
            <Route path="/blueprints/:id" element={<BlueprintIntegration />} />
            <Route path="/conditions" element={<Conditions />} />
            <Route path="/conditions/:id" element={<EditCondition />} />
            <Route path="/actions" element={<Conditions />} />
            <Route path="/actions/:id" element={<EditAction />} />
            <Route path="/spawns" element={<Conditions />} />
            <Route path="/spawns/:id" element={<EditSpawn />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </WalletAdapter>
  </StrictMode>
)

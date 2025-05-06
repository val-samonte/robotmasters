import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router'
import { Root } from './pages/Root'
import { Blueprints } from './pages/Blueprints'
import { WalletAdapter } from './components/WalletAdapter'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <WalletAdapter>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Root />}>
            <Route index element={<Blueprints />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </WalletAdapter>
  </StrictMode>
)

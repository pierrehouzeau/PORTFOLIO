import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

const mount = document.getElementById('react-root')
  || document.getElementById('projectGrid')
  || document.getElementById('root')
createRoot(mount).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

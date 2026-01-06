import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './home.jsx'
import App from './App.jsx'
import AppAI from './appai.jsx'
import AppSE from './appse.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename={import.meta.env.PROD ? '/portfolioLive/' : '/'}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/devops" element={<App />} />
        <Route path="/ai" element={<AppAI />} />
        <Route path="/software" element={<AppSE />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)

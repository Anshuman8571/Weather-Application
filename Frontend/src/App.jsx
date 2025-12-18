import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import { BrowserRouter, Routes, Route, Router } from 'react-router-dom'
import { AuthProvider } from '../auth/AuthContext'
import ProtectedRoute from './auth/Protected'

import Login from "./pages/Login"
import Register from "./pages/Register"
import Weather from "./pages/Weather"
import Forecast from "./pages/Forecast"
import History from "./pages/History"

function App() {
  const [count, setCount] = useState(0)

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login /> }/>
          <Route path="/register" element={<Register /> }/>
          
          <Router
            path="/weather"
            element={
              <ProtectedRoute>
                <Weather />
              </ProtectedRoute>
            }
          />

          <Router
            path="/forecast"
            element={
              <ProtectedRoute>
                <Forecast />
              </ProtectedRoute>
            }
          />

          <Router
            path="/history"
            element={
              <ProtectedRoute>
                <History />
              </ProtectedRoute>
            }
          />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App

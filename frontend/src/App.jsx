import { useState } from 'react'
import {BrowserRouter as Router, Routes, Route} from "react-router-dom"
import './App.css'
import HomePage from './Components/HomePage'
import LoginSignup from './Components/LoginSignup'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginSignup />} />
      </Routes>
    </Router>
    
  )
}

export default App

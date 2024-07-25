import React, { useEffect } from "react"
import LoginPage from "./pages/Login/Login"
import { Route, Routes } from "react-router-dom"
import Signup from "./pages/Signup/Signup"
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute"
import Home from './pages/Home/Home'
import Profile from "./pages/Profile/Profile"
import Adminpanel from "./pages/Adminpanel/Adminpanel"

function App() {    
  return (
    <>
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/adminpanel" element={<ProtectedRoute ><Adminpanel /></ProtectedRoute>} />
      
    </Routes>
    </>
  )
}

export default App

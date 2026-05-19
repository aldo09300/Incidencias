import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'

import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import NewIncident from './pages/NewIncident'
import Incidents from './pages/Incidents'
import IncidentDetail from './pages/IncidentDetail'
import Statistics from './pages/Statistics'
import AdminPanel from './pages/AdminPanel'
import NotFound from './pages/NotFound'

function AppShell({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/"         element={<Landing />} />
          <Route path="/login"    element={<Login />} />
          <Route path="/registro" element={<Register />} />

          <Route path="/dashboard" element={
            <ProtectedRoute><AppShell><Dashboard /></AppShell></ProtectedRoute>
          } />
          <Route path="/nuevo" element={
            <ProtectedRoute><AppShell><NewIncident /></AppShell></ProtectedRoute>
          } />
          <Route path="/incidentes" element={
            <ProtectedRoute><AppShell><Incidents /></AppShell></ProtectedRoute>
          } />
          <Route path="/incidentes/:id" element={
            <ProtectedRoute><AppShell><IncidentDetail /></AppShell></ProtectedRoute>
          } />
          <Route path="/estadisticas" element={
            <ProtectedRoute><AppShell><Statistics /></AppShell></ProtectedRoute>
          } />
          <Route path="/admin" element={
            <ProtectedRoute requireAdmin><AppShell><AdminPanel /></AppShell></ProtectedRoute>
          } />

          <Route path="*" element={<AppShell><NotFound /></AppShell>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Box from '@mui/material/Box'
import Navbar from './components/Navbar/Navbar'
import Footer from './components/Footer/Footer'
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'

import Landing from './pages/Landing/Landing'
import Login from './pages/Login/Login'
import Register from './pages/Register/Register'
import Dashboard from './pages/Dashboard/Dashboard'
import NewIncident from './pages/NewIncident/NewIncident'
import Incidents from './pages/Incidents/Incidents'
import IncidentDetail from './pages/IncidentDetail/IncidentDetail'
import Statistics from './pages/Statistics/Statistics'
import AdminPanel from './pages/AdminPanel/AdminPanel'
import NotFound from './pages/NotFound/NotFound'

function AppShell({ children }) {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
      <Navbar />
      <Box component="main" sx={{ flex: 1 }}>{children}</Box>
      <Footer />
    </Box>
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

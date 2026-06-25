import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import PrivateRoute from './components/PrivateRoute'

// Pages
import Accueil from './pages/Accueil'
import Catalogue from './pages/Catalogue'
import Login from './pages/Login'
import Register from './pages/Register'
import Panier from './pages/Panier'
import Checkout from './pages/Checkout'
import Confirmation from './pages/Confirmation'
import Commandes from './pages/Commandes'
import Dashboard from './pages/Dashboard'
import AdminDashboard from './pages/admin/AdminDashboard'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          {/* Pages publiques */}
          <Route path="/" element={<Accueil />} />
          <Route path="/catalogue" element={<Catalogue />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/adminDashboard" element={<AdminDashboard />} />

          {/* Pages protégées */}
          <Route path="/panier" element={
            <PrivateRoute><Panier /></PrivateRoute>
          } />
          <Route path="/checkout" element={
            <PrivateRoute><Checkout /></PrivateRoute>
          } />
          <Route path="/confirmation" element={
            <PrivateRoute><Confirmation /></PrivateRoute>
          } />
          <Route path="/commandes" element={
            <PrivateRoute><Commandes /></PrivateRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
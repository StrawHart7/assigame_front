import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import PrivateRoute from './components/PrivateRoute'
import Admin from './pages/Admin'
import AdminDashboard from './pages/admin/AdminDashboard'

// Pages
import Accueil from './pages/Accueil'
import Catalogue from './pages/Catalogue'
import Login from './pages/Login'
import Register from './pages/Register'
import Panier from './pages/Panier'

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
          <Route path="/admin" element={<Admin />} />
          <Route path="/adminDashboard" element={<AdminDashboard />} />

          {/* Pages protégées */}
          <Route path="/panier" element={
            <PrivateRoute><Panier /></PrivateRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
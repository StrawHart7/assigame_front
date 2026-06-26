import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'

// Pages
import Accueil from './pages/Accueil'
import Catalogue from './pages/Catalogue'
import Login from './pages/Login'
import Register from './pages/Register'
import Panier from './pages/Panier'
import Admin from './pages/Admin'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/"          element={<Accueil />} />
          <Route path="/catalogue" element={<Catalogue />} />
          <Route path="/login"     element={<Login />} />
          <Route path="/register"  element={<Register />} />
          <Route path="/panier"    element={<Panier />} />
          <Route path="/admin"     element={<Admin />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
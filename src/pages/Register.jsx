// PAGE : Register
// RESPONSABLE : Junior
// TODO : Formulaire inscription, appel POST /api/auth/register
// CHAMPS : Nom, Prenom, Email, Login, Motdepasse, telephone (optionnel)

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import { motion } from 'framer-motion'
import axios from 'axios'
import 'react-toastify/dist/ReactToastify.css'

export default function Register() {
  const navigate = useNavigate()
  const [userName, setUserName] = useState("")
  const [userPrenom, setUserPrenom] = useState("")
  const [userEmail, setUserEmail] = useState("")
  const [userLogin, setUserLogin] = useState("")
  const [userMotdepasse, setUserMotdepasse] = useState("")
  const [userTelephone, setUserTelephone] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleRegisterUser = async (e) => {
    e.preventDefault()
    
    // Validations basiques
    if (!userName || !userPrenom || !userEmail || !userLogin || !userMotdepasse) {
      toast.warning("Veuillez remplir tous les champs obligatoires.")
      return
    }

    setIsLoading(true)
    try {
      const payload = {
        nom: userName,
        prenom: userPrenom,
        email: userEmail,
        login: userLogin,
        motdepasse: userMotdepasse,
        telephone: userTelephone || null
      }

      // Appel API vers le backend Spring Boot (port 8081 comme configuré)
      const response = await axios.post("http://localhost:8081/api/auth/register", payload)
      
      toast.success("Inscription réussie ! Redirection en cours...")
      
      // Réinitialisation du formulaire
      setUserName("")
      setUserPrenom("")
      setUserEmail("")
      setUserLogin("")
      setUserMotdepasse("")
      setUserTelephone("")

      // Redirection vers la page de connexion après 2 secondes
      setTimeout(() => {
        navigate("/login")
      }, 2000)

    } catch (error) {
      console.error(error)
      const errorMsg = error.response?.data?.erreur || "Une erreur est survenue lors de l'inscription."
      toast.error(errorMsg)
    } finally {
      setIsLoading(false)
    }
  }

  // Styles premium en ligne
  const containerStyle = {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
    padding: '2rem 1rem',
    fontFamily: 'Outfit, sans-serif',
    color: '#fff'
  }

  const cardStyle = {
    background: 'rgba(255, 255, 255, 0.03)',
    backdropFilter: 'blur(16px)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '24px',
    padding: '2.5rem',
    width: '100%',
    maxWidth: '480px',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
  }

  const inputGroupStyle = {
    marginBottom: '1.25rem',
    textAlign: 'left'
  }

  const labelStyle = {
    display: 'block',
    fontSize: '0.85rem',
    fontWeight: '500',
    color: '#94a3b8',
    marginBottom: '0.5rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  }

  const inputStyle = {
    width: '100%',
    padding: '0.85rem 1rem',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '12px',
    color: '#fff',
    fontSize: '1rem',
    outline: 'none',
    transition: 'all 0.3s ease',
    boxSizing: 'border-box'
  }

  const rowStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem'
  }

  const buttonStyle = {
    width: '100%',
    padding: '1rem',
    background: 'linear-gradient(90deg, #F5A623 0%, #d97706 100%)',
    color: '#fff',
    border: 'none',
    borderRadius: '12px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '1rem',
    boxShadow: '0 4px 15px rgba(245, 166, 35, 0.4)',
    transition: 'all 0.3s ease'
  }

  return (
    <div style={containerStyle}>
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
      
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        style={cardStyle}
      >
        <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '2.25rem', fontWeight: 800, marginBottom: '0.5rem', background: 'linear-gradient(to right, #F5A623, #f59e0b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Créer un compte
        </h1>
        <p style={{ color: '#94a3b8', marginBottom: '2rem', fontSize: '0.95rem' }}>
          Rejoignez Assigame et accédez à notre catalogue exclusif.
        </p>

        <form onSubmit={handleRegisterUser}>
          <div style={rowStyle}>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Prénom *</label>
              <input 
                type="text" 
                value={userPrenom}
                onChange={(e) => setUserPrenom(e.target.value)}
                placeholder="Ex: John" 
                style={inputStyle}
                required
              />
            </div>
            
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Nom *</label>
              <input 
                type="text" 
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Ex: Doe" 
                style={inputStyle}
                required
              />
            </div>
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle}>Login / Nom d'utilisateur *</label>
            <input 
              type="text" 
              value={userLogin}
              onChange={(e) => setUserLogin(e.target.value)}
              placeholder="Ex: johndoe" 
              style={inputStyle}
              required
            />
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle}>Adresse Email *</label>
            <input 
              type="email" 
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              placeholder="Ex: john.doe@example.com" 
              style={inputStyle}
              required
            />
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle}>Numéro de Téléphone</label>
            <input 
              type="tel" 
              value={userTelephone}
              onChange={(e) => setUserTelephone(e.target.value)}
              placeholder="Ex: +228 90 00 00 00" 
              style={inputStyle}
            />
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle}>Mot de passe *</label>
            <input 
              type="password" 
              value={userMotdepasse}
              onChange={(e) => setUserMotdepasse(e.target.value)}
              placeholder="••••••••" 
              style={inputStyle}
              required
            />
          </div>

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit" 
            disabled={isLoading}
            style={{
              ...buttonStyle,
              opacity: isLoading ? 0.7 : 1,
              cursor: isLoading ? 'not-allowed' : 'pointer'
            }}
          >
            {isLoading ? 'Inscription...' : "S'inscrire"}
          </motion.button>
        </form>

        <p style={{ marginTop: '2rem', fontSize: '0.9rem', color: '#94a3b8' }}>
          Déjà un compte ?{' '}
          <Link to="/login" style={{ color: '#F5A623', textDecoration: 'none', fontWeight: '600' }}>
            Se connecter
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
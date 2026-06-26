import { createContext, useContext, useState } from 'react'
 
const AuthContext = createContext(null)
 
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('assigame_user')
    return stored ? JSON.parse(stored) : null
  })
 
  const [cartCount, setCartCount] = useState(0)
 
  const login = (userData) => {
    setUser(userData)
    localStorage.setItem('assigame_user', JSON.stringify(userData))
  }
 
  const logout = () => {
    setUser(null)
    setCartCount(0)
    localStorage.removeItem('assigame_user')
  }
 
  return (
    <AuthContext.Provider value={{ user, login, logout, cartCount, setCartCount }}>
      {children}
    </AuthContext.Provider>
  )
}
 
export function useAuth() {
  return useContext(AuthContext)
}
 
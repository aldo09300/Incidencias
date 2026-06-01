import { createContext, useContext, useEffect, useState } from 'react'
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  sendEmailVerification,
} from 'firebase/auth'
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from '../firebase/config'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        setUser(fbUser)
        try {
          const snap = await getDoc(doc(db, 'usuarios', fbUser.uid))
          setProfile(snap.exists() ? { id: snap.id, ...snap.data() } : null)
        } catch (err) {
          console.error('Error cargando perfil:', err)
          setProfile(null)
        }
      } else {
        setUser(null)
        setProfile(null)
      }
      setLoading(false)
    })
    return unsub
  }, [])

  const register = async (nombre, email, password) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(cred.user, { displayName: nombre })

    await setDoc(doc(db, 'usuarios', cred.user.uid), {
      nombre,
      email,
      role: 'usuario',
      fechaRegistro: serverTimestamp(),
    })
  }

  const login = async (email, password) => {
    return await signInWithEmailAndPassword(auth, email, password)
  }
  const logout = () => signOut(auth)

  const isAdmin = profile?.role === 'admin'

  return (
    <AuthContext.Provider value={{ user, profile, loading, isAdmin, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

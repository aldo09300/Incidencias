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

    // Send verification email
    await sendEmailVerification(cred.user)

    await setDoc(doc(db, 'usuarios', cred.user.uid), {
      nombre,
      email,
      role: 'usuario',
      fechaRegistro: serverTimestamp(),
    })
    
    // Sign out immediately so they have to verify their email
    await signOut(auth)
  }

  const login = async (email, password) => {
    const cred = await signInWithEmailAndPassword(auth, email, password)
    if (!cred.user.emailVerified) {
      await signOut(auth)
      throw { code: 'auth/email-not-verified' }
    }
    return cred
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

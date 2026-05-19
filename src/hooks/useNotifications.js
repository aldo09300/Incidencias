import { useState, useEffect } from 'react'
import {
  collection, query, where, orderBy, onSnapshot, doc, updateDoc, deleteDoc,
} from 'firebase/firestore'
import { db } from '../firebase/config'

export const useNotifications = (userId) => {
  const [notificaciones, setNotificaciones] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) { setNotificaciones([]); setLoading(false); return }

    const q = query(
      collection(db, 'notificaciones'),
      where('destinatarioId', '==', userId),
      orderBy('fecha', 'desc')
    )

    const unsub = onSnapshot(q,
      (snap) => {
        setNotificaciones(snap.docs.map(d => ({ id: d.id, ...d.data() })))
        setLoading(false)
      },
      (err) => { console.error(err); setLoading(false) }
    )
    return unsub
  }, [userId])

  const marcarLeida = async (id) => {
    await updateDoc(doc(db, 'notificaciones', id), { leida: true })
  }

  const marcarTodasLeidas = async () => {
    const pendientes = notificaciones.filter(n => !n.leida)
    await Promise.all(pendientes.map(n => marcarLeida(n.id)))
  }

  const eliminar = async (id) => {
    await deleteDoc(doc(db, 'notificaciones', id))
  }

  const noLeidas = notificaciones.filter(n => !n.leida).length

  return { notificaciones, loading, noLeidas, marcarLeida, marcarTodasLeidas, eliminar }
}

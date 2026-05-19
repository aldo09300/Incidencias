import { useState, useEffect } from 'react'
import {
  collection, query, where, orderBy, onSnapshot,
  doc, updateDoc, deleteDoc, addDoc, serverTimestamp,
  writeBatch,
} from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import { db, storage } from '../firebase/config'

export const useIncidents = ({ userId = null, all = false } = {}) => {
  const [incidentes, setIncidentes] = useState([])
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState(null)

  useEffect(() => {
    setLoading(true)
    let q
    if (all) {
      q = query(collection(db, 'incidentes'), orderBy('fechaCreacion', 'desc'))
    } else if (userId) {
      q = query(
        collection(db, 'incidentes'),
        where('usuarioId', '==', userId),
        orderBy('fechaCreacion', 'desc')
      )
    } else {
      setIncidentes([])
      setLoading(false)
      return
    }

    const unsub = onSnapshot(q,
      (snap) => {
        const data = snap.docs.map(d => ({ id: d.id, ...d.data() }))
        setIncidentes(data)
        setLoading(false)
      },
      (err) => {
        console.error(err)
        setError(err.message)
        setLoading(false)
      }
    )
    return unsub
  }, [userId, all])

  return { incidentes, loading, error }
}

export const crearIncidente = async ({ usuarioId, usuarioNombre, tipo, descripcion, ubicacionTexto, latitud, longitud, file }) => {
  const path = `incidentes/${usuarioId}/${Date.now()}_${file.name}`
  const fileRef = ref(storage, path)
  await uploadBytes(fileRef, file)
  const imagenURL = await getDownloadURL(fileRef)

  const docRef = await addDoc(collection(db, 'incidentes'), {
    usuarioId,
    usuarioNombre,
    tipo,
    descripcion,
    ubicacionTexto,
    latitud:  latitud  ?? null,
    longitud: longitud ?? null,
    imagenURL,
    imagenPath: path,
    estado: 'reportado',
    grupoId: null,
    fechaCreacion: serverTimestamp(),
    fechaActualizacion: serverTimestamp(),
  })

  // Notificar a administradores (RF-14)
  await notificarAdmins({
    titulo: 'Nuevo incidente reportado',
    mensaje: `${usuarioNombre} reportó: ${tipo}`,
    incidenteId: docRef.id,
  })

  return docRef.id
}

export const cambiarEstado = async (incidenteId, nuevoEstado, incidentes = []) => {
  const incidente = incidentes.find(i => i.id === incidenteId)
  const ids = []

  if (incidente?.grupoId) {
    // Si tiene grupo, actualizar todos los del grupo
    incidentes
      .filter(i => i.grupoId === incidente.grupoId)
      .forEach(i => ids.push(i.id))
  } else {
    ids.push(incidenteId)
  }

  const batch = writeBatch(db)
  ids.forEach(id => {
    batch.update(doc(db, 'incidentes', id), {
      estado: nuevoEstado,
      fechaActualizacion: serverTimestamp(),
    })
  })
  await batch.commit()

  // Notificar a los usuarios afectados (RF-13)
  const afectados = incidentes.filter(i => ids.includes(i.id))
  for (const inc of afectados) {
    await addDoc(collection(db, 'notificaciones'), {
      destinatarioId: inc.usuarioId,
      titulo: 'Estado de tu incidente actualizado',
      mensaje: `Tu reporte de ${inc.tipo} cambió a "${nuevoEstado.replace('_', ' ')}".`,
      incidenteId: inc.id,
      leida: false,
      fecha: serverTimestamp(),
    })
  }
}

export const agruparIncidentes = async (ids) => {
  if (ids.length < 2) return
  const grupoId = `grp_${Date.now()}`
  const batch = writeBatch(db)
  ids.forEach(id => {
    batch.update(doc(db, 'incidentes', id), { grupoId })
  })
  await batch.commit()
  return grupoId
}

export const desagruparIncidente = async (incidenteId) => {
  await updateDoc(doc(db, 'incidentes', incidenteId), { grupoId: null })
}

export const eliminarIncidente = async (incidente) => {
  if (incidente.imagenPath) {
    try { await deleteObject(ref(storage, incidente.imagenPath)) } catch (e) {}
  }
  await deleteDoc(doc(db, 'incidentes', incidente.id))
}

const notificarAdmins = async ({ titulo, mensaje, incidenteId }) => {
  try {
    const adminsSnap = await import('firebase/firestore').then(({ getDocs, query, where, collection }) =>
      getDocs(query(collection(db, 'usuarios'), where('role', '==', 'admin')))
    )
    for (const adminDoc of adminsSnap.docs) {
      await addDoc(collection(db, 'notificaciones'), {
        destinatarioId: adminDoc.id,
        titulo, mensaje, incidenteId,
        leida: false,
        fecha: serverTimestamp(),
      })
    }
  } catch (e) { console.error('Error notificando admins:', e) }
}

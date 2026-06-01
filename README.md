# Sistema de Reporte de Incidentes — Universidad de la Amazonia

Aplicación web en React + Firebase para reportar y gestionar incidentes dentro de las instalaciones de la universidad (fugas, daños eléctricos, infraestructura, etc.).

---

## Características

- Autenticación con correo y contraseña (Firebase Auth)
- Reporte de incidentes con foto obligatoria y ubicación (texto + GPS opcional)
- Listado con filtros por estado, tipo y búsqueda
- Vista detallada de cada incidente
- Panel de administración con cambio de estado en lote y **agrupación de duplicados**
- Estadísticas con gráficos (torta y barras) e **impresión** de reportes
- Notificaciones in-app (campanita) al usuario cuando cambia el estado de su reporte, y al admin cuando llega uno nuevo
- Interfaz responsiva (móvil, tablet, escritorio)
- Tema institucional con los colores de la Universidad de la Amazonia

---

## Stack

- React 18 + Vite
- React Router DOM
- MUI
- Firebase: Auth + Firestore + Storage
- Recharts (gráficos)
- react-to-print (impresión)

---

## Instalación local

```bash
npm install
```



###  Ejecutar

```bash
npm run dev
```

Abre http://localhost:5173

---

## Cómo crear un Administrador

Por seguridad, el rol de admin se asigna manualmente:

1. Regístrate normalmente desde la app con el correo que será admin.
2. Ve a la consola de Firebase → **Firestore Database** → colección `usuarios`.
3. Abre el documento del usuario y edita el campo `role` cambiándolo de `usuario` a `admin`.
4. Cierra y vuelve a abrir sesión en la app.

Aparecerá el enlace "Admin" en la navbar.

---


## Estructura de datos en Firestore

### Colección `usuarios`
```
{ id, nombre, email, role: 'usuario' | 'admin', fechaRegistro }
```

### Colección `incidentes`
```
{
  id, usuarioId, usuarioNombre,
  tipo, descripcion,
  imagenURL, imagenPath,
  ubicacionTexto, latitud, longitud,
  estado: 'reportado' | 'en_proceso' | 'resuelto',
  grupoId,                         // ID que identifica un grupo de incidentes
  fechaCreacion, fechaActualizacion
}
```

### Colección `notificaciones`
```
{ id, destinatarioId, titulo, mensaje, incidenteId, leida, fecha }
```

---

## Cumplimiento de requisitos

| Requisito | Implementación |
|-----------|----------------|
| RF-01 a 04 | Firebase Auth con correo/contraseña + roles |
| RF-05 | Formulario con tipo, descripción, foto obligatoria, ubicación texto + GPS opcional, fecha automática |
| RF-06, 07 | Firestore con estructura completa |
| RF-08 | Listado con filtros y vista detalle con imagen y estado |
| RF-09 | Cambio de estado por admin |
| RF-10 | Agrupación de incidentes (`grupoId` + cambio de estado en cascada) |
| RF-11 | Estadísticas por periodo (totales, por estado, por tipo) + gráficos |
| RF-12 | Botón "Imprimir reporte" con react-to-print |
| RF-13 | Notificaciones in-app al usuario al cambiar el estado |
| RF-14 | Notificaciones in-app al admin al crear un nuevo incidente |
| RNF-03 | Tailwind responsive (móvil/tablet/desktop) |
| RNF-05 | Firebase Storage para fotos |
| RNF-09 | Código organizado por responsabilidades |

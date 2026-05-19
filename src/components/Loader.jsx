function Loader({ fullScreen = false }) {
  const wrapper = fullScreen
    ? 'min-h-screen flex items-center justify-center'
    : 'flex items-center justify-center py-12'

  return (
    <div className={wrapper}>
      <div className="flex flex-col items-center gap-3">
        <div className="w-12 h-12 border-4 border-udla-100 border-t-udla-500 rounded-full animate-spin"></div>
        <p className="text-sm text-gray-500 font-medium">Cargando...</p>
      </div>
    </div>
  )
}

export default Loader

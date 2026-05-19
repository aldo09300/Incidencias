function Footer() {
  return (
    <footer className="bg-udla-700 text-white/80 mt-16 no-print">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src="/logo-udla.png" alt="UDLA" className="h-10 w-10 rounded-full bg-white p-0.5" />
            <div>
              <p className="font-semibold text-white text-sm">Universidad de la Amazonia</p>
              <p className="text-xs">Sistema de Reporte de Incidentes</p>
            </div>
          </div>
          <p className="text-xs text-center md:text-right">
            © {new Date().getFullYear()} — Programación Web<br />
            Ingeniería de Sistemas
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

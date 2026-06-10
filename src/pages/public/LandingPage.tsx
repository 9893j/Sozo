export default function LandingPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center text-center px-4"
      style={{ backgroundColor: '#0C0B09' }}
    >
      <div>
        <div
          className="w-16 h-16 flex items-center justify-center mx-auto mb-6 font-serif font-black text-3xl"
          style={{
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #C8A96E, #9A7D4A)',
            color: '#0C0B09',
          }}
        >
          S
        </div>
        <h1 className="font-serif font-black mb-4" style={{ fontSize: 'clamp(42px, 8vw, 72px)', color: '#fff', letterSpacing: '-2px' }}>
          Sozo <em className="italic" style={{ color: '#C8A96E' }}>Church</em>
        </h1>
        <p className="text-lg mb-8" style={{ color: '#78746C' }}>Transformados para Transformar</p>
        <a href="/login" className="btn-gold">
          Acessar o painel →
        </a>
      </div>
    </div>
  )
}
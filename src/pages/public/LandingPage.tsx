// TODO: Sprint 1 — implementar seções da landing fiel ao protótipo
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-stone-950 flex items-center justify-center text-center px-4">
      <div>
        <div className="w-16 h-16 rounded-[14px] bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center font-serif font-black text-stone-950 text-3xl mx-auto mb-6">
          S
        </div>
        <h1 className="font-serif text-5xl font-black text-white mb-4">
          Sozo <em className="italic text-gold">Church</em>
        </h1>
        <p className="text-stone-400 text-lg mb-8">Transformados para Transformar</p>
        <a href="/login" className="btn-gold inline-flex">
          Acessar o painel →
        </a>
      </div>
    </div>
  )
}

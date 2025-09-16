import { useState, useEffect } from 'react'
import AuthModal from './AuthModal'

export default function HeroSection() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <section className="relative py-20 px-4 bg-[#faf8f5] overflow-hidden">
      {/* Floating Circles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className={`absolute rounded-full bg-[#e8dcc6] opacity-60 animate-float`}
            style={{
              width: `${Math.random() * 120 + 80}px`,
              height: `${Math.random() * 120 + 80}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.5}s`,
              transform: `translate(${mousePosition.x * 0.01}px, ${mousePosition.y * 0.01}px)`
            }}
          />
        ))}
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        {/* AI Badge */}
        <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full mb-8 hover:scale-105 transition-transform duration-300 border border-[#d2b48c]/30">
          <div className="w-2 h-2 bg-[#8b4513] rounded-full animate-pulse"></div>
          <span className="text-[#8b4513] font-medium">🌸 AI Marketplace for Artisans</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-5xl md:text-7xl font-bold text-[#2d2d2d] mb-6 leading-tight">
          Welcome to{' '}
          <span className="text-[#8b4513] hover:scale-105 transition-transform duration-300 inline-block">
            kalaMitrah
          </span>
        </h1>

        {/* Description */}
        <p className="text-xl text-[#6b6b6b] mb-12 max-w-2xl mx-auto leading-relaxed font-normal">
          Where ancient artistry meets artificial intelligence. Empower your craft with AI tools, 
          connect with art lovers worldwide, and turn your passion into prosperity.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="group bg-[#8b4513] text-white px-8 py-4 rounded-full font-semibold text-lg hover:scale-105 hover:shadow-xl transition-all duration-300"
          >
            <span className="group-hover:mr-2 transition-all duration-300">Explore Masterpieces</span>
          </button>
          <button className="bg-transparent text-[#8b4513] border-2 border-[#8b4513] px-8 py-4 rounded-full font-semibold text-lg hover:bg-[#8b4513] hover:text-white hover:scale-105 hover:shadow-xl transition-all duration-300">
            Join as Artisan
          </button>
        </div>
      </div>

      <AuthModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-15px) rotate(2deg); }
          66% { transform: translateY(8px) rotate(-2deg); }
        }
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
      `}</style>
    </section>
  )
}

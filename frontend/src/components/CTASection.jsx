import { ArrowRight, Sparkles } from 'lucide-react'

export default function CTASection() {
  return (
    <section className="relative py-20 bg-gradient-to-br from-[#8b4513] via-[#cd853f] to-[#d2b48c] overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-20 h-20 bg-white bg-opacity-10 rounded-full animate-pulse"></div>
        <div className="absolute top-32 right-20 w-16 h-16 bg-white bg-opacity-10 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-white bg-opacity-10 rounded-full animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-32 right-1/3 w-8 h-8 bg-white bg-opacity-10 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
      </div>

      <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        {/* Sparkle Icon */}
        <div className="inline-flex items-center justify-center w-16 h-16 bg-white bg-opacity-20 rounded-full mb-8 hover:scale-110 transition-transform duration-300">
          <Sparkles size={32} className="text-white" />
        </div>

        {/* Heading */}
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
          Ready to Start Your Artisan Journey?
        </h2>

        {/* Description */}
        <p className="text-xl text-white text-opacity-90 mb-12 max-w-2xl mx-auto leading-relaxed">
          Join thousands of artisans and art lovers in our thriving community
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button className="group bg-white text-[#8b4513] px-8 py-4 rounded-xl font-semibold text-lg hover:scale-105 hover:shadow-xl transition-all duration-300 flex items-center space-x-2">
            <span>Explore Marketplace</span>
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
          </button>
          <button className="bg-transparent text-white border-2 border-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white hover:text-[#8b4513] hover:scale-105 hover:shadow-xl transition-all duration-300">
            Join as Artisan
          </button>
        </div>
      </div>
    </section>
  )
}
import { useState } from 'react'
import { Search, Mic } from 'lucide-react'
import AuthModal from './AuthModal'

export default function Header() {
  const [showAuthModal, setShowAuthModal] = useState(false)
  return (
    <header className="bg-[#faf8f5] border-b border-[#e8dcc6] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="text-[#8b4513] text-2xl font-bold">
            कलामित्र
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6b6b6b]" size={20} />
              <input
                type="text"
                placeholder="Search crafts, artisans..."
                className="w-full pl-10 pr-12 py-2 bg-white rounded-full border border-[#e8dcc6] focus:border-[#8b4513] focus:ring-2 focus:ring-[#8b4513] focus:ring-opacity-20 transition-all duration-300 text-[#2d2d2d]"
              />
              <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#6b6b6b] hover:text-[#8b4513] transition-colors duration-200">
                <Mic size={20} />
              </button>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setShowAuthModal(true)}
              className="bg-[#8b4513] hover:bg-[#6b3410] px-6 py-2 rounded-full text-white font-medium transition-all duration-200"
            >
              Sign In
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="pb-4">
          <div className="flex space-x-8">
            {['Home', 'Featured', 'Artisans', 'Products', 'Trends', 'Explore'].map((item) => (
              <button
                key={item}
                className="text-[#6b6b6b] hover:text-[#8b4513] py-2 relative group transition-colors duration-200 font-medium"
              >
                {item}
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#8b4513] group-hover:w-full transition-all duration-300"></div>
              </button>
            ))}
          </div>
        </nav>
      </div>
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </header>
  )
}

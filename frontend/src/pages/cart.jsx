import { useState, useEffect } from 'react'
import { ArrowLeft, ShoppingBag } from 'lucide-react'
import { useRouter } from 'next/router'

export default function Cart() {
  const [darkMode, setDarkMode] = useState(false)
  const [userName, setUserName] = useState('User')
  const router = useRouter()

  useEffect(() => {
    const storedName = localStorage.getItem('userName')
    if (storedName) {
      setUserName(storedName)
    }
    
    const savedTheme = localStorage.getItem('darkMode')
    if (savedTheme) {
      const isDark = JSON.parse(savedTheme)
      setDarkMode(isDark)
      if (isDark) {
        document.documentElement.classList.add('dark')
      }
    }
  }, [])

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-[#faf8f5] text-[#2d2d2d]'}`}>
      {/* Top Bar */}
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-[#2d2d2d]'} text-white px-4 py-2 flex items-center justify-between`}>
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-[#8b4513] rounded flex items-center justify-center">
            <span className="text-white text-xs">AI</span>
          </div>
          <span className="text-sm">AI Marketplace for Artisans</span>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 px-4 py-1 rounded text-sm transition-colors">
          Share
        </button>
      </div>

      {/* Header */}
      <header className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-[#e8dcc6]'} border-b px-6 py-4`}>
        <div className="flex items-center justify-between">
          <div className="text-[#8b4513] text-2xl font-bold">कलामित्र</div>
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => router.push('/profile')}
              className="w-8 h-8 bg-[#8b4513] rounded-full flex items-center justify-center hover:bg-[#6b3410] transition-colors"
            >
              <span className="text-white text-xs font-bold">{userName.charAt(0).toUpperCase()}</span>
            </button>
            <span className={`${darkMode ? 'text-white' : 'text-[#2d2d2d]'} font-medium`}>{userName}</span>
            <button 
              onClick={() => router.push('/')}
              className={`${darkMode ? 'text-gray-300 hover:text-white' : 'text-[#6b6b6b] hover:text-[#8b4513]'} transition-colors`}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 py-8 max-w-4xl mx-auto">
        <div className="flex items-center space-x-4 mb-8">
          <button 
            onClick={() => router.back()}
            className={`p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-[#e8dcc6]'}`}
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-3xl font-bold mb-2">Shopping Cart</h1>
            <p className={`${darkMode ? 'text-gray-300' : 'text-[#6b6b6b]'}`}>Your selected handcrafted treasures</p>
          </div>
        </div>

        {/* Empty Cart State */}
        <div className="text-center py-20">
          <div className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center ${
            darkMode ? 'bg-gray-700' : 'bg-gray-200'
          }`}>
            <ShoppingBag size={40} className={darkMode ? 'text-gray-400' : 'text-[#8b4513]'} />
          </div>
          
          <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-[#2d2d2d]'}`}>
            Your cart is empty
          </h2>
          
          <p className={`mb-8 ${darkMode ? 'text-gray-300' : 'text-[#6b6b6b]'}`}>
            Discover beautiful handcrafted items from our talented artisans
          </p>
          
          <button 
            onClick={() => router.push('/dashboard')}
            className="bg-[#8b4513] hover:bg-[#6b3410] text-white px-8 py-3 rounded-lg font-medium transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </main>
    </div>
  )
}
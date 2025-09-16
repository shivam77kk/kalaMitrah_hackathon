import { useState, useEffect } from 'react'
import { Search, Mic, Filter, Bell, Settings, User, LogOut, ShoppingBag } from 'lucide-react'
import { useRouter } from 'next/router'

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('trends')
  const [userName, setUserName] = useState('User')
  const [darkMode, setDarkMode] = useState(false)
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const fetchData = async (tab) => {
    setLoading(true)
    try {
      let url = ''
      switch(tab) {
        case 'trends': url = 'http://localhost:5000/api/trends'; break
        case 'products': url = 'http://localhost:5000/api/products'; break
        case 'artisans': url = 'http://localhost:5000/api/sellers'; break
        case 'orders': url = 'http://localhost:5000/api/orders/my-orders'; break
      }
      
      const token = localStorage.getItem('accessToken')
      const headers = { 'Content-Type': 'application/json' }
      if (token && tab === 'orders') headers.Authorization = `Bearer ${token}`
      
      const response = await fetch(url, { headers })
      const result = await response.json()
      
      if (result.success) {
        setData(result.trends || result.products || result.sellers || result.orders || [])
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('userName')
    localStorage.removeItem('darkMode')
    router.push('/')
  }

  useEffect(() => {
    // Check for Google Auth token in URL
    const urlParams = new URLSearchParams(window.location.search)
    const token = urlParams.get('token')
    if (token) {
      localStorage.setItem('accessToken', token)
      // Decode JWT to get user name
      try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        localStorage.setItem('userName', payload.name || 'Google User')
      } catch {
        localStorage.setItem('userName', 'Google User')
      }
      window.history.replaceState({}, document.title, window.location.pathname)
    }
    
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
    
    fetchData('trends')
  }, [])

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-[#faf8f5]'}`}>
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
      <header className={`${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-[#e8dcc6] text-[#2d2d2d]'} border-b px-6 py-4`}>
        <div className="flex items-center justify-between">
          <div className="text-[#8b4513] text-2xl font-bold">कलामित्र</div>
          
          <div className="flex-1 max-w-2xl mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6b6b6b]" size={20} />
              <input
                type="text"
                placeholder="Search crafts, artisans..."
                className={`w-full pl-10 pr-12 py-2 rounded-full border focus:border-[#8b4513] focus:ring-2 focus:ring-[#8b4513] focus:ring-opacity-20 transition-all duration-300 ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-[#f5f5f5] border-[#e8dcc6] text-[#2d2d2d]'
                }`}
              />
              <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#6b6b6b] hover:text-[#8b4513] transition-colors duration-200">
                <Mic size={20} />
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button 
              onClick={() => router.push('/cart')}
              className={`p-2 rounded-lg transition-colors ${
                darkMode ? 'hover:bg-gray-700' : 'hover:bg-[#e8dcc6]'
              }`}
            >
              <ShoppingBag size={20} className="text-[#8b4513]" />
            </button>
            <button 
              onClick={() => router.push('/settings')}
              className={`p-2 rounded-lg transition-colors ${
                darkMode ? 'hover:bg-gray-700' : 'hover:bg-[#e8dcc6]'
              }`}
            >
              <Settings size={20} className="text-[#8b4513]" />
            </button>
            <button className={`p-2 rounded-lg transition-colors ${
              darkMode ? 'hover:bg-gray-700' : 'hover:bg-[#e8dcc6]'
            }`}>
              <Bell size={20} className="text-[#8b4513]" />
            </button>
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => router.push('/profile')}
                className="w-8 h-8 bg-[#8b4513] rounded-full flex items-center justify-center hover:bg-[#6b3410] transition-colors"
              >
                <User size={16} className="text-white" />
              </button>
              <span className={`font-medium ${darkMode ? 'text-white' : 'text-[#2d2d2d]'}`}>{userName}</span>
              <button 
                onClick={handleLogout}
                className="text-[#8b4513] hover:text-[#6b3410] transition-colors"
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>
        </div>

        <nav className="mt-4">
          <div className="flex space-x-8">
            {['Home', 'Featured', 'Artisans', 'Products', 'Trends', 'Explore'].map((item) => (
              <button
                key={item}
                onClick={() => item === 'Home' && router.push('/')}
                className="text-[#6b6b6b] hover:text-[#8b4513] py-2 relative group transition-colors duration-200 font-medium"
              >
                {item}
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#8b4513] group-hover:w-full transition-all duration-300"></div>
              </button>
            ))}
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="px-6 py-6">
        <div className="mb-6">
          <h1 className={`text-3xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-[#2d2d2d]'}`}>Welcome back, {userName}!</h1>
          <p className={darkMode ? 'text-gray-300' : 'text-[#6b6b6b]'}>Discover amazing handcrafted products from talented artisans</p>
        </div>

        {/* Voice Search */}
        <div className={`rounded-lg p-4 mb-6 shadow-sm border ${
          darkMode 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center space-x-4">
            <Search className="text-[#6b6b6b]" size={20} />
            <input
              type="text"
              placeholder="Try voice search: 'Show me wooden handicrafts from Rajasthan'"
              className={`flex-1 bg-transparent outline-none ${
                darkMode ? 'text-gray-300' : 'text-[#6b6b6b]'
              }`}
            />
            <button className={`p-1 rounded transition-colors ${
              darkMode ? 'hover:bg-gray-700' : 'hover:bg-[#e8dcc6]'
            }`}>
              <Mic size={18} className="text-[#8b4513]" />
            </button>
            <button className="bg-[#8b4513] hover:bg-[#6b3410] text-white px-4 py-2 rounded flex items-center space-x-2 transition-colors">
              <Filter size={16} />
              <span>Filters</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className={`flex space-x-12 mb-6 border-b ${
          darkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          {[
            { id: 'trends', label: 'Trends' },
            { id: 'products', label: 'Products' },
            { id: 'artisans', label: 'Artisans' },
            { id: 'orders', label: 'My Orders' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id)
                fetchData(tab.id)
              }}
              className={`pb-3 border-b-2 transition-colors font-medium ${
                activeTab === tab.id
                  ? 'border-[#8b4513] text-[#8b4513]'
                  : `border-transparent hover:text-[#8b4513] ${
                      darkMode ? 'text-gray-300' : 'text-[#6b6b6b]'
                    }`
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className={`rounded-lg p-6 shadow-sm border ${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          {loading ? (
            <div className="text-center py-8">
              <div className="text-[#8b4513]">Loading...</div>
            </div>
          ) : (
            <div className="grid gap-4">
              {data.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No {activeTab} found
                </div>
              ) : (
                data.map((item, index) => (
                  <div key={index} className={`p-4 rounded-lg border ${
                    darkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50'
                  }`}>
                    <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-[#2d2d2d]'}`}>
                      {item.name || item.title || item.productName || `${activeTab.slice(0, -1)} ${index + 1}`}
                    </h3>
                    <p className={`text-sm mt-1 ${darkMode ? 'text-gray-300' : 'text-[#6b6b6b]'}`}>
                      {item.description || item.email || 'No description available'}
                    </p>
                    {item.price && (
                      <p className="text-[#8b4513] font-semibold mt-2">₹{item.price}</p>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
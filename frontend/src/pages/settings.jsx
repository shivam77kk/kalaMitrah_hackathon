import { useState, useEffect } from 'react'
import { ArrowLeft, Monitor, Sun, Moon, Globe, Check } from 'lucide-react'
import { useRouter } from 'next/router'

export default function Settings() {
  const [darkMode, setDarkMode] = useState(false)
  const [autoTheme, setAutoTheme] = useState(true)
  const [highContrast, setHighContrast] = useState(false)
  const [largeText, setLargeText] = useState(false)
  const [reduceMotion, setReduceMotion] = useState(false)
  const [language, setLanguage] = useState('hindi')
  const [userName, setUserName] = useState('User')
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem('userName')
    localStorage.removeItem('darkMode')
    router.push('/')
  }

  useEffect(() => {
    const storedName = localStorage.getItem('userName')
    if (storedName) {
      setUserName(storedName)
    }
    
    const savedTheme = localStorage.getItem('darkMode')
    if (savedTheme) {
      setDarkMode(JSON.parse(savedTheme))
    }
  }, [])

  const toggleDarkMode = () => {
    const newMode = !darkMode
    setDarkMode(newMode)
    localStorage.setItem('darkMode', JSON.stringify(newMode))
    if (newMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  const resetSettings = () => {
    setDarkMode(false)
    setAutoTheme(true)
    setHighContrast(false)
    setLargeText(false)
    setReduceMotion(false)
    setLanguage('hindi')
    localStorage.removeItem('darkMode')
    document.documentElement.classList.remove('dark')
  }

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
              onClick={handleLogout}
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
            <h1 className="text-3xl font-bold mb-2">Settings</h1>
            <p className={`${darkMode ? 'text-gray-300' : 'text-[#6b6b6b]'}`}>Customize your कलामित्र experience</p>
          </div>
        </div>

        {/* Theme Preferences */}
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 mb-6 shadow-sm`}>
          <div className="flex items-center space-x-2 mb-6">
            <Monitor size={20} className="text-[#8b4513]" />
            <h2 className="text-xl font-semibold">Theme Preferences</h2>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Auto Theme</h3>
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-[#6b6b6b]'}`}>Follow system theme (light/dark)</p>
              </div>
              <button
                onClick={() => setAutoTheme(!autoTheme)}
                className={`w-12 h-6 rounded-full transition-colors ${
                  autoTheme ? 'bg-[#8b4513]' : darkMode ? 'bg-gray-600' : 'bg-gray-300'
                }`}
              >
                <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                  autoTheme ? 'translate-x-6' : 'translate-x-0.5'
                }`} />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Dark Mode</h3>
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-[#6b6b6b]'}`}>Switch to dark theme</p>
              </div>
              <div className="flex items-center space-x-2">
                <Sun size={16} className={darkMode ? 'text-gray-400' : 'text-yellow-500'} />
                <button
                  onClick={toggleDarkMode}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    darkMode ? 'bg-[#8b4513]' : 'bg-gray-300'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    darkMode ? 'translate-x-6' : 'translate-x-0.5'
                  }`} />
                </button>
                <Moon size={16} className={darkMode ? 'text-blue-400' : 'text-gray-400'} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className={`p-4 rounded-lg border-2 ${!darkMode ? 'border-[#8b4513] bg-white' : 'border-gray-600 bg-gray-100'}`}>
                <h4 className="font-medium text-gray-800 mb-2">Light Theme</h4>
                <div className="space-y-1">
                  <div className="h-2 bg-[#8b4513] rounded"></div>
                  <div className="h-2 bg-gray-300 rounded"></div>
                </div>
              </div>
              <div className={`p-4 rounded-lg border-2 ${darkMode ? 'border-yellow-500 bg-gray-800' : 'border-gray-300 bg-gray-800'}`}>
                <h4 className="font-medium text-white mb-2">Dark Theme</h4>
                <div className="space-y-1">
                  <div className="h-2 bg-yellow-500 rounded"></div>
                  <div className="h-2 bg-gray-600 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Language & Region */}
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 mb-6 shadow-sm`}>
          <div className="flex items-center space-x-2 mb-6">
            <Globe size={20} className="text-[#8b4513]" />
            <h2 className="text-xl font-semibold">Language & Region</h2>
          </div>

          <div className="mb-6">
            <h3 className="font-medium mb-3">Display Language</h3>
            <div className="flex items-center space-x-2">
              <select 
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className={`px-3 py-2 rounded-lg border ${
                  darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-[#2d2d2d]'
                }`}
              >
                <option value="hindi">Hindi हिंदी</option>
                <option value="english">English</option>
              </select>
              <Check size={16} className="text-green-500" />
            </div>
            <p className={`text-sm mt-2 ${darkMode ? 'text-gray-300' : 'text-[#6b6b6b]'}`}>
              Choose your preferred language for the interface. Artisan descriptions and content will be displayed in selected language when available.
            </p>
          </div>

          <div>
            <h3 className="font-medium mb-3">Language Support</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm">Interface Translation</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm">Voice Commands</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span className="text-sm">AI Assistant</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-sm">Content Translation</span>
              </div>
            </div>
          </div>
        </div>

        {/* Accessibility */}
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 mb-6 shadow-sm`}>
          <h2 className="text-xl font-semibold mb-6">Accessibility</h2>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">High Contrast Mode</h3>
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-[#6b6b6b]'}`}>Enhance contrast for better visibility</p>
              </div>
              <button
                onClick={() => setHighContrast(!highContrast)}
                className={`w-12 h-6 rounded-full transition-colors ${
                  highContrast ? 'bg-[#8b4513]' : darkMode ? 'bg-gray-600' : 'bg-gray-300'
                }`}
              >
                <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                  highContrast ? 'translate-x-6' : 'translate-x-0.5'
                }`} />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Large Text</h3>
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-[#6b6b6b]'}`}>Increase font size throughout the app</p>
              </div>
              <button
                onClick={() => setLargeText(!largeText)}
                className={`w-12 h-6 rounded-full transition-colors ${
                  largeText ? 'bg-[#8b4513]' : darkMode ? 'bg-gray-600' : 'bg-gray-300'
                }`}
              >
                <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                  largeText ? 'translate-x-6' : 'translate-x-0.5'
                }`} />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Reduce Motion</h3>
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-[#6b6b6b]'}`}>Minimize animations and transitions</p>
              </div>
              <button
                onClick={() => setReduceMotion(!reduceMotion)}
                className={`w-12 h-6 rounded-full transition-colors ${
                  reduceMotion ? 'bg-[#8b4513]' : darkMode ? 'bg-gray-600' : 'bg-gray-300'
                }`}
              >
                <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                  reduceMotion ? 'translate-x-6' : 'translate-x-0.5'
                }`} />
              </button>
            </div>
          </div>
        </div>

        {/* Reset Settings */}
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 shadow-sm`}>
          <h2 className="text-xl font-semibold mb-4">Reset Settings</h2>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Reset to Defaults</h3>
              <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-[#6b6b6b]'}`}>Reset all settings to their original values</p>
            </div>
            <button
              onClick={resetSettings}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Reset
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
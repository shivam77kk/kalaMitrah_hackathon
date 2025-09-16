import { useState } from 'react'
import { X, User, Briefcase } from 'lucide-react'
import { useRouter } from 'next/router'

export default function AuthModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('login')
  const [userType, setUserType] = useState('buyer')
  const [formData, setFormData] = useState({ name: '', email: '', password: '', location: '' })
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleGoogleAuth = () => {
    const authUrl = userType === 'buyer' 
      ? 'http://localhost:5000/api/auth/google/buyer'
      : 'http://localhost:5000/api/auth/google/seller'
    window.open(authUrl, '_self')
  }

  const handleRegularAuth = async () => {
    setLoading(true)
    try {
      const endpoint = userType === 'buyer' ? '/api/buyers' : '/api/sellers'
      const url = activeTab === 'login' ? `${endpoint}/login` : `${endpoint}/register`
      
      const body = activeTab === 'login' 
        ? { email: formData.email, password: formData.password }
        : { name: formData.name, email: formData.email, password: formData.password }
      
      const response = await fetch(`http://localhost:5000${url}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
      
      const data = await response.json()
      
      if (data.success) {
        if (activeTab === 'login') {
          localStorage.setItem('accessToken', data.accessToken)
          localStorage.setItem('userName', data.user.name)
        } else {
          localStorage.setItem('userName', formData.name)
        }
        onClose()
        router.push('/dashboard')
      } else {
        alert(data.message || 'Authentication failed')
      }
    } catch (error) {
      alert('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <div className="text-center flex-1">
            <h2 className="text-2xl font-bold text-[#2d2d2d]">
              Welcome to <span className="text-[#8b4513]">कलामित्र</span>
            </h2>
            <p className="text-[#6b6b6b] text-sm mt-1">Join our artisan community</p>
          </div>
          <button onClick={onClose} className="text-[#6b6b6b] hover:text-[#2d2d2d]">
            <X size={24} />
          </button>
        </div>

        <div className="flex border-b border-gray-100">
          <button
            onClick={() => setActiveTab('login')}
            className={`flex-1 py-3 text-center font-medium ${
              activeTab === 'login' 
                ? 'text-[#8b4513] border-b-2 border-[#8b4513] bg-[#faf8f5]' 
                : 'text-[#6b6b6b] hover:text-[#8b4513]'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setActiveTab('register')}
            className={`flex-1 py-3 text-center font-medium ${
              activeTab === 'register' 
                ? 'text-[#8b4513] border-b-2 border-[#8b4513] bg-[#faf8f5]' 
                : 'text-[#6b6b6b] hover:text-[#8b4513]'
            }`}
          >
            Register
          </button>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="p-6">
            <div className="mb-6">
              <p className="text-sm text-[#6b6b6b] mb-3">Choose your role:</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setUserType('buyer')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-full border-2 transition-colors ${
                    userType === 'buyer'
                      ? 'bg-[#8b4513] text-white border-[#8b4513]'
                      : 'bg-white text-[#8b4513] border-[#8b4513] hover:bg-[#faf8f5]'
                  }`}
                >
                  <User size={18} />
                  Buyer
                </button>
                <button
                  onClick={() => setUserType('artisan')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-full border-2 transition-colors ${
                    userType === 'artisan'
                      ? 'bg-[#8b4513] text-white border-[#8b4513]'
                      : 'bg-white text-[#8b4513] border-[#8b4513] hover:bg-[#faf8f5]'
                  }`}
                >
                  <Briefcase size={18} />
                  Artisan
                </button>
              </div>
            </div>

            {activeTab === 'login' ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#2d2d2d] mb-2">Email</label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8b4513] focus:border-[#8b4513] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#2d2d2d] mb-2">Password</label>
                  <input
                    type="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8b4513] focus:border-[#8b4513] outline-none"
                  />
                </div>
                <button 
                  onClick={handleRegularAuth}
                  disabled={loading}
                  className="w-full bg-[#8b4513] text-white py-3 rounded-lg font-medium hover:bg-[#6b3410] transition-colors disabled:opacity-50"
                >
                  {loading ? 'Loading...' : `Login as ${userType === 'buyer' ? 'Buyer' : 'Artisan'}`}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#2d2d2d] mb-2">Full Name</label>
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8b4513] focus:border-[#8b4513] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#2d2d2d] mb-2">Email</label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8b4513] focus:border-[#8b4513] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#2d2d2d] mb-2">Password</label>
                  <input
                    type="password"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8b4513] focus:border-[#8b4513] outline-none"
                  />
                </div>
                <button 
                  onClick={handleRegularAuth}
                  disabled={loading}
                  className="w-full bg-[#8b4513] text-white py-3 rounded-lg font-medium hover:bg-[#6b3410] transition-colors disabled:opacity-50"
                >
                  {loading ? 'Loading...' : `Register as ${userType === 'buyer' ? 'Buyer' : 'Artisan'}`}
                </button>
              </div>
            )}

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-[#6b6b6b]">or</span>
                </div>
              </div>
              <button 
                onClick={handleGoogleAuth}
                className="w-full mt-4 flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
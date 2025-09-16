import { useState, useEffect } from 'react'
import { ArrowLeft, Camera, Edit, Heart, TrendingUp, Save, X } from 'lucide-react'
import { useRouter } from 'next/router'

export default function Profile() {
  const [darkMode, setDarkMode] = useState(false)
  const [userName, setUserName] = useState('User')
  const [userEmail, setUserEmail] = useState('')
  const [profileImage, setProfileImage] = useState('')
  const [uploadingImage, setUploadingImage] = useState(false)
  const [description, setDescription] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [likedProducts, setLikedProducts] = useState([])
  const [trendProducts, setTrendProducts] = useState([])
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' })
  const [editData, setEditData] = useState({ name: '', description: '' })
  const router = useRouter()

  useEffect(() => {
    const storedName = localStorage.getItem('userName')
    const storedEmail = localStorage.getItem('userEmail') || 'user@example.com'
    const storedImage = localStorage.getItem('userProfileImage')
    
    if (storedName) setUserName(storedName)
    if (storedImage) setProfileImage(storedImage)
    setUserEmail(storedEmail)
    setEditData({ name: storedName || '', description: '' })
    
    const savedTheme = localStorage.getItem('darkMode')
    if (savedTheme) {
      const isDark = JSON.parse(savedTheme)
      setDarkMode(isDark)
      if (isDark) document.documentElement.classList.add('dark')
    }
    
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('accessToken')
      if (!token) return
      
      // Fetch liked products
      const productsResponse = await fetch('http://localhost:5000/api/products', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const productsData = await productsResponse.json()
      if (productsData.success) {
        setLikedProducts(productsData.products || [])
      }
      
      // Fetch trending products
      const trendsResponse = await fetch('http://localhost:5000/api/trends', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const trendsData = await trendsResponse.json()
      if (trendsData.success) {
        setTrendProducts(trendsData.trends || [])
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
      setLikedProducts([])
      setTrendProducts([])
    }
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB')
      return
    }
    
    setUploadingImage(true)
    
    // Create preview immediately
    const reader = new FileReader()
    reader.onload = (e) => {
      setProfileImage(e.target.result)
    }
    reader.readAsDataURL(file)
    
    const formData = new FormData()
    formData.append('image', file)
    
    try {
      const token = localStorage.getItem('accessToken')
      
      // Try buyer endpoint first
      let response = await fetch('http://localhost:5000/api/buyers/profile/upload-image', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      })
      
      // If buyer fails, try seller endpoint
      if (!response.ok) {
        response = await fetch('http://localhost:5000/api/sellers/profile/image', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: formData
        })
      }
      
      if (response.ok) {
        const data = await response.json()
        if (data.success && data.profilePhotoUrl) {
          setProfileImage(data.profilePhotoUrl)
          localStorage.setItem('userProfileImage', data.profilePhotoUrl)
        } else {
          // Keep the preview image if backend fails
          localStorage.setItem('userProfileImage', profileImage)
        }
      } else {
        // Keep the preview image if backend fails
        localStorage.setItem('userProfileImage', profileImage)
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      // Keep the preview image even if upload fails
      localStorage.setItem('userProfileImage', profileImage)
    } finally {
      setUploadingImage(false)
    }
  }

  const handleSaveProfile = async () => {
    try {
      const token = localStorage.getItem('accessToken')
      const response = await fetch('http://localhost:5000/api/buyers/profile/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: editData.name,
          description: editData.description
        })
      })
      
      const data = await response.json()
      if (data.success) {
        setUserName(editData.name)
        setDescription(editData.description)
        localStorage.setItem('userName', editData.name)
        setIsEditing(false)
      }
    } catch (error) {
      console.error('Error updating profile:', error)
    }
  }

  const handleChangePassword = async () => {
    if (passwords.new !== passwords.confirm) {
      alert('New passwords do not match')
      return
    }
    
    try {
      const token = localStorage.getItem('accessToken')
      const response = await fetch('http://localhost:5000/api/buyers/profile/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ newPassword: passwords.new })
      })
      
      const data = await response.json()
      if (data.success) {
        alert('Password changed successfully')
        setShowPasswordModal(false)
        setPasswords({ current: '', new: '', confirm: '' })
      } else {
        alert(data.message)
      }
    } catch (error) {
      console.error('Error changing password:', error)
    }
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-[#faf8f5] text-[#2d2d2d]'}`}>
      {/* Header */}
      <header className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-[#e8dcc6]'} border-b px-6 py-4`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button onClick={() => router.back()} className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-[#e8dcc6]'}`}>
              <ArrowLeft size={20} />
            </button>
            <div className="text-[#8b4513] text-2xl font-bold">कलामित्र</div>
          </div>
          <h1 className="text-xl font-semibold">My Profile</h1>
        </div>
      </header>

      <main className="px-6 py-8 max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 mb-6 shadow-sm`}>
          <div className="flex items-start space-x-6">
            <div className="relative">
              <div className="w-24 h-24 bg-[#8b4513] rounded-full flex items-center justify-center overflow-hidden border-2 border-gray-200">
                {profileImage ? (
                  <img 
                    src={profileImage} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none'
                      e.target.nextSibling.style.display = 'flex'
                    }}
                  />
                ) : null}
                <span 
                  className={`text-white text-2xl font-bold ${profileImage ? 'hidden' : 'flex'} items-center justify-center w-full h-full`}
                >
                  {userName.charAt(0).toUpperCase()}
                </span>
              </div>
              <label className={`absolute bottom-0 right-0 p-1 rounded-full cursor-pointer transition-colors ${
                uploadingImage ? 'bg-gray-400' : 'bg-[#8b4513] hover:bg-[#6b3410]'
              }`}>
                <Camera size={16} className="text-white" />
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageUpload} 
                  disabled={uploadingImage}
                  className="hidden" 
                />
              </label>
              {uploadingImage && (
                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>
            
            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-4">
                  <input
                    type="text"
                    value={editData.name}
                    onChange={(e) => setEditData({...editData, name: e.target.value})}
                    className={`w-full px-3 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                  />
                  <textarea
                    value={editData.description}
                    onChange={(e) => setEditData({...editData, description: e.target.value})}
                    placeholder="Tell us about yourself..."
                    className={`w-full px-3 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                    rows="3"
                  />
                  <div className="flex space-x-2">
                    <button onClick={handleSaveProfile} className="bg-[#8b4513] text-white px-4 py-2 rounded-lg flex items-center space-x-2">
                      <Save size={16} />
                      <span>Save</span>
                    </button>
                    <button onClick={() => setIsEditing(false)} className="bg-gray-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
                      <X size={16} />
                      <span>Cancel</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <h2 className="text-2xl font-bold">{userName}</h2>
                    <button onClick={() => setIsEditing(true)} className="text-[#8b4513] hover:text-[#6b3410]">
                      <Edit size={16} />
                    </button>
                  </div>
                  <p className={`${darkMode ? 'text-gray-300' : 'text-[#6b6b6b]'} mb-2`}>{userEmail}</p>
                  <p className={`${darkMode ? 'text-gray-300' : 'text-[#6b6b6b]'}`}>
                    {description || 'No description added yet.'}
                  </p>
                </div>
              )}
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={() => setShowPasswordModal(true)}
              className="bg-[#8b4513] hover:bg-[#6b3410] text-white px-4 py-2 rounded-lg"
            >
              Change Password
            </button>
          </div>
        </div>

        {/* Liked Products */}
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 mb-6 shadow-sm`}>
          <div className="flex items-center space-x-2 mb-4">
            <Heart size={20} className="text-red-500" />
            <h3 className="text-xl font-semibold">Liked Products</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {likedProducts.length === 0 ? (
              <p className={`col-span-3 text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                No liked products yet
              </p>
            ) : (
              likedProducts.map((product) => (
                <div key={product._id} className={`border rounded-lg p-4 ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                  <div className="w-full h-32 bg-gray-200 rounded-lg mb-3 overflow-hidden">
                    {product.images && product.images[0] ? (
                      <img src={product.images[0]} alt={product.productName} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gray-300"></div>
                    )}
                  </div>
                  <h4 className="font-medium">{product.productName || product.name}</h4>
                  <p className="text-[#8b4513] font-semibold">₹{product.price}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Trending Products */}
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 shadow-sm`}>
          <div className="flex items-center space-x-2 mb-4">
            <TrendingUp size={20} className="text-green-500" />
            <h3 className="text-xl font-semibold">Trending Products</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {trendProducts.length === 0 ? (
              <p className={`col-span-3 text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                No trending products yet
              </p>
            ) : (
              trendProducts.map((trend) => (
                <div key={trend._id} className={`border rounded-lg p-4 ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                  <div className="w-full h-32 bg-gray-200 rounded-lg mb-3 overflow-hidden">
                    {trend.videoUrl ? (
                      <video src={trend.videoUrl} className="w-full h-full object-cover" muted />
                    ) : (
                      <div className="w-full h-full bg-gray-300"></div>
                    )}
                  </div>
                  <h4 className="font-medium">{trend.title}</h4>
                  <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-[#6b6b6b]'}`}>
                    {trend.likes?.length || 0} likes
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 w-full max-w-md`}>
            <h3 className="text-xl font-semibold mb-4">Change Password</h3>
            <div className="space-y-4">
              <input
                type="password"
                placeholder="Current Password"
                value={passwords.current}
                onChange={(e) => setPasswords({...passwords, current: e.target.value})}
                className={`w-full px-3 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
              />
              <input
                type="password"
                placeholder="New Password"
                value={passwords.new}
                onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                className={`w-full px-3 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
              />
              <input
                type="password"
                placeholder="Confirm New Password"
                value={passwords.confirm}
                onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                className={`w-full px-3 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
              />
            </div>
            <div className="flex space-x-2 mt-6">
              <button onClick={handleChangePassword} className="bg-[#8b4513] text-white px-4 py-2 rounded-lg">
                Change Password
              </button>
              <button onClick={() => setShowPasswordModal(false)} className="bg-gray-500 text-white px-4 py-2 rounded-lg">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
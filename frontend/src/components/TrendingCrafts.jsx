import { Play, Heart, Eye, Clock } from 'lucide-react'
import { useState } from 'react'

export default function TrendingCrafts() {
  const [hoveredVideo, setHoveredVideo] = useState(null)

  const trendingCrafts = [
    {
      id: 1,
      title: "Making a Clay Pot from Scratch",
      artist: "Ramesh Kumar",
      views: "12.8k",
      likes: 890,
      duration: "15:42",
      thumbnail: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=300&fit=crop",
      isLive: true
    },
    {
      id: 2,
      title: "Silk Weaving Process",
      artist: "Lakshmi Devi",
      views: "8.3k",
      likes: 567,
      duration: "22:15",
      thumbnail: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500&h=300&fit=crop",
      isLive: false
    }
  ]

  return (
    <section className="py-16 bg-[#faf8f5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl font-bold text-[#2d2d2d] mb-2">Trending Crafts</h2>
            <p className="text-[#8b4513]">Watch artisans create magic with their hands</p>
          </div>
          <button className="flex items-center text-[#8b4513] hover:text-[#6b3410] font-medium group transition-colors duration-200">
            View All
            <span className="ml-2 group-hover:translate-x-1 transition-transform duration-200">→</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {trendingCrafts.map((craft, index) => (
            <div
              key={craft.id}
              className="relative group cursor-pointer"
              onMouseEnter={() => setHoveredVideo(index)}
              onMouseLeave={() => setHoveredVideo(null)}
            >
              <div className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500">
                <img
                  src={craft.thumbnail}
                  alt={craft.title}
                  className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-60 transition-all duration-300">
                  
                  {/* Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button 
                      className="bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-4 transform transition-all duration-300 group-hover:scale-110"
                      style={{
                        transform: hoveredVideo === index ? 'scale(1.1)' : 'scale(1)'
                      }}
                    >
                      <Play size={32} className="text-[#8b4513] ml-1" fill="currentColor" />
                    </button>
                  </div>

                  {/* Top Badges */}
                  <div className="absolute top-4 left-4 flex space-x-2">
                    {craft.isLive && (
                      <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center animate-pulse">
                        <div className="w-2 h-2 bg-white rounded-full mr-2"></div>
                        LIVE
                      </span>
                    )}
                    <span className="bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm">
                      {craft.duration}
                    </span>
                  </div>

                  {/* Bottom Info */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black to-transparent">
                    <h3 className="text-white text-xl font-bold mb-2 group-hover:text-[#d2b48c] transition-colors duration-300">
                      {craft.title}
                    </h3>
                    <p className="text-gray-300 mb-3">By {craft.artist}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-white text-sm">
                        <div className="flex items-center space-x-1">
                          <Eye size={16} />
                          <span>{craft.views} views</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Heart size={16} />
                          <span>{craft.likes}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button className="bg-white bg-opacity-90 hover:bg-opacity-100 p-2 rounded-full transition-all duration-200">
                      <Heart size={16} className="text-gray-700" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}


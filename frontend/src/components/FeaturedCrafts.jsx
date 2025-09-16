import { Heart, Star } from 'lucide-react'

export default function FeaturedCrafts() {
  const crafts = [
    {
      id: 1,
      title: "Hand-carved Wooden Bowl",
      price: "₹2,500",
      originalPrice: "₹3,000",
      rating: 4.8,
      reviews: 24,
      artist: "Ramesh Kumar",
      location: "Rajasthan",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
      trending: true
    },
    {
      id: 2,
      title: "Traditional Silk Saree",
      price: "₹8,500",
      rating: 4.9,
      reviews: 31,
      artist: "Lakshmi Devi",
      location: "Tamil Nadu",
      image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=300&fit=crop",
      trending: true
    },
    {
      id: 3,
      title: "Blue Pottery Vase",
      price: "₹1,800",
      rating: 4.7,
      reviews: 18,
      artist: "Anjali Sharma",
      location: "Jaipur",
      image: "https://images.unsplash.com/photo-1578749849138-f07a1a4fc535?w=400&h=300&fit=crop",
      trending: true
    },
    {
      id: 4,
      title: "Silver Jewelry Set",
      price: "₹5,200",
      rating: 4.8,
      reviews: 22,
      artist: "Mohan Singh",
      location: "Gujarat",
      image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=300&fit=crop",
      trending: true
    }
  ]

  return (
    <section className="py-16 bg-[#faf8f5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl font-bold text-[#2d2d2d] mb-2">Featured Crafts</h2>
            <p className="text-[#8b4513]">Handpicked masterpieces from our artisans</p>
          </div>
          <button className="flex items-center text-[#8b4513] hover:text-[#6b3410] font-medium group transition-colors duration-200">
            View All
            <span className="ml-2 group-hover:translate-x-1 transition-transform duration-200">→</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {crafts.map((craft) => (
            <div key={craft.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300">
              <div className="relative">
                <img src={craft.image} alt={craft.title} className="w-full h-48 object-cover" />
                <button className="absolute top-3 right-3 p-2 bg-white/80 rounded-full hover:bg-white transition-colors">
                  <Heart size={16} className="text-[#6b6b6b]" />
                </button>
                {craft.trending && (
                  <span className="absolute top-3 left-3 bg-[#8b4513] text-white px-2 py-1 rounded text-xs font-medium">
                    ⭐ Trending
                  </span>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-[#2d2d2d] mb-2">{craft.title}</h3>
                <div className="flex items-center mb-2">
                  <Star size={14} className="text-yellow-400 fill-current" />
                  <span className="text-sm text-[#2d2d2d] ml-1">{craft.rating}</span>
                  <span className="text-sm text-[#6b6b6b] ml-1">({craft.reviews})</span>
                </div>
                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-lg font-bold text-[#2d2d2d]">{craft.price}</span>
                  {craft.originalPrice && (
                    <span className="text-sm text-[#6b6b6b] line-through">{craft.originalPrice}</span>
                  )}
                </div>
                <div className="mb-4">
                  <p className="text-sm text-[#6b6b6b]">By {craft.artist}</p>
                  <p className="text-xs text-[#8b4513]">{craft.location}</p>
                </div>
                <button className="w-full bg-[#8b4513] text-white py-2 rounded-lg font-medium hover:bg-[#6b3410] transition-colors">
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
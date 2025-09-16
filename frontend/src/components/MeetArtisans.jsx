import { Star } from 'lucide-react'

export default function MeetArtisans() {
  const artisans = [
    {
      id: 1,
      name: "Ramesh Kumar",
      craft: "Wood Carving",
      location: "Rajasthan",
      rating: 4.9,
      years: 25,
      crafts: 47,
      description: "Master craftsman keeping ancient wood carving traditions alive."
    },
    {
      id: 2,
      name: "Lakshmi Devi",
      craft: "Silk Weaving",
      location: "Tamil Nadu",
      rating: 4.8,
      years: 18,
      crafts: 32,
      description: "Weaving stories through silk with techniques passed down through generations."
    },
    {
      id: 3,
      name: "Anjali Sharma",
      craft: "Blue Pottery",
      location: "Jaipur",
      rating: 4.7,
      years: 12,
      crafts: 28,
      description: "Creating beautiful blue pottery that captures the essence of Rajasthan."
    }
  ]

  return (
    <section className="py-16 bg-[#faf8f5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#2d2d2d] mb-4">Meet Our Artisans</h2>
          <p className="text-[#8b4513] max-w-2xl mx-auto">
            Discover the passionate creators behind these beautiful handcrafted treasures
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {artisans.map((artisan) => (
            <div key={artisan.id} className="bg-white rounded-2xl p-6 text-center hover:shadow-lg transition-shadow">
              <div className="relative mb-6">
                <div className="w-20 h-20 mx-auto bg-[#e8dcc6] rounded-full flex items-center justify-center mb-2">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-[#8b4513]">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="currentColor"/>
                  </svg>
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-[#8b4513] rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">1</span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-[#2d2d2d] mb-1">{artisan.name}</h3>
              <p className="text-[#8b4513] font-medium mb-1">{artisan.craft}</p>
              <p className="text-[#6b6b6b] text-sm mb-4">{artisan.location}</p>
              <p className="text-[#6b6b6b] text-sm mb-6">{artisan.description}</p>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#2d2d2d]">{artisan.years}</div>
                  <div className="text-xs text-[#8b4513]">Years</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center">
                    <Star size={16} className="text-yellow-400 fill-current mr-1" />
                    <span className="text-lg font-bold text-[#2d2d2d]">{artisan.rating}</span>
                  </div>
                  <div className="text-xs text-[#8b4513]">Rating</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#2d2d2d]">{artisan.crafts}</div>
                  <div className="text-xs text-[#8b4513]">Crafts</div>
                </div>
              </div>
              <button className="w-full bg-transparent border border-[#8b4513] text-[#8b4513] py-2 rounded-full font-medium hover:bg-[#8b4513] hover:text-white transition-colors">
                View Profile
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
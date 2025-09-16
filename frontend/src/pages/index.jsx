import { useState, useEffect } from 'react'
import Header from '../components/Header'
import HeroSection from '../components/HeroSection'
import StatsSection from '../components/StatsSection'
import FeaturedCrafts from '../components/FeaturedCrafts'
import MeetArtisans from '../components/MeetArtisans'
import TrendingCrafts from '../components/TrendingCrafts'
import CTASection from '../components/CTASection'

export default function Home() {
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
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
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-[#faf8f5]'}`}>
      <Header darkMode={darkMode} />
      <HeroSection darkMode={darkMode} />
      <StatsSection darkMode={darkMode} />
      <FeaturedCrafts darkMode={darkMode} />
      <MeetArtisans darkMode={darkMode} />
      <TrendingCrafts darkMode={darkMode} />
      <CTASection darkMode={darkMode} />
    </div>
  )
}



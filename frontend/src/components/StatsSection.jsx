import { useEffect, useState } from 'react'

export default function StatsSection() {
  const [counters, setCounters] = useState([0, 0, 0, 0])
  const finalValues = [2500, 15000, 28, 95]
  const labels = ['Master Artisans', 'Unique Crafts', 'States Covered', 'Happy Customers']
  const suffixes = ['+', '+', '', '%']

  useEffect(() => {
    const duration = 2000
    const steps = 60
    const increment = finalValues.map(val => val / steps)

    let currentStep = 0
    const timer = setInterval(() => {
      if (currentStep < steps) {
        setCounters(prev => prev.map((count, i) => 
          Math.min(Math.floor(increment[i] * currentStep), finalValues[i])
        ))
        currentStep++
      } else {
        clearInterval(timer)
        setCounters(finalValues)
      }
    }, duration / steps)

    return () => clearInterval(timer)
  }, [])

  return (
    <section className="py-16 bg-[#faf8f5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {counters.map((count, index) => (
            <div key={index} className="text-center group hover:scale-110 transition-transform duration-300">
              <div className="text-4xl md:text-5xl font-bold text-[#2d2d2d] mb-2 group-hover:text-[#8b4513] transition-colors duration-300">
                {count.toLocaleString()}{suffixes[index]}
              </div>
              <div className="text-[#8b4513] font-medium">
                {labels[index]}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
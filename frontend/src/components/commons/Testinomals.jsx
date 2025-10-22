"use client"

import { useState, useEffect } from "react"
import { FaChevronLeft, FaChevronRight } from "react-icons/fa"

const testimonials = [
  {
    text: "I am simply blown away by the transparency and speed here.",
    author: "Chris p.",
  },
  {
    text: "They delivered exactly what we needed!! Super fast and our followers were delivered so fast!",
    author: "Bridget L.",
  },
  {
    text: "I highly recommend, it took me a minute to place my order and I manage several accounts.",
    author: "- Thomas M.",
  },
]

const TestimonialSlider = () => {
  const [index, setIndex] = useState(0)

  const prev = () =>
    setIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length)

  const next = () =>
    setIndex((prevIndex) => (prevIndex + 1) % testimonials.length)

  // Auto-play effect
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
    }, 5000) // 5 seconds interval

    return () => clearInterval(timer) // cleanup on unmount
  }, [])

  return (
    <div className="bg-gray-50 py-10 flex justify-center items-center px-4">
      <div className="relative w-full max-w-2xl px-2 py-5 overflow-hidden">
        {/* Slider Container */}
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {testimonials.map((t, i) => (
            <div key={i} className="w-[98%] flex-shrink-0 bg-white rounded-2xl shadow-md p-8 mx-2">
              <p className="text-lg text-gray-800 text-center">
                
                {t.text.includes("blown away") ? (
                  <>
                    {t.text.split("blown away")[0]}
                    <span className="text-orange-500 font-medium">blown away</span>
                    {t.text.split("blown away")[1]}
                  </>
                ) : (
                  t.text
                )}
                
              </p>
              <p className="text-center mt-4 text-sm text-gray-500">— {t.author}</p>
            </div>
          ))}
        </div>

        {/* Controls */}
        <button
          onClick={prev}
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow hover:bg-gray-100"
        >
          <FaChevronLeft className="text-gray-600" />
        </button>
        <button
          onClick={next}
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow hover:bg-gray-100"
        >
          <FaChevronRight className="text-gray-600" />
        </button>
      </div>
    </div>
  )
}

export default TestimonialSlider

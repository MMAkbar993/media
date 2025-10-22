import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"

const clientReviews = [
  {
    id: 1,
    name: "Sarah Johnson",
    username: "@sarahjohnson",
    service: "Instagram Followers",
    rating: 5,
    review:
      "Incredible results! My follower count grew by 10K in just 2 weeks. The quality is amazing and engagement is through the roof!",
    image:
      "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400",
    badge: "VERIFIED BUYER",
    platform: "instagram",
  },
  {
    id: 2,
    name: "Mike Chen",
    username: "@mikechenofficial",
    service: "TikTok Views",
    rating: 5,
    review:
      "My videos went viral after using hypeis.us! Got over 1M views on my latest post. Customer service is top-notch too.",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop&crop=face",
    badge: "TOP REVIEWER",
    platform: "tiktok",
  },
  {
    id: 3,
    name: "Emma Rodriguez",
    username: "@emmarod_fitness",
    service: "Instagram Likes",
    rating: 5,
    review:
      "Perfect for my fitness brand! The likes look completely natural and helped boost my organic reach significantly.",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=300&fit=crop&crop=face",
    badge: "INFLUENCER",
    platform: "instagram",
  },
  {
    id: 4,
    name: "David Park",
    username: "@davidparkmusic",
    service: "TikTok Followers",
    rating: 5,
    review:
      "As a musician, growing my TikTok was crucial. hypeis.us delivered exactly what they promised - real, engaged followers!",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=300&fit=crop&crop=face",
    badge: "ARTIST",
    platform: "tiktok",
  },
  {
    id: 5,
    name: "Lisa Thompson",
    username: "@lisathompsonbiz",
    service: "Instagram Comments",
    rating: 5,
    review:
      "The comments feature is a game-changer! My posts now have meaningful conversations that drive real business results.",
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=300&fit=crop&crop=face",
    badge: "BUSINESS OWNER",
    platform: "instagram",
  },
]

const ClientReviewSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [itemsPerView, setItemsPerView] = useState(3)
  const [touchStartX, setTouchStartX] = useState(null)

  // Responsive items per view
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      if (width < 768) setItemsPerView(1)
      else if (width < 1024) setItemsPerView(2)
      else setItemsPerView(3)
    }
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const maxIndex = clientReviews.length - itemsPerView

  // Auto play
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1))
    }, 4000)
    return () => clearInterval(interval)
  }, [itemsPerView, maxIndex])

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1))
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? maxIndex : prev - 1))
  }

  // Swipe handlers
  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX)
  }

  const handleTouchEnd = (e) => {
    if (touchStartX === null) return
    const touchEndX = e.changedTouches[0].clientX
    const diff = touchStartX - touchEndX

    if (diff > 50) nextSlide() // left swipe
    if (diff < -50) prevSlide() // right swipe

    setTouchStartX(null)
  }

  const getBadgeColor = (badge) => {
    switch (badge) {
      case "VERIFIED BUYER":
        return "bg-green-500"
      case "TOP REVIEWER":
        return "bg-blue-500"
      case "INFLUENCER":
        return "bg-purple-500"
      case "ARTIST":
        return "bg-red-500"
      default:
        return "bg-orange-500"
    }
  }

  return (
    <div className="py-8 md:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 md:mb-8 gap-4">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 uppercase tracking-wide">
            CLIENT SUCCESS STORIES
          </h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={prevSlide}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              aria-label="Previous"
            >
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            </button>
            <button
              onClick={nextSlide}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              aria-label="Next"
            >
              <ChevronRight className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Slider */}
        <div
          className="overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{
              transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
            }}
          >
            {clientReviews.map((review) => (
              <div
                key={review.id}
                className="flex-shrink-0 px-2 sm:px-3"
                style={{ width: `${100 / itemsPerView}%` }}
              >
                <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 h-full">
                  {/* Image */}
                  <div className="relative h-40 sm:h-48 overflow-hidden">
                    <img
                      src={review.image}
                      alt={review.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 sm:top-3 left-2 sm:left-3">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full text-white ${getBadgeColor(
                          review.badge
                        )}`}
                      >
                        {review.badge}
                      </span>
                    </div>
                    <div className="absolute bottom-2 sm:bottom-3 right-2 sm:right-3">
                      <div
                        className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center ${
                          review.platform === "instagram"
                            ? "bg-gradient-to-r from-purple-500 to-pink-500"
                            : "bg-black"
                        }`}
                      >
                        <span className="text-white text-xs font-bold">
                          {review.platform === "instagram" ? "IG" : "TT"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-3 sm:p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center mb-2 gap-1 sm:gap-2">
                      <div className="flex text-yellow-400">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star
                            key={i}
                            className="w-3 h-3 sm:w-4 sm:h-4 fill-current"
                          />
                        ))}
                      </div>
                      <span className="text-xs sm:text-sm text-gray-600">
                        {review.service}
                      </span>
                    </div>

                    <p className="text-gray-800 text-xs sm:text-sm mb-3 leading-relaxed">
                      "{review.review}"
                    </p>

                    <div>
                      <h4 className="font-semibold text-gray-900 text-sm">
                        {review.name}
                      </h4>
                      <p className="text-gray-500 text-xs">{review.username}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dots */}
        <div className="flex justify-center mt-4 md:mt-6 space-x-2">
          {Array.from({ length: maxIndex + 1 }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex ? "bg-blue-500" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default ClientReviewSlider

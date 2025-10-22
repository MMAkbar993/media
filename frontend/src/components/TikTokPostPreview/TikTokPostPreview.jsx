"use client"

import { useState, useEffect } from "react"

const TikTokPostPreview = ({ targetUrl, serviceType, quantity, onClose }) => {
  const [currentStats, setCurrentStats] = useState({
    followers: 2840,
    likes: 156,
    views: 8920,
    shares: 23,
  })

  const [projectedStats, setProjectedStats] = useState({})

  useEffect(() => {
    const projected = { ...currentStats }

    switch (serviceType) {
      case "followers":
        projected.followers += quantity
        break
      case "likes":
        projected.likes += quantity
        break
      case "views":
        projected.views += quantity
        break
    }

    setProjectedStats(projected)
  }, [serviceType, quantity, currentStats])

  const getUsername = (url) => {
    try {
      const match = url.match(/tiktok\.com\/@([^/?]+)/)
      return match ? match[1] : "username"
    } catch {
      return "username"
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Preview Your TikTok Growth</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">
              ×
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Before */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Stats</h3>
              <div className="bg-black rounded-lg overflow-hidden shadow-lg">
                {/* TikTok Video Container */}
                <div className="aspect-[9/16] bg-gradient-to-br from-purple-600 to-pink-600 relative">
                  {/* Video Content */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-white text-8xl">🎵</div>
                  </div>

                  {/* TikTok UI Elements */}
                  <div className="absolute top-4 left-4 flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold">
                      {getUsername(targetUrl)[0]?.toUpperCase() || "U"}
                    </div>
                    <div className="ml-3 text-white">
                      <div className="font-semibold">@{getUsername(targetUrl)}</div>
                      <div className="text-sm opacity-80">Original sound</div>
                    </div>
                  </div>

                  {/* Right Side Actions */}
                  <div className="absolute right-4 bottom-20 flex flex-col items-center space-y-6">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-white text-xl">
                        ❤️
                      </div>
                      <div className="text-white text-xs mt-1 font-semibold">{currentStats.likes.toLocaleString()}</div>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-white text-xl">
                        💬
                      </div>
                      <div className="text-white text-xs mt-1 font-semibold">{Math.floor(currentStats.likes / 10)}</div>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-white text-xl">
                        📤
                      </div>
                      <div className="text-white text-xs mt-1 font-semibold">{currentStats.shares}</div>
                    </div>
                  </div>

                  {/* Bottom Stats */}
                  <div className="absolute bottom-4 left-4 text-white">
                    <div className="text-sm opacity-80">
                      {currentStats.views.toLocaleString()} views • {currentStats.followers.toLocaleString()} followers
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* After */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">After Our Service</h3>
              <div className="bg-black rounded-lg overflow-hidden shadow-lg">
                {/* TikTok Video Container */}
                <div className="aspect-[9/16] bg-gradient-to-br from-purple-600 to-pink-600 relative">
                  {/* Video Content */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-white text-8xl">🎵</div>
                  </div>

                  {/* Growth Indicator */}
                  <div className="absolute top-4 right-4 bg-green-500 text-white text-xs px-3 py-1 rounded-full font-semibold">
                    +{quantity.toLocaleString()} {serviceType}
                  </div>

                  {/* TikTok UI Elements */}
                  <div className="absolute top-4 left-4 flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold">
                      {getUsername(targetUrl)[0]?.toUpperCase() || "U"}
                    </div>
                    <div className="ml-3 text-white">
                      <div className="font-semibold">@{getUsername(targetUrl)}</div>
                      <div className="text-sm opacity-80">Original sound</div>
                    </div>
                  </div>

                  {/* Right Side Actions - Enhanced */}
                  <div className="absolute right-4 bottom-20 flex flex-col items-center space-y-6">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-white text-xl">
                        ❤️
                      </div>
                      <div
                        className={`text-white text-xs mt-1 font-semibold ${serviceType === "likes" ? "text-green-300" : ""}`}
                      >
                        {projectedStats.likes?.toLocaleString()}
                        {serviceType === "likes" && <span className="ml-1">↗️</span>}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-white text-xl">
                        💬
                      </div>
                      <div className="text-white text-xs mt-1 font-semibold">
                        {Math.floor(projectedStats.likes / 10)}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-white text-xl">
                        📤
                      </div>
                      <div className="text-white text-xs mt-1 font-semibold">{projectedStats.shares}</div>
                    </div>
                  </div>

                  {/* Bottom Stats - Enhanced */}
                  <div className="absolute bottom-4 left-4 text-white">
                    <div className="text-sm opacity-80">
                      <span className={serviceType === "views" ? "text-green-300 font-semibold" : ""}>
                        {projectedStats.views?.toLocaleString()} views
                        {serviceType === "views" && <span className="ml-1">↗️</span>}
                      </span>
                      {" • "}
                      <span className={serviceType === "followers" ? "text-green-300 font-semibold" : ""}>
                        {projectedStats.followers?.toLocaleString()} followers
                        {serviceType === "followers" && <span className="ml-1">↗️</span>}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Growth Summary */}
          <div className="mt-8 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Expected TikTok Growth</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-pink-600">+{quantity.toLocaleString()}</div>
                <div className="text-sm text-gray-600 capitalize">{serviceType}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">1-24hrs</div>
                <div className="text-sm text-gray-600">Delivery Time</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">100%</div>
                <div className="text-sm text-gray-600">Real Users</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">24/7</div>
                <div className="text-sm text-gray-600">Support</div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              Close Preview
            </button>
            <button
              onClick={() => {
                onClose()
                // This would trigger the checkout process
              }}
              className="flex-1 bg-gradient-to-r from-pink-500 to-red-500 text-white py-3 px-6 rounded-lg font-semibold hover:from-pink-600 hover:to-red-600 transition-all duration-200 shadow-lg"
            >
              Looks Great - Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TikTokPostPreview

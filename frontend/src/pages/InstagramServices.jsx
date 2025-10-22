"use client"

import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import InstagramProfileFetcher from "../components/InstagramProfileFetcher/InstagramProfileFetcher"
import InstagramPostPreview from "../components/InstagramPostPreview/InstagramPostPreview"
import apiService from "../services/api"

const InstagramServices = () => {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedProfile, setSelectedProfile] = useState(null)
  const [selectedService, setSelectedService] = useState("")
  const [selectedPosts, setSelectedPosts] = useState([])
  const [quantity, setQuantity] = useState(100)
  const [quality, setQuality] = useState("high")
  const [showPreview, setShowPreview] = useState(false)
  const [loading, setLoading] = useState(false)

  const services = [
    {
      id: "followers",
      name: "Instagram Followers",
      icon: "👥",
      description: "Get real Instagram followers",
      basePrice: 0.01,
      requiresPosts: false,
    },
    {
      id: "likes",
      name: "Instagram Likes",
      icon: "❤️",
      description: "Get likes on your posts",
      basePrice: 0.005,
      requiresPosts: true,
    },
    {
      id: "views",
      name: "Instagram Views",
      icon: "👁️",
      description: "Get views on your posts/reels",
      basePrice: 0.003,
      requiresPosts: true,
    },
    {
      id: "comments",
      name: "Instagram Comments",
      icon: "💬",
      description: "Get comments on your posts",
      basePrice: 0.02,
      requiresPosts: true,
    },
  ]

  const qualityOptions = [
    { id: "standard", name: "Standard Quality", multiplier: 1, description: "Good quality profiles" },
    { id: "high", name: "High Quality", multiplier: 1.5, description: "Premium profiles with profile pictures" },
    { id: "premium", name: "Premium Quality", multiplier: 2, description: "Top-tier profiles with full activity" },
  ]

  const handleProfileSelect = (profile) => {
    setSelectedProfile(profile)
    setCurrentStep(2)
  }

  const handleServiceSelect = (serviceId) => {
    setSelectedService(serviceId)
    const service = services.find((s) => s.id === serviceId)

    if (service.requiresPosts) {
      setCurrentStep(3)
    } else {
      setCurrentStep(4)
    }
  }

  const handlePostSelect = (posts) => {
    setSelectedPosts(posts)
    setCurrentStep(4)
  }

  const calculatePrice = () => {
    const service = services.find((s) => s.id === selectedService)
    if (!service) return 0

    const qualityMultiplier = qualityOptions.find((q) => q.id === quality)?.multiplier || 1
    return (service.basePrice * quantity * qualityMultiplier).toFixed(2)
  }

  const handlePreview = () => {
    setShowPreview(true)
  }

  const handleProceedToCheckout = () => {
    const orderData = {
      service: selectedService,
      profile: selectedProfile,
      posts: selectedPosts,
      quantity: quantity,
      quality: quality,
      price: calculatePrice(),
    }

    navigate("/checkout", { state: { orderData } })
  }

  const renderStepIndicator = () => {
    const steps = [
      { number: 1, title: "Select Profile", completed: currentStep > 1 },
      { number: 2, title: "Choose Service", completed: currentStep > 2 },
      {
        number: 3,
        title: "Select Posts",
        completed: currentStep > 3,
        optional: !services.find((s) => s.id === selectedService)?.requiresPosts,
      },
      { number: 4, title: "Configure Order", completed: false },
    ]

    return (
      <div className="flex items-center justify-center mb-8">
        {steps.map((step, index) => (
          <React.Fragment key={step.number}>
            <div className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                  step.completed
                    ? "bg-green-500 text-white"
                    : currentStep === step.number
                      ? "bg-pink-500 text-white"
                      : step.optional &&
                          selectedService &&
                          !services.find((s) => s.id === selectedService)?.requiresPosts
                        ? "bg-gray-200 text-gray-400"
                        : "bg-gray-200 text-gray-600"
                }`}
              >
                {step.completed ? "✓" : step.number}
              </div>
              <div className="ml-2 text-sm">
                <div className={`font-medium ${currentStep === step.number ? "text-pink-600" : "text-gray-600"}`}>
                  {step.title}
                  {step.optional &&
                    selectedService &&
                    !services.find((s) => s.id === selectedService)?.requiresPosts && (
                      <span className="text-gray-400 ml-1">(Skipped)</span>
                    )}
                </div>
              </div>
            </div>
            {index < steps.length - 1 && <div className="w-8 h-px bg-gray-300 mx-4"></div>}
          </React.Fragment>
        ))}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Instagram Growth Services</h1>
          <p className="text-gray-600">Boost your Instagram presence with real engagement</p>
        </div>

        {renderStepIndicator()}

        {/* Step 1: Profile Selection */}
        {currentStep === 1 && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Step 1: Find Your Instagram Profile</h2>
            <InstagramProfileFetcher onProfileSelect={handleProfileSelect} selectedProfile={selectedProfile} />
          </div>
        )}

        {/* Step 2: Service Selection */}
        {currentStep === 2 && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Step 2: Choose Your Service</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {services.map((service) => (
                <div
                  key={service.id}
                  onClick={() => handleServiceSelect(service.id)}
                  className={`p-6 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
                    selectedService === service.id
                      ? "border-pink-500 bg-pink-50"
                      : "border-gray-200 hover:border-pink-300"
                  }`}
                >
                  <div className="flex items-center mb-3">
                    <span className="text-2xl mr-3">{service.icon}</span>
                    <h3 className="text-lg font-semibold">{service.name}</h3>
                  </div>
                  <p className="text-gray-600 mb-3">{service.description}</p>
                  <div className="text-sm text-gray-500">Starting from ${service.basePrice}/unit</div>
                </div>
              ))}
            </div>

            {selectedProfile && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-2">Selected Profile:</h4>
                <div className="flex items-center space-x-3">
                  <img
                    src={selectedProfile.profile_pic_url || "/placeholder.svg?height=40&width=40"}
                    alt={selectedProfile.username}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <div className="font-medium">@{selectedProfile.username}</div>
                    <div className="text-sm text-gray-500">
                      {apiService.formatNumber(selectedProfile.followers_count)} followers
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Post Selection (for post-specific services) */}
        {currentStep === 3 && services.find((s) => s.id === selectedService)?.requiresPosts && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Step 3: Select Posts</h2>
            <p className="text-gray-600 mb-6">
              Choose the posts you want to boost with{" "}
              {services.find((s) => s.id === selectedService)?.name.toLowerCase()}
            </p>

            {selectedProfile?.recent_media && selectedProfile.recent_media.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {selectedProfile.recent_media.map((post, index) => (
                  <div
                    key={index}
                    onClick={() => {
                      const isSelected = selectedPosts.some((p) => p.id === post.id)
                      if (isSelected) {
                        setSelectedPosts(selectedPosts.filter((p) => p.id !== post.id))
                      } else {
                        setSelectedPosts([...selectedPosts, post])
                      }
                    }}
                    className={`aspect-square relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                      selectedPosts.some((p) => p.id === post.id)
                        ? "border-pink-500 ring-2 ring-pink-200"
                        : "border-gray-200 hover:border-pink-300"
                    }`}
                  >
                    <img
                      src={post.thumbnail_url || post.media_url || "/placeholder.svg?height=200&width=200"}
                      alt={`Post ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    {post.media_type === "VIDEO" && (
                      <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                        📹
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                      <div className="text-white text-sm opacity-0 hover:opacity-100 transition-opacity duration-200 text-center">
                        <div>❤️ {apiService.formatNumber(post.like_count)}</div>
                        <div>💬 {apiService.formatNumber(post.comments_count)}</div>
                      </div>
                    </div>
                    {selectedPosts.some((p) => p.id === post.id) && (
                      <div className="absolute top-2 left-2 bg-pink-500 text-white text-xs px-2 py-1 rounded">
                        ✓ Selected
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No posts found for this profile.</p>
              </div>
            )}

            {selectedPosts.length > 0 && (
              <div className="mt-6 flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  {selectedPosts.length} post{selectedPosts.length !== 1 ? "s" : ""} selected
                </div>
                <button
                  onClick={() => handlePostSelect(selectedPosts)}
                  className="px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
                >
                  Continue with Selected Posts
                </button>
              </div>
            )}
          </div>
        )}

        {/* Step 4: Configure Order */}
        {currentStep === 4 && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Step 4: Configure Your Order</h2>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Order Configuration */}
              <div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Number.parseInt(e.target.value))}
                    min="1"
                    max="100000"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">Minimum: 1, Maximum: 100,000</p>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Quality</label>
                  <div className="space-y-2">
                    {qualityOptions.map((option) => (
                      <label key={option.id} className="flex items-center">
                        <input
                          type="radio"
                          name="quality"
                          value={option.id}
                          checked={quality === option.id}
                          onChange={(e) => setQuality(e.target.value)}
                          className="mr-3"
                        />
                        <div>
                          <div className="font-medium">{option.name}</div>
                          <div className="text-sm text-gray-500">{option.description}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold mb-4">Order Summary</h3>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Service:</span>
                    <span className="font-medium">{services.find((s) => s.id === selectedService)?.name}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Profile:</span>
                    <span className="font-medium">@{selectedProfile?.username}</span>
                  </div>

                  {selectedPosts.length > 0 && (
                    <div className="flex justify-between">
                      <span>Posts:</span>
                      <span className="font-medium">{selectedPosts.length} selected</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Quantity:</span>
                    <span className="font-medium">{quantity.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Quality:</span>
                    <span className="font-medium">{qualityOptions.find((q) => q.id === quality)?.name}</span>
                  </div>

                  <div className="border-t pt-3 flex justify-between text-lg font-semibold">
                    <span>Total:</span>
                    <span className="text-pink-600">${calculatePrice()}</span>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <button
                    onClick={handlePreview}
                    className="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Preview Results
                  </button>
                  <button
                    onClick={handleProceedToCheckout}
                    className="w-full px-4 py-2 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-lg hover:from-pink-600 hover:to-orange-600 transition-all duration-200 font-semibold"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        {currentStep > 1 && (
          <div className="mt-6 flex justify-between">
            <button
              onClick={() => setCurrentStep(currentStep - 1)}
              className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Back
            </button>
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <InstagramPostPreview
          targetUrl={`https://instagram.com/${selectedProfile?.username}`}
          serviceType={selectedService}
          quantity={quantity}
          onClose={() => setShowPreview(false)}
        />
      )}
    </div>
  )
}

export default InstagramServices

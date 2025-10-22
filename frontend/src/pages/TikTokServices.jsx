"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import DOMPurify from "dompurify"
import Header from "../components/commons/Header"
import Footer from "../components/commons/Footer"
import TikTokPostPreview from "../components/TikTokPostPreview/TikTokPostPreview"

const TikTokServices = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("followers")
  const [formData, setFormData] = useState({
    targetUrl: "",
    quantity: 100,
    email: "",
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  const services = {
    followers: {
      title: "TikTok Followers",
      description: "Grow your TikTok audience with real, engaged followers",
      icon: "👥",
      packages: [
        { quantity: 100, price: 3.99, popular: false },
        { quantity: 250, price: 8.99, popular: false },
        { quantity: 500, price: 16.99, popular: true },
        { quantity: 1000, price: 32.99, popular: false },
        { quantity: 2500, price: 79.99, popular: false },
        { quantity: 5000, price: 159.99, popular: false },
      ],
    },
    likes: {
      title: "TikTok Likes",
      description: "Boost your TikTok videos with authentic likes",
      icon: "❤️",
      packages: [
        { quantity: 100, price: 2.99, popular: false },
        { quantity: 250, price: 6.99, popular: false },
        { quantity: 500, price: 12.99, popular: true },
        { quantity: 1000, price: 24.99, popular: false },
        { quantity: 2500, price: 59.99, popular: false },
        { quantity: 5000, price: 119.99, popular: false },
      ],
    },
    views: {
      title: "TikTok Views",
      description: "Increase your video reach with real TikTok views",
      icon: "👁️",
      packages: [
        { quantity: 1000, price: 2.99, popular: false },
        { quantity: 2500, price: 6.99, popular: false },
        { quantity: 5000, price: 12.99, popular: true },
        { quantity: 10000, price: 24.99, popular: false },
        { quantity: 25000, price: 59.99, popular: false },
        { quantity: 50000, price: 119.99, popular: false },
      ],
    },
  }

  const validateTikTokUrl = (url) => {
    const sanitizedUrl = DOMPurify.sanitize(url)
    const tiktokRegex = /^https?:\/\/(www\.)?(tiktok\.com\/@[a-zA-Z0-9._]+|vm\.tiktok\.com\/[a-zA-Z0-9]+)\/?$/
    return tiktokRegex.test(sanitizedUrl)
  }

  const validateEmail = (email) => {
    const sanitizedEmail = DOMPurify.sanitize(email)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(sanitizedEmail)
  }

  const handleInputChange = (field, value) => {
    const sanitizedValue = DOMPurify.sanitize(value)
    setFormData((prev) => ({ ...prev, [field]: sanitizedValue }))

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const handleQuantitySelect = (quantity) => {
    setFormData((prev) => ({ ...prev, quantity }))
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.targetUrl) {
      newErrors.targetUrl = "TikTok URL is required"
    } else if (!validateTikTokUrl(formData.targetUrl)) {
      newErrors.targetUrl = "Please enter a valid TikTok profile URL"
    }

    if (!formData.email) {
      newErrors.email = "Email is required"
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (!formData.quantity || formData.quantity < 1) {
      newErrors.quantity = "Please select a quantity"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handlePreview = () => {
    if (validateForm()) {
      setShowPreview(true)
    }
  }

  const handleProceedToCheckout = () => {
    if (validateForm()) {
      const selectedPackage = services[activeTab].packages.find((p) => p.quantity === formData.quantity)
      const orderData = {
        platform: "tiktok",
        serviceType: activeTab,
        targetUrl: formData.targetUrl,
        quantity: formData.quantity,
        price: selectedPackage?.price || 0,
        email: formData.email,
      }

      navigate("/checkout", { state: { orderData } })
    }
  }

  const currentService = services[activeTab]
  const selectedPackage = currentService.packages.find((p) => p.quantity === formData.quantity)

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">TikTok Growth Services</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Accelerate your TikTok growth with our premium services. Get real followers, likes, and views from active
            TikTok users.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Service Selection */}
          <div className="lg:col-span-2">
            {/* Service Tabs */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <div className="flex flex-wrap gap-2 mb-6">
                {Object.entries(services).map(([key, service]) => (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key)}
                    className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                      activeTab === key
                        ? "bg-gradient-to-r from-pink-500 to-red-500 text-white shadow-lg"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    <span className="mr-2">{service.icon}</span>
                    {service.title}
                  </button>
                ))}
              </div>

              {/* Service Info */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{currentService.title}</h2>
                <p className="text-gray-600">{currentService.description}</p>
              </div>

              {/* Package Selection */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose Your Package</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {currentService.packages.map((pkg) => (
                    <div
                      key={pkg.quantity}
                      onClick={() => handleQuantitySelect(pkg.quantity)}
                      className={`relative p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                        formData.quantity === pkg.quantity
                          ? "border-pink-500 bg-pink-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      {pkg.popular && (
                        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                          <span className="bg-gradient-to-r from-pink-500 to-red-500 text-white text-xs px-3 py-1 rounded-full">
                            Popular
                          </span>
                        </div>
                      )}
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900">{pkg.quantity.toLocaleString()}</div>
                        <div className="text-lg font-semibold text-pink-600">${pkg.price}</div>
                        <div className="text-sm text-gray-500">
                          ${((pkg.price / pkg.quantity) * 1000).toFixed(2)}/1k
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* URL Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">TikTok Profile URL *</label>
                <input
                  type="url"
                  value={formData.targetUrl}
                  onChange={(e) => handleInputChange("targetUrl", e.target.value)}
                  placeholder="https://www.tiktok.com/@yourusername"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                    errors.targetUrl ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.targetUrl && <p className="text-red-500 text-sm mt-1">{errors.targetUrl}</p>}
              </div>

              {/* Email Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="your@email.com"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handlePreview}
                  className="flex-1 bg-gray-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
                >
                  Preview Results
                </button>
                <button
                  onClick={handleProceedToCheckout}
                  className="flex-1 bg-gradient-to-r from-pink-500 to-red-500 text-white py-3 px-6 rounded-lg font-semibold hover:from-pink-600 hover:to-red-600 transition-all duration-200 shadow-lg"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h3>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Service:</span>
                  <span className="font-semibold">{currentService.title}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Quantity:</span>
                  <span className="font-semibold">{formData.quantity.toLocaleString()}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Price:</span>
                  <span className="font-semibold text-pink-600">${selectedPackage?.price || "0.00"}</span>
                </div>

                <hr className="my-4" />

                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-pink-600">${selectedPackage?.price || "0.00"}</span>
                </div>
              </div>

              {/* Features */}
              <div className="mt-6 pt-6 border-t">
                <h4 className="font-semibold text-gray-900 mb-3">What You Get:</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Real, active users
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Fast delivery
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    24/7 support
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Money-back guarantee
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Preview Modal */}
        {showPreview && (
          <TikTokPostPreview
            targetUrl={formData.targetUrl}
            serviceType={activeTab}
            quantity={formData.quantity}
            onClose={() => setShowPreview(false)}
          />
        )}
      </div>

      <Footer />
    </div>
  )
}

export default TikTokServices

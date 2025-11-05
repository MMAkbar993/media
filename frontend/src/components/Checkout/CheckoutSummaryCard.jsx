"use client"

import { User, Heart, Eye, MessageSquare, CheckCircle } from "lucide-react"
import { useNavigate } from "react-router-dom"

const CheckoutSummaryCard = ({ formData, onContinue, isContinueDisabled = false, showUpsells = false }) => {
  const navigate = useNavigate()

  const getIcon = (serviceType) => {
    switch (serviceType) {
      case "followers":
        return <User className="w-5 h-5 text-gray-500" />
      case "likes":
        return <Heart className="w-5 h-5 text-gray-500" />
      case "views":
        return <Eye className="w-5 h-5 text-gray-500" />
      case "comments":
        return <MessageSquare className="w-5 h-5 text-gray-500" />
      default:
        return null
    }
  }

  const getServiceTitle = (serviceType) => {
    switch (serviceType) {
      case "followers":
        return "Followers"
      case "likes":
        return "Likes"
      case "views":
        return "Views"
      case "comments":
        return "Comments"
      default:
        return ""
    }
  }

  const upsellOptions = [
    { label: "Add 100 Likes", price: "2.61", originalPrice: "3.49", save: "25%" },
    { label: "Add 100 Followers", price: "2.61", originalPrice: "3.49", save: "25%" },
  ]

  const features = [
    "Real likes from real people",
    "Split likes on multiple posts",
    "Video views included",
    "No Instagram password required",
    "Fast delivery, up to 10 mins",
    "24/7 support",
  ]

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg">
      {/* Profile Information */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
            {formData.profileImage ? (
              <img
                src={`/api/instagram/image-proxy?url=${encodeURIComponent(formData.profileImage)}`}
                alt={formData.username || "profile"}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none'
                  e.target.nextSibling.style.display = 'flex'
                }}
              />
            ) : null}
            <div className={`w-full h-full bg-red-500 flex items-center justify-center ${formData.profileImage ? 'hidden' : 'flex'}`}>
              <User className="w-6 h-6 text-white" />
             
            </div>
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-900">@{formData.username || "travisscott"}</p>
          </div>
        </div>
        <button onClick={() => navigate(-1)} className="text-sm text-blue-600 hover:underline focus:outline-none">
          Change
        </button>
      </div>

      {/* Package Details */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          {getIcon(formData.serviceType)}
          <div>
            <span className="text-lg font-semibold text-gray-900">
              {formData.quantity} {getServiceTitle(formData.serviceType)}
            </span>
            <p className="text-sm text-gray-500">
              {Math.floor(formData.quantity / (formData.selectedPostIds?.length || 1))} {getServiceTitle(formData.serviceType)} / {formData.selectedPostIds?.length || 0} posts
            </p>
            {formData.selectedPostIds?.length > 1 && (
              <p className={`text-xs mt-1 ${
                Math.floor(formData.quantity / formData.selectedPostIds.length) < 100 
                  ? "text-red-600 font-semibold" 
                  : "text-gray-400"
              }`}>
                {Math.floor(formData.quantity / formData.selectedPostIds.length) < 100 
                  ? "⚠️ Minimum 100 per post required"
                  : "✓ Meets minimum requirement"}
              </p>
            )}
          </div>
        </div>
        <button className="text-sm text-blue-600 hover:underline focus:outline-none">
          Change
        </button>
      </div>

      {/* Subtotal */}
      <div className="flex items-center justify-between mb-8">
        <span className="text-lg font-semibold text-gray-900">Subtotal</span>
        <div className="flex items-center">
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded mr-2">USD</span>
          <span className="text-lg font-semibold text-gray-900">${formData.price}</span>
        </div>
      </div>

      {showUpsells && (
        <>
          <div className="border-t border-gray-200 pt-6 mb-6">
            <p className="text-xl font-bold text-gray-900 mb-4">Total to pay</p>
            <p className="text-3xl font-bold text-gray-900 mb-6">${formData.price}</p>

            <div className="space-y-3 mb-6">
              {upsellOptions.map((option, index) => (
                <button
                  key={index}
                  className="w-full flex items-center justify-between bg-green-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-600 transition-colors"
                >
                  <span>{option.label}</span>
                  <span className="flex items-center space-x-2">
                    <span className="line-through opacity-75">${option.originalPrice}</span>
                    <span>${option.price}</span>
                    <span className="text-xs bg-white text-green-500 px-2 py-1 rounded-full">Save {option.save}</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                  </span>
                </button>
              ))}
            </div>

            <div className="mb-6">
              <label htmlFor="couponCode" className="block text-sm font-medium text-gray-700 mb-2">
                Add a coupon code
              </label>
              <input
                type="text"
                id="couponCode"
                name="couponCode"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter coupon code"
              />
            </div>
          </div>

          <div className="space-y-3">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center text-gray-700 text-sm">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {!showUpsells && (
        <button
          onClick={onContinue}
          disabled={isContinueDisabled}
          className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-bold text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors duration-200 ${isContinueDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          Continue to checkout
        </button>
      )}
    </div>
  )
}

export default CheckoutSummaryCard

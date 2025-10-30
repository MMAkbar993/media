"use client"

import { useState, useEffect } from "react"
import DOMPurify from "dompurify"
import { Star, Heart } from "lucide-react"
import ApiService from "../../services/api"

const EnterDetailsStep = ({ packageDetails, formData, setFormData, onNext, generalError }) => {
  const [errors, setErrors] = useState({})
  const [profile, setProfile] = useState(null)
  const testimonials = [
    {
      outlet: "US Magazine",
      quote:
        "If you're looking to buy Instagram followers, Buzzoid is one of the most popular services you'll find.",
      author: "US Magazine",
    },
    {
      outlet: "Denver 7",
      quote:
        "When you want to accomplish your social media goals, Buzzoid is the place to turn.",
      author: "Denver 7",
    },
    {
      outlet: "Deccan Herald",
      quote:
        "Among the top-rated sites to buy Instagram followers, Buzzoid is a trusted name in this niche. Their platform is an ideal way to elevate your presence on social media.",
      author: "Deccan Herald",
    },
  ]
  const [activeTestimonialIndex, setActiveTestimonialIndex] = useState(0)

  // Auto-slide testimonials
  useEffect(() => {
    const intervalId = setInterval(() => {
      setActiveTestimonialIndex((currentIndex) => (currentIndex + 1) % testimonials.length)
    }, 4000)

    return () => clearInterval(intervalId)
  }, [testimonials.length])

  useEffect(() => {
    if (packageDetails) {
      setFormData((prev) => ({
        ...prev,
        packageTitle: packageDetails.packageTitle,
        price: packageDetails.price,
        quantity: packageDetails.quantity,
        platform: packageDetails.platform,
        serviceType: packageDetails.serviceType,
        quality: packageDetails.quality,
      }))
    }
  }, [packageDetails, setFormData])

  // Fetch profile for followers since they skip SelectPostsStep
  useEffect(() => {
    const fetchProfile = async () => {
      if (formData.username && formData.username.length > 2 && formData.serviceType === "followers") {
        try {
          const cleanUsername = formData.username.replace("@", "").toLowerCase()
          const profileData = await ApiService.fetchUserProfile(cleanUsername, formData.platform)
          if (profileData) {
            setProfile(profileData)
            setFormData((prev) => ({
              ...prev,
              profileImage: profileData.profile_pic_url || "",
            }))
          }
        } catch (error) {
          console.error("Profile fetch error:", error)
        }
      }
    }

    const debounceTimer = setTimeout(fetchProfile, 600)
    return () => clearTimeout(debounceTimer)
  }, [formData.username, formData.serviceType, formData.platform, setFormData])


  const validateForm = () => {
    const newErrors = {}
    const emailRegex = /\S+@\S+\.\S+/

    if (!formData.username) {
      newErrors.username = "Username is required."
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters."
    }

    if (!formData.email) {
      newErrors.email = "Email is required."
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email format."
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      // For followers, we need to fetch the profile image since we skip SelectPostsStep
      if (formData.serviceType === "followers") {
        // This will be handled by the parent component or we can fetch it here
        // For now, we'll let the parent handle it
      }
      onNext()
    }
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    const sanitizedValue = type === "checkbox" ? checked : DOMPurify.sanitize(value)

    setFormData((prev) => ({
      ...prev,
      [name]: sanitizedValue,
    }))

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }))
  }


  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Section: Form */}
        <div className="bg-white p-8 rounded-lg shadow-lg relative">
          <div className="absolute top-4 left-4 text-gray-500 flex items-center">
            <button
              onClick={() => window.history.back()}
              className="flex items-center text-gray-500 hover:text-gray-700 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5 mr-1"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              Back
            </button>
          </div>

          <div className="flex justify-center mt-12 mb-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1">
              <span className="text-xs font-semibold text-green-800 bg-white rounded-full px-2 py-0.5 border border-green-300">226</span>
              <span className="text-sm font-medium text-green-800">live users on checkout</span>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Get started</h2>

          {generalError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
              <strong className="font-bold">Error!</strong>
              <span className="block sm:inline"> {generalError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="sr-only">
                Instagram username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5 text-gray-400"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3 border ${
                    errors.username ? "border-red-500" : "border-gray-300"
                  } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                  placeholder={
                    formData.platform === "tiktok"
                      ? "TikTok username (without @)"
                      : "Instagram username (without @)"
                  }
                  required
                />
                {errors.username && <p className="mt-2 text-sm text-red-600">{errors.username}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5 text-gray-400"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21.75 9v.906a2.25 2.25 0 01-1.183 1.981l-6.478 3.488M2.25 9v.906a2.25 2.25 0 001.183 1.981l6.478 3.488m8.66-5.606a2.25 2.25 0 110 3.982m0-3.982A2.25 2.25 0 0018.75 9H16.5m-4.5 0a2.25 2.25 0 00-2.25 2.25V15m0 0l-1.285 1.714a.75.75 0 001.071 1.05l.388-.271m-3.75 2.25V21m3-18v2.25m-3 3h.008v.008H7.5m0 2.25h.008v.008H7.5m0 2.25h.008v.008H7.5M12 10.5h.008v.008H12m2.25 4.5h.008v.008H14.25m-4.5 0h.008v.008H9.75M12 18.75h.008v.008H12m2.25-4.5h.008v.008H14.25m3 2.25h.008v.008H17.25M12 7.5h.008v.008H12m2.25-4.5h.008v.008H14.25m3 2.25h.008v.008H17.25m0 0a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5zm-15 8.25a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5zM12 12.75h.008v.008H12zm-3 3h.008v.008H9.75zm9.75-9.75h.008v.008H19.5z"
                    />
                  </svg>
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full pl-10 pr-4 py-3 border ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                  placeholder="Email address"
                  required
                />
                {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="package" className="sr-only">
                Package
              </label>
              <button
                type="button"
                role="combobox"
                aria-expanded="false"
                className="w-full border border-gray-300 rounded-md bg-white shadow-sm px-4 py-3 flex items-center justify-between"
              >
                <span className="flex items-center gap-3">
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded bg-gray-100">
                    <Heart className="w-4 h-4 text-gray-700" />
                  </span>
                  <span className="text-gray-800">
                    <strong>{packageDetails?.quantity || 0}</strong>
                    <span className="ml-1">{packageDetails?.serviceType || "likes"}</span>
                  </span>
                </span>
                <span className="flex items-center gap-2 text-gray-800">
                  <span className="font-semibold">${packageDetails?.price || 0}</span>
                  <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-400">
                    <path d="M1.73047 1.33594L6.11119 5.71666L10.4919 1.33594" stroke="currentColor" strokeWidth="2" strokeLinecap="round"></path>
                  </svg>
                </span>
              </button>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
              <p className="text-red-700 text-sm font-semibold mb-2">
                Special Offer: Buy Automatic Instagram Likes and Save 25%!
              </p>
              <p className="text-red-600 text-xs mb-3">
                Save time manually buying likes every time you post by subscribing to our Automatic Likes.
              </p>
              <button
                type="button"
                className="bg-yellow-500 text-white font-bold py-2 px-6 rounded-full hover:bg-yellow-600 transition-colors"
              >
                Save 25% now!
              </button>
            </div>

            <div className="flex items-center">
              <input
                id="sendPromotions"
                name="sendPromotions"
                type="checkbox"
                checked={formData.sendPromotions || false}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="sendPromotions" className="ml-2 block text-sm text-gray-900">
                Send me special promotions and discounts
              </label>
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-sm text-lg font-bold text-white bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              Continue
            </button>
          </form>

          <div className="text-center mt-8">
            <div className="flex justify-center items-center mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-green-500 fill-current" />
              ))}
            </div>
            <p className="text-sm text-gray-700 font-semibold">TrustScore | 12,743 reviews</p>
          </div>
        </div>

        {/* Right Section: Testimonials (3 reviews) */}
        <div className="hidden lg:flex flex-col items-center justify-center p-8">
          <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md w-full">
            <div className="flex items-center justify-center mb-4">
              <p className="text-gray-900 font-bold text-lg mr-3 uppercase">{testimonials[activeTestimonialIndex].outlet}</p>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-orange-500 fill-current" />
                ))}
              </div>
            </div>
            <p className="text-gray-700 text-lg mb-6">
              "{testimonials[activeTestimonialIndex].quote}"
            </p>
            <p className="text-gray-800 font-semibold mb-6 text-left">— {testimonials[activeTestimonialIndex].author}</p>

            {/* Dots */}
            <div className="flex items-center justify-center gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  aria-label={`Show testimonial ${index + 1}`}
                  onClick={() => setActiveTestimonialIndex(index)}
                  className={`h-2.5 w-2.5 rounded-full transition-colors ${
                    activeTestimonialIndex === index ? "bg-gray-900" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EnterDetailsStep

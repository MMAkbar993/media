"use client"

import { useState, useEffect } from "react"
import DOMPurify from "dompurify"
import { Star, User, Heart, MessageCircle, Eye, Verified, Grid3X3, Loader2, AlertCircle, RefreshCw } from "lucide-react"
import ApiService from "../../services/api"

const EnterDetailsStep = ({ packageDetails, formData, setFormData, onNext, generalError }) => {
  const [errors, setErrors] = useState({})
  const [instagramProfile, setInstagramProfile] = useState(null)
  const [instagramPosts, setInstagramPosts] = useState([])
  const [loadingProfile, setLoadingProfile] = useState(false)
  const [profileError, setProfileError] = useState(null)
  const [profileSource, setProfileSource] = useState(null)

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

  // Enhanced profile fetching with better error handling
  useEffect(() => {
    const fetchInstagramProfile = async () => {
      if (formData.username && formData.username.length > 2 && packageDetails?.platform === "Instagram") {
        setLoadingProfile(true)
        setProfileError(null)
        setProfileSource(null)

        try {
          // Clean username (remove @ if present)
          const cleanUsername = formData.username.replace("@", "").toLowerCase()
          console.log(`Attempting to fetch profile for: ${cleanUsername}`)

          // Fetch profile using enhanced API service
          const profile = await ApiService.fetchUserProfile(cleanUsername, "instagram")

          if (profile) {
            console.log("Profile fetched successfully:", profile)
            setInstagramProfile(profile)
            setInstagramPosts(profile.recent_media || [])
            setProfileSource(profile.source || "api")
          } else {
            console.log("No profile data returned")
            setProfileError("Profile not found or account is private")
            setInstagramProfile(null)
            setInstagramPosts([])
          }
        } catch (error) {
          console.error("Profile fetch error:", error)
          setProfileError(`Failed to load profile: ${error.message}`)
          setInstagramProfile(null)
          setInstagramPosts([])
        } finally {
          setLoadingProfile(false)
        }
      } else {
        setInstagramProfile(null)
        setInstagramPosts([])
        setProfileError(null)
        setProfileSource(null)
      }
    }

    const debounceTimer = setTimeout(fetchInstagramProfile, 600)
    return () => clearTimeout(debounceTimer)
  }, [formData.username, packageDetails?.platform])

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

  const handleRefreshProfile = async () => {
    if (formData.username) {
      ApiService.clearCache()
      const cleanUsername = formData.username.replace("@", "").toLowerCase()
      setLoadingProfile(true)
      setProfileError(null)

      try {
        const profile = await ApiService.fetchUserProfile(cleanUsername, "instagram")
        if (profile) {
          setInstagramProfile(profile)
          setInstagramPosts(profile.recent_media || [])
          setProfileSource(profile.source || "api")
        }
      } catch (error) {
        setProfileError("Failed to refresh profile")
      } finally {
        setLoadingProfile(false)
      }
    }
  }

  const formatNumber = (num) => {
    return ApiService.formatNumber(num)
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Section: Form */}
        <div className="lg:col-span-1 bg-white p-8 rounded-lg shadow-lg relative">
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

          <div className="text-center mt-12 mb-8">
            <p className="text-green-600 font-semibold text-sm">451 live users on checkout</p>
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
                  <User className="w-5 h-5 text-gray-400" />
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
                {loadingProfile && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <Loader2 className="animate-spin h-4 w-4 text-blue-500" />
                  </div>
                )}
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
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Heart className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="package"
                  name="package"
                  value={`${packageDetails?.quantity || 0} ${packageDetails?.serviceType || "likes"} - $${packageDetails?.price || 0}`}
                  className="mt-1 block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-700"
                  disabled
                  readOnly
                />
              </div>
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

        {/* Middle Section: Instagram Profile */}
        <div className="lg:col-span-1 bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900">Profile Preview</h3>
            {instagramProfile && (
              <button
                onClick={handleRefreshProfile}
                disabled={loadingProfile}
                className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                title="Refresh profile"
              >
                <RefreshCw className={`w-4 h-4 ${loadingProfile ? "animate-spin" : ""}`} />
              </button>
            )}
          </div>

          {loadingProfile && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="animate-spin h-8 w-8 text-purple-600" />
              <span className="ml-2 text-gray-600">Loading real profile data...</span>
            </div>
          )}

          {profileError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                <p className="text-red-800">{profileError}</p>
              </div>
              <p className="text-gray-500 text-sm mt-2">Enter a valid Instagram username to see profile preview</p>
            </div>
          )}

          {instagramProfile && !loadingProfile && (
            <div className="space-y-4">
              {/* Data source indicator */}
              {profileSource && (
                <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded flex items-center justify-between">
                  <span>Data source: {profileSource === "rapidapi" ? "Real Instagram API" : "Enhanced Data"}</span>
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      profileSource === "rapidapi" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {profileSource === "rapidapi" ? "LIVE" : "CACHED"}
                  </span>
                </div>
              )}

              {/* Profile Header */}
              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <img
                  src={instagramProfile.profile_pic_url || "/placeholder.svg?height=64&width=64"}
                  alt={`${instagramProfile.username}'s profile`}
                  className="w-16 h-16 rounded-full object-cover"
                  crossOrigin="anonymous"
                  onError={(e) => {
                    e.target.src = "/placeholder.svg?height=64&width=64"
                  }}
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-bold text-lg">@{instagramProfile.username}</h4>
                    {instagramProfile.is_verified && <Verified className="w-5 h-5 text-blue-500" />}
                    {instagramProfile.is_private && (
                      <span className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded-full">Private</span>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm">{instagramProfile.full_name}</p>
                  {instagramProfile.biography && (
                    <p className="text-gray-700 text-sm mt-1 line-clamp-2">{instagramProfile.biography}</p>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="font-bold text-lg">{formatNumber(instagramProfile.media_count)}</p>
                  <p className="text-gray-600 text-sm">Posts</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="font-bold text-lg">{formatNumber(instagramProfile.followers_count)}</p>
                  <p className="text-gray-600 text-sm">Followers</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="font-bold text-lg">{formatNumber(instagramProfile.following_count)}</p>
                  <p className="text-gray-600 text-sm">Following</p>
                </div>
              </div>

              {/* Recent Posts Grid */}
              {instagramPosts.length > 0 && (
                <div>
                  <h5 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Grid3X3 className="w-4 h-4" />
                    Recent Posts ({instagramPosts.length})
                  </h5>
                  <div className="grid grid-cols-3 gap-2">
                    {instagramPosts.slice(0, 6).map((post, index) => (
                      <div
                        key={post.id || index}
                        className="relative aspect-square bg-gray-200 rounded-lg overflow-hidden group"
                      >
                        <img
                          src={post.media_url || post.thumbnail_url || "/placeholder.svg?height=150&width=150"}
                          alt="Instagram post"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                          crossOrigin="anonymous"
                          onError={(e) => {
                            e.target.src = "/placeholder.svg?height=150&width=150"
                          }}
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 flex items-center space-x-4 text-white text-sm">
                            <div className="flex items-center space-x-1">
                              <Heart className="w-4 h-4" />
                              <span>{formatNumber(post.like_count || 0)}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <MessageCircle className="w-4 h-4" />
                              <span>{formatNumber(post.comments_count || 0)}</span>
                            </div>
                          </div>
                        </div>
                        {post.media_type === "VIDEO" && (
                          <div className="absolute top-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                            <Eye className="w-3 h-3" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {!instagramProfile && !loadingProfile && !profileError && (
            <div className="text-center py-8">
              <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Enter an Instagram username to see profile preview</p>
            </div>
          )}
        </div>

        {/* Right Section: Testimonial */}
        <div className="lg:col-span-1 hidden lg:flex flex-col items-center justify-center p-8">
          <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-sm">
            <p className="text-gray-700 text-lg italic mb-6">
              "One of the very best sites to invest in social media marketing packages is hypeis.us."
            </p>
            <div className="flex justify-center mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-red-500 fill-current" />
              ))}
            </div>
            <p className="text-gray-800 font-semibold mb-4">— ABC Action News</p>
            <img src="/images/abc-action-news.png" alt="ABC Action News Logo" className="mx-auto h-12" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default EnterDetailsStep

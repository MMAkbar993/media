"use client"

import { useState, useEffect } from "react"
import { Verified, Grid3X3, Heart, MessageCircle, Play, Loader2, RefreshCw, Calendar } from "lucide-react"
import { Instagram } from 'lucide-react'
 // Declaring Instagram variable
import ApiService from "../../services/api"

const InstagramProfile = ({ token, profile: initialProfile, onTokenExpired }) => {
  const [profile, setProfile] = useState(initialProfile)
  const [media, setMedia] = useState([])
  const [loading, setLoading] = useState(false)
  const [mediaLoading, setMediaLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (token) {
      loadUserProfile()
      loadUserMedia()
    }
  }, [token])

  const loadUserProfile = async () => {
    setLoading(true)
    setError(null)
    try {
      console.log("Loading Instagram profile...")
      const response = await ApiService.request(`/api/instagram/profile?token=${token}`)

      if (response.success) {
        setProfile(response.profile)
        console.log("Profile loaded successfully:", response.profile)
      } else {
        throw new Error(response.error || "Failed to load profile")
      }
    } catch (error) {
      console.error("Failed to load profile:", error)
      setError(error.message)

      // Check if token expired
      if (error.message.includes("token") || error.message.includes("expired")) {
        onTokenExpired?.()
      }
    } finally {
      setLoading(false)
    }
  }

  const loadUserMedia = async () => {
    setMediaLoading(true)
    try {
      console.log("Loading Instagram media...")
      const response = await ApiService.request(`/api/instagram/media?token=${token}&limit=12`)

      if (response.success) {
        setMedia(response.media.data || [])
        console.log("Media loaded successfully:", response.media.data?.length || 0, "items")
      } else {
        throw new Error(response.error || "Failed to load media")
      }
    } catch (error) {
      console.error("Failed to load media:", error)

      // Check if token expired
      if (error.message.includes("token") || error.message.includes("expired")) {
        onTokenExpired?.()
      }
    } finally {
      setMediaLoading(false)
    }
  }

  const refreshProfile = async () => {
    await loadUserProfile()
    await loadUserMedia()
  }

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M"
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K"
    }
    return num?.toString() || "0"
  }

  const formatDate = (dateString) => {
    if (!dateString) return ""
    try {
      return new Date(dateString).toLocaleDateString()
    } catch {
      return ""
    }
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to Load Profile</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={refreshProfile}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (!profile && loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
          <span className="ml-2 text-gray-600">Loading Instagram profile...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <Instagram className="h-6 w-6 mr-2 text-purple-600" />
            Instagram Profile
          </h2>
          <button
            onClick={refreshProfile}
            disabled={loading || mediaLoading}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors flex items-center space-x-2"
          >
            <RefreshCw className={`h-4 w-4 ${loading || mediaLoading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
        </div>

        {profile && (
          <>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 p-1">
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                  <span className="text-2xl font-bold text-gray-700">{profile.username?.charAt(0).toUpperCase()}</span>
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-xl font-bold">{profile.username}</h3>
                  {profile.is_verified && <Verified className="h-5 w-5 text-blue-500" />}
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      profile.account_type === "BUSINESS"
                        ? "bg-blue-100 text-blue-800"
                        : profile.account_type === "CREATOR"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {profile.account_type || "Personal"}
                  </span>
                </div>
                <div className="flex gap-6 text-sm">
                  <div className="flex items-center gap-1">
                    <Grid3X3 className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">{formatNumber(profile.media_count)}</span>
                    <span className="text-gray-600">posts</span>
                  </div>
                </div>
                {profile.fetched_at && (
                  <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                    <Calendar className="h-3 w-3" />
                    <span>Updated: {formatDate(profile.fetched_at)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* API Source Info */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-green-800">Connected via Instagram Graph API</span>
                <span className="text-xs text-green-600">• Official API</span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Recent Media */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <Grid3X3 className="h-5 w-5 text-gray-700" />
          <h3 className="text-lg font-bold text-gray-900">Recent Posts</h3>
          {media.length > 0 && <span className="text-sm text-gray-500">({media.length} items)</span>}
        </div>

        {mediaLoading ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
            <span className="ml-2 text-gray-600">Loading posts...</span>
          </div>
        ) : media.length === 0 ? (
          <div className="text-center p-8 text-gray-500">
            <Grid3X3 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No posts found or posts are private</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {media.map((item, index) => (
              <div key={item.id || index} className="relative aspect-square group cursor-pointer">
                <img
                  src={item.thumbnail_url || item.media_url || `/placeholder.svg?height=200&width=200`}
                  alt={item.caption?.substring(0, 50) || "Instagram post"}
                  className="w-full h-full object-cover rounded-lg"
                  onError={(e) => {
                    e.target.src = `/placeholder.svg?height=200&width=200&text=Instagram+Post`
                  }}
                />
                {item.media_type === "VIDEO" && (
                  <div className="absolute top-2 right-2">
                    <Play className="h-4 w-4 text-white drop-shadow-lg" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center gap-4 text-white">
                    <div className="flex items-center gap-1">
                      <Heart className="h-4 w-4" />
                      <span className="text-sm font-medium">{formatNumber(item.like_count || 0)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="h-4 w-4" />
                      <span className="text-sm font-medium">{formatNumber(item.comments_count || 0)}</span>
                    </div>
                  </div>
                </div>
                {item.timestamp && (
                  <div className="absolute bottom-1 left-1 bg-black bg-opacity-50 text-white text-xs px-1 rounded">
                    {formatDate(item.timestamp)}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default InstagramProfile

"use client"

import { useState, useEffect } from "react"
import { Link2, User, AlertCircle, CheckCircle, Eye } from "lucide-react"
import DOMPurify from "dompurify"

const ServiceSelector = ({ platform, serviceType, onUrlChange }) => {
  const [formData, setFormData] = useState({
    profileUrl: "",
    postUrl: "",
  })
  const [errors, setErrors] = useState({})
  const [validationStatus, setValidationStatus] = useState({})
  const [loading, setLoading] = useState({})

  // Sanitize input to prevent XSS
  const sanitizeInput = (input) => {
    return DOMPurify.sanitize(input.trim())
  }

  // Validate URL format
  const isValidUrl = (url) => {
    try {
      const urlObj = new URL(url)
      return urlObj.protocol === "http:" || urlObj.protocol === "https:"
    } catch {
      return false
    }
  }

  // Validate platform-specific URLs
  const validatePlatformUrl = (url, platform) => {
    if (!isValidUrl(url)) return false

    const urlObj = new URL(url)
    const hostname = urlObj.hostname.toLowerCase()

    if (platform === "instagram") {
      return hostname.includes("instagram.com")
    } else if (platform === "tiktok") {
      return hostname.includes("tiktok.com")
    }

    return false
  }

  // Extract username from URL
  const extractUsername = (url, platform) => {
    try {
      const urlObj = new URL(url)
      const pathParts = urlObj.pathname.split("/").filter((part) => part)

      if (platform === "instagram") {
        // Instagram URLs: instagram.com/username or instagram.com/p/postid
        if (pathParts.length > 0 && !pathParts[0].startsWith("p")) {
          return pathParts[0]
        }
      } else if (platform === "tiktok") {
        // TikTok URLs: tiktok.com/@username or tiktok.com/@username/video/id
        if (pathParts.length > 0 && pathParts[0].startsWith("@")) {
          return pathParts[0]
        }
      }
    } catch {
      return null
    }
    return null
  }

  // Validate URL with backend
  const validateUrl = async (url, type) => {
    if (!url || !validatePlatformUrl(url, platform)) {
      setValidationStatus((prev) => ({
        ...prev,
        [type]: { status: "error", message: `Invalid ${platform} URL` },
      }))
      return
    }

    setLoading((prev) => ({ ...prev, [type]: true }))

    try {
      // Simulate API call to validate URL
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock validation logic
      const isPost = url.includes("/p/") || url.includes("/video/")
      const isProfile = !isPost

      if (type === "postUrl" && !isPost) {
        setValidationStatus((prev) => ({
          ...prev,
          [type]: { status: "error", message: "Please provide a direct post URL" },
        }))
      } else if (type === "profileUrl" && !isProfile) {
        setValidationStatus((prev) => ({
          ...prev,
          [type]: { status: "error", message: "Please provide a profile URL" },
        }))
      } else {
        setValidationStatus((prev) => ({
          ...prev,
          [type]: { status: "success", message: "URL validated successfully" },
        }))
      }
    } catch (error) {
      setValidationStatus((prev) => ({
        ...prev,
        [type]: { status: "error", message: "Unable to validate URL" },
      }))
    } finally {
      setLoading((prev) => ({ ...prev, [type]: false }))
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    const sanitizedValue = sanitizeInput(value)

    setFormData((prev) => ({
      ...prev,
      [name]: sanitizedValue,
    }))

    // Clear previous errors and validation
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }))
    setValidationStatus((prev) => ({
      ...prev,
      [name]: {},
    }))

    // Auto-validate after user stops typing
    if (sanitizedValue) {
      const timeoutId = setTimeout(() => {
        validateUrl(sanitizedValue, name)
      }, 500)

      return () => clearTimeout(timeoutId)
    }
  }

  const handleBlur = (e) => {
    const { name, value } = e.target
    if (value && !validationStatus[name]?.status) {
      validateUrl(value, name)
    }
  }

  // Notify parent component of URL changes
  useEffect(() => {
    if (onUrlChange) {
      onUrlChange(formData.profileUrl, formData.postUrl)
    }
  }, [formData.profileUrl, formData.postUrl, onUrlChange])

  const getInputIcon = (type) => {
    if (loading[type]) {
      return <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500" />
    }

    if (validationStatus[type]?.status === "success") {
      return <CheckCircle className="w-4 h-4 text-green-500" />
    }

    if (validationStatus[type]?.status === "error") {
      return <AlertCircle className="w-4 h-4 text-red-500" />
    }

    return type === "profileUrl" ? (
      <User className="w-4 h-4 text-gray-400" />
    ) : (
      <Link2 className="w-4 h-4 text-gray-400" />
    )
  }

  const needsPostUrl = serviceType !== "followers"

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">
        {platform === "instagram" ? "Instagram" : "TikTok"} URL Details
      </h3>

      <div className="space-y-6">
        {/* Profile URL - Always required for followers, optional for others */}
        <div>
          <label htmlFor="profileUrl" className="block text-sm font-medium text-gray-700 mb-2">
            {platform === "instagram" ? "Instagram" : "TikTok"} Profile URL
            {serviceType === "followers" && <span className="text-red-500 ml-1">*</span>}
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">{getInputIcon("profileUrl")}</div>
            <input
              type="url"
              id="profileUrl"
              name="profileUrl"
              value={formData.profileUrl}
              onChange={handleInputChange}
              onBlur={handleBlur}
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors ${
                validationStatus.profileUrl?.status === "error"
                  ? "border-red-300"
                  : validationStatus.profileUrl?.status === "success"
                    ? "border-green-300"
                    : "border-gray-300"
              }`}
              placeholder={`https://${platform}.com/${platform === "tiktok" ? "@" : ""}username`}
            />
          </div>
          {validationStatus.profileUrl?.message && (
            <p
              className={`mt-1 text-sm ${
                validationStatus.profileUrl.status === "success" ? "text-green-600" : "text-red-600"
              }`}
            >
              {validationStatus.profileUrl.message}
            </p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            Enter your {platform} profile URL to {serviceType === "followers" ? "gain followers" : "verify ownership"}
          </p>
        </div>

        {/* Post URL - Required for likes, views, comments */}
        {needsPostUrl && (
          <div>
            <label htmlFor="postUrl" className="block text-sm font-medium text-gray-700 mb-2">
              {platform === "instagram" ? "Instagram Post" : "TikTok Video"} URL
              <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">{getInputIcon("postUrl")}</div>
              <input
                type="url"
                id="postUrl"
                name="postUrl"
                value={formData.postUrl}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors ${
                  validationStatus.postUrl?.status === "error"
                    ? "border-red-300"
                    : validationStatus.postUrl?.status === "success"
                      ? "border-green-300"
                      : "border-gray-300"
                }`}
                placeholder={
                  platform === "instagram"
                    ? "https://instagram.com/p/POST_ID/"
                    : "https://tiktok.com/@username/video/VIDEO_ID"
                }
              />
            </div>
            {validationStatus.postUrl?.message && (
              <p
                className={`mt-1 text-sm ${
                  validationStatus.postUrl.status === "success" ? "text-green-600" : "text-red-600"
                }`}
              >
                {validationStatus.postUrl.message}
              </p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Enter the direct URL to the {platform === "instagram" ? "post" : "video"} you want to boost
            </p>
          </div>
        )}

        {/* Help Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <Eye className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-blue-900 mb-1">How to find your URL</h4>
              <div className="text-sm text-blue-700 space-y-1">
                {platform === "instagram" ? (
                  <>
                    <p>• Profile: Go to your Instagram profile and copy the URL</p>
                    <p>• Post: Open the post, tap the three dots (•••), then "Copy Link"</p>
                  </>
                ) : (
                  <>
                    <p>• Profile: Go to your TikTok profile and copy the URL</p>
                    <p>• Video: Open the video, tap "Share", then "Copy Link"</p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start">
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-green-900 mb-1">Safe & Secure</h4>
              <p className="text-sm text-green-700">
                We only need your public URLs. We never ask for passwords or personal information.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ServiceSelector

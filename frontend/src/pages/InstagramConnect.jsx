"use client"

import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { ExternalLink, Loader2, AlertCircle, ArrowLeft, Instagram, Shield, Zap, Users } from "lucide-react"
import ApiService from "../services/api"

const InstagramConnect = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [authUrl, setAuthUrl] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const [authWindow, setAuthWindow] = useState(null)

  const returnTo = location.state?.returnTo || "/checkout"
  const username = location.state?.username || ""

  useEffect(() => {
    generateAuthUrl()
  }, [])

  const generateAuthUrl = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await ApiService.getInstagramLoginUrl()

      if (response.success) {
        setAuthUrl(response.loginUrl)
      } else {
        throw new Error(response.error || "Failed to generate authentication URL")
      }
    } catch (error) {
      console.error("Failed to generate auth URL:", error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleConnect = () => {
    if (!authUrl) {
      generateAuthUrl()
      return
    }

    setIsAuthenticating(true)
    setError(null)

    const popup = window.open(authUrl, "instagram-auth", "width=600,height=700,scrollbars=yes,resizable=yes")

    setAuthWindow(popup)

    // Check if popup is closed
    const checkClosed = setInterval(() => {
      if (popup.closed) {
        clearInterval(checkClosed)
        setIsAuthenticating(false)
        setAuthWindow(null)
      }
    }, 1000)

    // Listen for messages from popup
    const messageListener = (event) => {
      if (event.origin !== window.location.origin) return

      if (event.data.type === "INSTAGRAM_AUTH_SUCCESS") {
        const { code, state } = event.data
        handleAuthSuccess(code, state)
        popup.close()
        clearInterval(checkClosed)
        setIsAuthenticating(false)
        setAuthWindow(null)
        window.removeEventListener("message", messageListener)
      } else if (event.data.type === "INSTAGRAM_AUTH_ERROR") {
        setError(event.data.error || "Authentication failed")
        popup.close()
        clearInterval(checkClosed)
        setIsAuthenticating(false)
        setAuthWindow(null)
        window.removeEventListener("message", messageListener)
      }
    }

    window.addEventListener("message", messageListener)
  }

  const handleAuthSuccess = async (code, state) => {
    try {
      setLoading(true)
      console.log("Processing Instagram OAuth callback")

      // Exchange code for token
      const tokenResponse = await ApiService.exchangeInstagramCode(code, state)

      if (tokenResponse.success) {
        const { user, token } = tokenResponse

        // Store token and user data
        localStorage.setItem("instagram_access_token", token)
        localStorage.setItem("instagram_user_data", JSON.stringify(user))

        console.log("Instagram authentication successful")

        // Redirect back to the original page
        navigate(returnTo, {
          state: {
            instagramConnected: true,
            username: user.username,
            token: token,
          },
        })
      } else {
        throw new Error(tokenResponse.error || "Token exchange failed")
      }
    } catch (error) {
      console.error("Auth success handler error:", error)
      setError(`Authentication failed: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleSkip = () => {
    navigate(returnTo)
  }

  const handleBack = () => {
    navigate(-1)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={handleBack}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-1" />
              Back
            </button>

            <div className="flex items-center space-x-2">
              <Instagram className="h-8 w-8 text-purple-600" />
              <span className="text-xl font-bold text-gray-900">Connect Instagram</span>
            </div>

            <div className="w-16"></div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="px-8 py-12 text-center">
            <div className="flex items-center justify-center mb-8">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-full p-4">
                <Instagram className="h-12 w-12 text-white" />
              </div>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">Connect Your Instagram Account</h1>

            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              To access your Instagram profile and posts, we need you to authenticate with Instagram using their
              official API. This ensures your data is secure and up-to-date.
            </p>

            {username && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8 max-w-md mx-auto">
                <p className="text-blue-800">
                  <strong>Username:</strong> @{username}
                </p>
                <p className="text-blue-600 text-sm mt-1">Connect this account to view your posts</p>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8 max-w-md mx-auto">
                <div className="flex items-center justify-center mb-2">
                  <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                  <span className="font-semibold text-red-900">Authentication Error</span>
                </div>
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            <div className="space-y-4 mb-8">
              <button
                onClick={handleConnect}
                disabled={loading || isAuthenticating}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 inline-flex items-center space-x-3 text-lg font-semibold shadow-lg"
              >
                {loading || isAuthenticating ? (
                  <>
                    <Loader2 className="animate-spin h-6 w-6" />
                    <span>{isAuthenticating ? "Authenticating..." : "Loading..."}</span>
                  </>
                ) : (
                  <>
                    <ExternalLink className="h-6 w-6" />
                    <span>Connect with Instagram</span>
                  </>
                )}
              </button>

              <p className="text-sm text-gray-500">This will open a secure Instagram login window</p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-4">
                <div className="bg-green-100 rounded-full p-3 w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                  <Shield className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Secure & Official</h3>
                <p className="text-gray-600 text-sm">Uses Instagram's official Graph API for secure authentication</p>
              </div>

              <div className="text-center p-4">
                <div className="bg-blue-100 rounded-full p-3 w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                  <Zap className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Real-Time Data</h3>
                <p className="text-gray-600 text-sm">Access your latest posts and profile information instantly</p>
              </div>

              <div className="text-center p-4">
                <div className="bg-purple-100 rounded-full p-3 w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Privacy Protected</h3>
                <p className="text-gray-600 text-sm">We only access the data needed for your order</p>
              </div>
            </div>

            {/* Skip Option */}
            <div className="border-t pt-6">
              <p className="text-gray-600 mb-4">Don't want to connect your Instagram account right now?</p>
              <button onClick={handleSkip} className="text-gray-500 hover:text-gray-700 underline transition-colors">
                Skip for now (limited functionality)
              </button>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Why do we need Instagram authentication?</h3>
          <div className="space-y-3 text-gray-600">
            <p>
              <strong>Instagram's Policy:</strong> Instagram requires official authentication to access user profiles
              and posts, even for public accounts. This ensures user privacy and data security.
            </p>
            <p>
              <strong>What we access:</strong> Only your basic profile information (username, follower count) and your
              posts. We never access private messages or personal data.
            </p>
            <p>
              <strong>Your control:</strong> You can revoke access at any time through your Instagram settings under
              "Apps and Websites" → "Active".
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InstagramConnect

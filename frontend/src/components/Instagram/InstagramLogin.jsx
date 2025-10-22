"use client"

import { useState } from "react"
import { Instagram, ExternalLink, Loader2, Shield, CheckCircle } from "lucide-react"
import ApiService from "../../services/api"

const InstagramLogin = ({ onSuccess, onError }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [loginUrl, setLoginUrl] = useState(null)

  const handleInstagramLogin = async () => {
    setIsLoading(true)
    try {
      console.log("Initiating Instagram OAuth login...")

      // Get Instagram login URL from backend
      const response = await ApiService.request("/api/instagram/login")

      if (response.success) {
        setLoginUrl(response.loginUrl)
        console.log("Opening Instagram OAuth popup...")

        // Open Instagram OAuth in a new window
        const popup = window.open(
          response.loginUrl,
          "instagram-oauth",
          "width=600,height=700,scrollbars=yes,resizable=yes,toolbar=no,menubar=no,location=no,status=no",
        )

        if (!popup) {
          throw new Error("Popup blocked. Please allow popups for this site.")
        }

        // Check if popup is closed manually
        const checkClosed = setInterval(() => {
          if (popup.closed) {
            clearInterval(checkClosed)
            setIsLoading(false)
            setLoginUrl(null)
            console.log("Instagram OAuth popup was closed")
          }
        }, 1000)

        // Listen for messages from the popup
        const messageListener = (event) => {
          if (event.origin !== window.location.origin) return

          console.log("Received message from Instagram OAuth popup:", event.data)

          if (event.data.type === "INSTAGRAM_OAUTH_SUCCESS") {
            clearInterval(checkClosed)
            popup.close()
            setIsLoading(false)
            setLoginUrl(null)
            window.removeEventListener("message", messageListener)

            console.log("Instagram OAuth successful:", event.data.user)

            if (onSuccess) {
              onSuccess(event.data.user, event.data.token, event.data.profile)
            }
          } else if (event.data.type === "INSTAGRAM_OAUTH_ERROR") {
            clearInterval(checkClosed)
            popup.close()
            setIsLoading(false)
            setLoginUrl(null)
            window.removeEventListener("message", messageListener)

            console.error("Instagram OAuth error:", event.data.error)

            if (onError) {
              onError(event.data.error || "Authentication failed")
            }
          }
        }

        window.addEventListener("message", messageListener)

        // Cleanup listener after 5 minutes
        setTimeout(
          () => {
            window.removeEventListener("message", messageListener)
          },
          5 * 60 * 1000,
        )
      } else {
        throw new Error(response.error || "Failed to generate login URL")
      }
    } catch (error) {
      console.error("Instagram login error:", error)
      setIsLoading(false)
      setLoginUrl(null)

      if (onError) {
        onError(error.message)
      }
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto border border-gray-200">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-full">
            <Instagram className="h-8 w-8 text-white" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Connect Instagram</h2>
        <p className="text-gray-600">
          Connect your Instagram account to access your profile and media using Instagram's official API
        </p>
      </div>

      {/* Security Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-start space-x-3">
          <Shield className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-sm font-medium text-blue-900 mb-1">Official Instagram API</h3>
            <p className="text-xs text-blue-700">
              We use Instagram's official Graph API for secure authentication. Your credentials are never stored on our
              servers.
            </p>
          </div>
        </div>
      </div>

      <button
        onClick={handleInstagramLogin}
        disabled={isLoading}
        className="w-full flex items-center justify-center space-x-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Connecting...</span>
          </>
        ) : (
          <>
            <Instagram className="h-5 w-5" />
            <span>Connect with Instagram</span>
            <ExternalLink className="h-4 w-4" />
          </>
        )}
      </button>

      {loginUrl && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800 text-center">
            A popup window has opened for Instagram authentication.{" "}
            <a
              href={loginUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Click here if it didn't open automatically
            </a>
          </p>
        </div>
      )}

      {/* Permissions Info */}
      <div className="mt-6 text-xs text-gray-500">
        <div className="flex items-center justify-center mb-2">
          <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
          <span className="font-medium">What we'll access:</span>
        </div>
        <ul className="space-y-1 text-center">
          <li>• Your basic profile information (username, account type)</li>
          <li>• Your media posts (photos and videos you've shared)</li>
          <li>• Post engagement data (likes and comments count)</li>
        </ul>
        <p className="text-center mt-3 text-gray-400">
          By connecting, you agree to Instagram's Terms of Service and our Privacy Policy
        </p>
      </div>
    </div>
  )
}

export default InstagramLogin

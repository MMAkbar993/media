"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { Loader2, CheckCircle, XCircle } from "lucide-react"

const InstagramCallback = () => {
  const [searchParams] = useSearchParams()
  const [status, setStatus] = useState("processing") // processing, success, error
  const [message, setMessage] = useState("Processing Instagram authentication...")

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get("code")
        const state = searchParams.get("state")
        const error = searchParams.get("error")
        const errorDescription = searchParams.get("error_description")

        if (error) {
          setStatus("error")
          setMessage(errorDescription || "Instagram authentication was cancelled or failed")

          // Send error to parent window
          if (window.opener) {
            window.opener.postMessage(
              {
                type: "INSTAGRAM_AUTH_ERROR",
                error: errorDescription || "Authentication failed",
              },
              window.location.origin,
            )
          }
          return
        }

        if (!code) {
          setStatus("error")
          setMessage("No authorization code received from Instagram")

          if (window.opener) {
            window.opener.postMessage(
              {
                type: "INSTAGRAM_AUTH_ERROR",
                error: "No authorization code received",
              },
              window.location.origin,
            )
          }
          return
        }

        setMessage("Exchanging authorization code for access token...")

        // Send success data to parent window
        if (window.opener) {
          window.opener.postMessage(
            {
              type: "INSTAGRAM_AUTH_SUCCESS",
              code: code,
              state: state,
            },
            window.location.origin,
          )
        }

        setStatus("success")
        setMessage("Authentication successful! You can close this window.")

        // Auto-close after 2 seconds
        setTimeout(() => {
          window.close()
        }, 2000)
      } catch (error) {
        console.error("Callback processing error:", error)
        setStatus("error")
        setMessage("Failed to process Instagram authentication")

        if (window.opener) {
          window.opener.postMessage(
            {
              type: "INSTAGRAM_AUTH_ERROR",
              error: "Failed to process authentication",
            },
            window.location.origin,
          )
        }
      }
    }

    handleCallback()
  }, [searchParams])

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        <div className="mb-6">
          {status === "processing" && (
            <div className="flex items-center justify-center mb-4">
              <Loader2 className="animate-spin h-12 w-12 text-blue-600" />
            </div>
          )}

          {status === "success" && (
            <div className="flex items-center justify-center mb-4">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
          )}

          {status === "error" && (
            <div className="flex items-center justify-center mb-4">
              <XCircle className="h-12 w-12 text-red-600" />
            </div>
          )}
        </div>

        <h2 className="text-xl font-bold text-gray-900 mb-4">
          {status === "processing" && "Processing Authentication"}
          {status === "success" && "Authentication Successful"}
          {status === "error" && "Authentication Failed"}
        </h2>

        <p className="text-gray-600 mb-6">{message}</p>

        {status === "success" && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-800 text-sm">
              Your Instagram account has been successfully connected. This window will close automatically.
            </p>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 text-sm">Please try again or contact support if the problem persists.</p>
            </div>
            <button
              onClick={() => window.close()}
              className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Close Window
            </button>
          </div>
        )}

        {status === "processing" && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-800 text-sm">Please wait while we complete the authentication process...</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default InstagramCallback

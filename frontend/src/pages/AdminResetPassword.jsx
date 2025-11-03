import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import apiService from "../services/api"
import { Shield, Lock, AlertCircle, Loader, Key, ArrowLeft } from "lucide-react"

const AdminResetPassword = () => {
  const [formData, setFormData] = useState({
    resetCode: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess(false)

    // Validation
    if (!formData.resetCode || !formData.newPassword || !formData.confirmPassword) {
      setError("All fields are required")
      return
    }

    if (formData.newPassword.length < 6) {
      setError("New password must be at least 6 characters long")
      return
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setLoading(true)

    try {
      const response = await apiService.resetAdminPassword(formData.resetCode, formData.newPassword)
      if (response.success) {
        setSuccess(true)
        // Redirect to login after 2 seconds
        setTimeout(() => {
          navigate("/admin/login")
        }, 2000)
      } else {
        setError(response.error || "Failed to reset password")
      }
    } catch (error) {
      console.error("Reset password error:", error)
      setError(error.message || "Invalid reset code. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Reset Password Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-200">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
              <Key className="w-8 h-8 text-orange-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Reset Admin Password</h1>
            <p className="text-gray-600">Enter your reset code and new password</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border-2 border-green-200 rounded-xl">
              <div className="flex items-center">
                <Shield className="w-5 h-5 text-green-600 mr-2" />
                <p className="text-green-800 text-sm">
                  Password reset successfully! Redirecting to login...
                </p>
              </div>
            </div>
          )}

          {/* Reset Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Key className="w-4 h-4 inline mr-2" />
                Reset Code
              </label>
              <input
                type="text"
                value={formData.resetCode}
                onChange={(e) => setFormData({ ...formData, resetCode: e.target.value })}
                placeholder="Enter reset code"
                required
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                disabled={loading || success}
                autoFocus
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Lock className="w-4 h-4 inline mr-2" />
                New Password
              </label>
              <input
                type="password"
                value={formData.newPassword}
                onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                placeholder="Enter new password (min 6 characters)"
                required
                minLength={6}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                disabled={loading || success}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Lock className="w-4 h-4 inline mr-2" />
                Confirm New Password
              </label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                placeholder="Confirm new password"
                required
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                disabled={loading || success}
              />
            </div>

            <button
              type="submit"
              disabled={loading || success}
              className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white py-3 px-6 rounded-xl hover:from-orange-600 hover:to-pink-600 disabled:from-gray-400 disabled:to-gray-500 transition-all duration-300 font-bold text-lg transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 mr-2 animate-spin" />
                  Resetting Password...
                </>
              ) : success ? (
                <>
                  <Shield className="w-5 h-5 mr-2" />
                  Success! Redirecting...
                </>
              ) : (
                <>
                  <Key className="w-5 h-5 mr-2" />
                  Reset Password
                </>
              )}
            </button>
          </form>

          {/* Security Notice */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <div className="flex items-start">
              <Shield className="h-5 w-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-blue-900 mb-1">Reset Code Required</h4>
                <p className="text-sm text-blue-700">
                  You need the admin reset code to reset your password. This code is configured in
                  your server environment.
                </p>
              </div>
            </div>
          </div>

          {/* Back to Login Link */}
          <div className="mt-4 text-center">
            <Link
              to="/admin/login"
              className="text-sm text-orange-600 hover:text-orange-700 flex items-center justify-center"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Login
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} Admin Panel. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}

export default AdminResetPassword


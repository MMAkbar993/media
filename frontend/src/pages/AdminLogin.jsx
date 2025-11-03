import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import apiService from "../services/api"
import { Shield, Lock, AlertCircle, Loader, Key } from "lucide-react"

const AdminLogin = () => {
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await apiService.adminLogin(password)
      if (response.success && response.token) {
        // Store token in localStorage
        localStorage.setItem("adminToken", response.token)
        // Redirect to admin panel
        navigate("/admin")
      } else {
        setError(response.error || "Login failed")
      }
    } catch (error) {
      console.error("Login error:", error)
      setError(error.message || "Invalid password. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-200">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
              <Shield className="w-8 h-8 text-orange-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Login</h1>
            <p className="text-gray-600">Enter your password to access the admin panel</p>
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

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Lock className="w-4 h-4 inline mr-2" />
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                required
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                disabled={loading}
                autoFocus
              />
            </div>

            <button
              type="submit"
              disabled={loading || !password}
              className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white py-3 px-6 rounded-xl hover:from-orange-600 hover:to-pink-600 disabled:from-gray-400 disabled:to-gray-500 transition-all duration-300 font-bold text-lg transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 mr-2 animate-spin" />
                  Logging in...
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5 mr-2" />
                  Login
                </>
              )}
            </button>
          </form>

          {/* Security Notice */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <div className="flex items-start">
              <Shield className="h-5 w-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-blue-900 mb-1">Secure Access</h4>
                <p className="text-sm text-blue-700">
                  This is a restricted area. Only authorized administrators should access this panel.
                </p>
              </div>
            </div>
          </div>

          {/* Forgot Password Link */}
          <div className="mt-4 text-center">
            <Link
              to="/admin/reset-password"
              className="text-sm text-orange-600 hover:text-orange-700 flex items-center justify-center"
            >
              <Key className="w-4 h-4 mr-1" />
              Forgot Password? Reset here
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

export default AdminLogin


"use client"

import { useEffect, useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [user, setUser] = useState(null)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const isActive = (path) => {
    return location.pathname === path
  }

  useEffect(() => {
    try {
      const stored = localStorage.getItem("user")
      setUser(stored ? JSON.parse(stored) : null)
    } catch (e) {
      setUser(null)
    }
  }, [location.pathname])

  const handleLogout = () => {
    localStorage.removeItem("user")
    setUser(null)
    setShowProfileMenu(false)
    navigate("/")
  }

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="header-logo text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              hypeis.us{/* Matches text in screenshot */}
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <div className="relative group">
              <Link to="/instagram" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                <button className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">Instagram</button>                  </Link>

              {/* <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="py-1">
                  <Link to="/insta-likes" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Buy Likes
                  </Link>
                  <Link to="/insta-followers" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Buy Followers
                  </Link>
                  <Link to="/insta-views" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Buy Views
                  </Link>
                  <Link to="/insta-comments" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Buy Comments
                  </Link>
                </div>
              </div> */}
            </div>

            <div className="relative group">
              <Link to="/tiktok" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                <button className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">TikTok</button>
              </Link>


              {/* <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="py-1">
                  <Link to="/tiktok-likes" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Buy Likes
                  </Link>
                  <Link to="/tiktok-followers" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Buy Followers
                  </Link>
                  <Link to="/tiktok-views" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Buy Views
                  </Link>
                </div>
              </div> */}
            </div>
            <div className="relative group mt-3">
              <Link
                to="/track-order"
                className={`px-3 py-2 text-sm font-medium ${isActive("/track-order") ? "text-blue-600" : "text-gray-700 hover:text-blue-600"
                  }`}
              >
                Track Order
              </Link>
            </div>
          </nav>

          {/* Desktop Auth/Profile */}
          <div className="hidden md:flex items-center space-x-4">
            {!user ? (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium border border-gray-300 rounded-md hover:border-blue-600 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-blue-600 text-white px-4 py-2 text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu((v) => !v)}
                  className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md hover:border-blue-600"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 text-white flex items-center justify-center font-semibold">
                    {user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}
                  </div>
                  <span className="text-sm text-gray-700">{user.name || user.email}</span>
                </button>
                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-44 bg-white border rounded-md shadow-lg z-50">
                    <Link to="/track-order" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setShowProfileMenu(false)}>
                      Track Order
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-700 hover:text-blue-600 focus:outline-none focus:text-blue-600"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
              <div className="space-y-1">
                 <Link
                  to="/instagram"
                  className="text-gray-700 hover:text-blue-600 block px-6 py-2 text-sm"
                  onClick={() => setIsMenuOpen(false)}
                >
                <div className="text-gray-900 font-medium px-3 py-2 text-sm">Instagram</div>
                </Link>
                {/* <Link
                  to="/insta-likes"
                  className="text-gray-700 hover:text-blue-600 block px-6 py-2 text-sm"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Buy Likes
                </Link>
                <Link
                  to="/insta-followers"
                  className="text-gray-700 hover:text-blue-600 block px-6 py-2 text-sm"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Buy Followers
                </Link>
                <Link
                  to="/insta-views"
                  className="text-gray-700 hover:text-blue-600 block px-6 py-2 text-sm"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Buy Views
                </Link>
                <Link
                  to="/insta-comments"
                  className="text-gray-700 hover:text-blue-600 block px-6 py-2 text-sm"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Buy Comments
                </Link> */}
              </div>

              <div className="space-y-1">
                 <Link
                  to="/tiktok"
                  className="text-gray-700 hover:text-blue-600 block px-6 py-2 text-sm"
                  onClick={() => setIsMenuOpen(false)}
                >
                <div className="text-gray-900 font-medium px-3 py-2 text-sm">TikTok</div>
                </Link>
                {/* <Link
                  to="/tiktok-likes"
                  className="text-gray-700 hover:text-blue-600 block px-6 py-2 text-sm"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Buy Likes
                </Link>
                <Link
                  to="/tiktok-followers"
                  className="text-gray-700 hover:text-blue-600 block px-6 py-2 text-sm"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Buy Followers
                </Link>
                <Link
                  to="/tiktok-views"
                  className="text-gray-700 hover:text-blue-600 block px-6 py-2 text-sm"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Buy Views
                </Link> */}
              </div>

              <Link
                to="/track-order"
                className="text-gray-700 hover:text-blue-600 block px-3 py-2 text-sm font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Track Order
              </Link>

              {/* Mobile Auth/Profile */}
              <div className="pt-4 pb-3 border-t border-gray-200">
                {!user ? (
                  <div className="flex items-center px-3 space-x-3">
                    <Link
                      to="/login"
                      className="flex-1 text-center text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium border border-gray-300 rounded-md hover:border-blue-600 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      to="/signup"
                      className="flex-1 text-center bg-blue-600 text-white px-3 py-2 text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </div>
                ) : (
                  <div className="px-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 text-white flex items-center justify-center font-semibold">
                        {user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{user.name || user.email}</div>
                        <div className="text-xs text-gray-500">{user.email}</div>
                      </div>
                    </div>
                    <div className="mt-3 space-y-1">
                      <Link to="/track-order" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded" onClick={() => setIsMenuOpen(false)}>
                        Track Order
                      </Link>
                      <button onClick={() => { handleLogout(); setIsMenuOpen(false) }} className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded">
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header

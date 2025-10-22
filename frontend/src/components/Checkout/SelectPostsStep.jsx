"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import CheckoutSummaryCard from "./CheckoutSummaryCard"
// import buzzoidLogo from "../../../public/images/buzzoid-logo.svg"
import ApiService from "../../services/api"

const SelectPostsStep = ({ formData, setFormData, onNext, onBack }) => {
  const navigate = useNavigate()
  const [selectedPosts, setSelectedPosts] = useState([])
  const [posts, setPosts] = useState([])
  const [loadingPosts, setLoadingPosts] = useState(true)
  const [postsError, setPostsError] = useState(null)
  const [profile, setProfile] = useState(null)

  // Fetch user profile
  const fetchUserProfile = async (username) => {
    try {
      const profile = await ApiService.fetchUserProfile(username)
      setProfile(profile)
    } catch (err) {
      setProfile(null)
    }
  }

  // Replace the mock function with real API call
  const fetchUserPosts = async (username, platform) => {
    setLoadingPosts(true)
    setPostsError(null)
    try {
      console.log(`Fetching real posts for ${username} on ${platform}`)

      // Use ApiService to fetch real Instagram posts
      const posts = await ApiService.fetchInstagramPosts(username, 12)

      if (posts && posts.length > 0) {
        // Format posts for our component
        // const formattedPosts = posts.map((post) => ({
          
        //   id: post.id,
        //   imageUrl: post.image_versions?.items?.[0]?.url || "/placeholder.svg",
        //   url: post.permalink || `https://instagram.com/p/${post.code}/`,
        //   media_type: post.media_type,
        //   like_count: post.like_count,
        //   comments_count: post.comments_count,
        // }))

        const formattedPosts = posts.map((post) => {
          console.log("Post image URL:", post.imageUrl);
          return {
            id: post.id,
            imageUrl: post.imageUrl || "/placeholder.svg",
            url: post.url || "/placeholder.svg",
            media_type: post.media_type,
            like_count: post.like_count,
            comments_count: post.comments_count,
          };
        });
        
        setPosts(formattedPosts)
        console.log(`Successfully loaded ${formattedPosts.length} real posts`)
      } else {
        setPosts([])
        setPostsError("No posts found or account is private")
      }
    } catch (err) {
      setPostsError(`Failed to fetch posts: ${err.message}`)
      console.error("Real post fetch error:", err)
      setPosts([])
    } finally {
      setLoadingPosts(false)
    }
  }



  useEffect(() => {
    if (formData.username && formData.platform) {
      fetchUserPosts(formData.username, formData.platform)
      fetchUserProfile(formData.username)
    }
  }, [formData.username, formData.platform])

  const handlePostSelect = (postId) => {
    setSelectedPosts((prev) => (prev.includes(postId) ? prev.filter((id) => id !== postId) : [...prev, postId]))
  }

  const handleSubmit = () => {
    // Derive targetUrl from the first selected post if possible
    const firstSelected = selectedPosts[0]
    const post = posts.find((p) => p.id === firstSelected)
    const profileUrl = formData?.username ? `https://www.instagram.com/${formData.username}/` : ""
    const targetUrl = post?.url && post.url !== "/placeholder.svg" ? post.url : profileUrl

    setFormData((prev) => ({
      ...prev,
      selectedPostIds: selectedPosts,
      targetUrl,
    }))
    onNext()
  }

  const isContinueDisabled = selectedPosts.length === 0

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Section: Select Posts */}
        <div className="bg-white p-8 rounded-lg shadow-lg relative">
          <div className="absolute top-4 left-4 text-gray-500 flex items-center">
            <button onClick={onBack} className="flex items-center text-gray-500 hover:text-gray-700">
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
          <div className="absolute top-4 right-4">
            {/* <img src={buzzoidLogo || "/placeholder.svg"} alt="Buzzoid Logo" className="h-8" /> */}
            {/* hypeis.us */}
          </div>

          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8 mt-12">Select posts</h2>

          {/* Profile Picture and Username */}
          {profile && (
            <div className="flex flex-col items-center mb-6">
              <img
                src={profile.profile_pic_url ? `/api/instagram/image-proxy?url=${encodeURIComponent(profile.profile_pic_url)}` : "/placeholder.svg"}
                alt={profile.username}
                className="w-20 h-20 rounded-full object-cover border-2 border-gray-300"
              />
              <div className="mt-2 font-semibold text-lg">{profile.username}</div>
            </div>
          )}

          <div className="mb-6 text-center text-gray-600">
            <p>
              <span className="font-semibold">{selectedPosts.length}</span> posts selected /{" "}
              <span className="font-semibold">{formData.quantity / (posts.length || 1)}</span> {formData.serviceType}{" "}
              per post
            </p>
          </div>

          {loadingPosts ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
              <p className="ml-4 text-gray-600">Fetching posts...</p>
            </div>
          ) : postsError ? (
            <div className="text-center text-red-600 py-8">{postsError}</div>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className={`relative aspect-square bg-gray-200 rounded-lg overflow-hidden cursor-pointer ${selectedPosts.includes(post.id) ? "border-4 border-blue-500" : "border border-gray-300"
                    }`}
                  onClick={() => handlePostSelect(post.id)}
                >
                  <img
                    src={
                      post.imageUrl && post.imageUrl !== "/placeholder.svg"
                        ? `/api/instagram/image-proxy?url=${encodeURIComponent(post.imageUrl)}`
                        : "/placeholder.svg"
                    }
                    alt={`Post ${post.id}`}
                    className="w-full h-full object-cover"
                  />
                  {selectedPosts.includes(post.id) && (
                    <div className="absolute top-2 right-2 bg-blue-500 rounded-full p-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2.5}
                        stroke="currentColor"
                        className="w-4 h-4 text-white"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Advanced Options</h3>
            <div className="relative">
              <select className="w-full pl-4 pr-10 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm appearance-none bg-white">
                <option>Delivery speed</option>
                <option>Instant</option>
                <option>Gradual (24 hours)</option>
                <option>Gradual (48 hours)</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section: Summary Card */}
        <CheckoutSummaryCard formData={formData} onContinue={handleSubmit} isContinueDisabled={isContinueDisabled} />
      </div>
    </div>
  )
}

export default SelectPostsStep

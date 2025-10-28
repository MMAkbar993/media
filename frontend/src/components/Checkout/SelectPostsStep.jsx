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
      profileImage: profile?.profile_pic_url || "",
    }))
    onNext()
  }

  const isContinueDisabled = selectedPosts.length === 0

  return (
    <div className="min-h-screen bg-white">
      {/* Progress Indicator */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-center space-x-8">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-400 text-white rounded-full flex items-center justify-center text-sm font-semibold">1</div>
              <span className="ml-2 text-gray-500 font-medium">Details</span>
            </div>
            <div className="flex-1 h-0.5 bg-gray-300"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">2</div>
              <span className="ml-2 text-orange-500 font-medium">Posts</span>
            </div>
            <div className="flex-1 h-0.5 bg-gray-300"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-400 text-white rounded-full flex items-center justify-center text-sm font-semibold">3</div>
              <span className="ml-2 text-gray-500 font-medium">Checkout</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Section: Select Posts */}
        <div className="bg-white p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Select posts</h2>
            <span className="text-gray-500 font-medium">{selectedPosts.length} selected</span>
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
                  className={`relative aspect-square bg-gray-200 rounded-lg overflow-hidden cursor-pointer ${selectedPosts.includes(post.id) ? "border-4 border-orange-500" : "border border-gray-300"
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
                    <div className="absolute inset-0 bg-orange-500 bg-opacity-80 flex items-center justify-center">
                      <div className="flex items-center text-white font-bold">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          className="w-6 h-6 mr-2"
                        >
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                        </svg>
                        <span>+ {Math.floor(formData.quantity / selectedPosts.length)}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="mt-8 text-center">
            <button className="inline-flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5 mr-2"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
              Load More...
            </button>
          </div>
        </div>

        {/* Right Section: Summary Card */}
        <CheckoutSummaryCard 
          formData={formData} 
          onContinue={handleSubmit} 
          isContinueDisabled={isContinueDisabled} 
        />
      </div>
    </div>
  )
}

export default SelectPostsStep

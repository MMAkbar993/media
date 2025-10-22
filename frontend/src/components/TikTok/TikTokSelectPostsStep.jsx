import { useState, useEffect } from "react";
import { fetchTikTokUserPosts } from "../../services/tiktokApi";

const TikTokSelectPostsStep = ({ formData, setFormData, onNext, onBack }) => {
  const [selectedPosts, setSelectedPosts] = useState([]);
  const [posts, setPosts] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        // Accept both username and profile URL
        let username = formData.username;
        if (!username) {
          // Try to extract from URL if that's what the user entered
          const match = formData.targetUrl?.match(/tiktok\.com\/@([a-zA-Z0-9._]+)/);
          username = match ? match[1] : null;
        }
        if (!username) throw new Error("Please enter a valid TikTok username.");
        console.log("Fetching TikTok posts for username:", username);
        const data = await fetchTikTokUserPosts(username);
        if (data && data.data && data.data.videos && data.data.videos.length > 0) {
          setPosts(data.data.videos);
          setProfile(data.data.videos[0].author);
        } else {
          setPosts([]);
          setProfile(null);
          setError("No videos found or account is private");
        }
      } catch (err) {
        setError(err.message || "Failed to fetch TikTok posts");
        setPosts([]);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };
    if (formData.username || formData.targetUrl) fetchPosts();
  }, [formData.username, formData.targetUrl]);

  const handlePostSelect = (aweme_id) => {
    setSelectedPosts((prev) =>
      prev.includes(aweme_id) ? prev.filter((id) => id !== aweme_id) : [...prev, aweme_id]
    );
  };

  const handleSubmit = () => {
    // Build a canonical TikTok URL from the first selected video and username
    const firstSelected = selectedPosts[0];
    let username = formData.username;
    if (!username && formData.targetUrl) {
      const match = formData.targetUrl.match(/tiktok\.com\/@([a-zA-Z0-9._]+)/);
      username = match ? match[1] : null;
    }
    const builtUrl = username && firstSelected ? `https://www.tiktok.com/@${username}/video/${firstSelected}` : (formData.targetUrl || "");

    setFormData((prev) => ({
      ...prev,
      selectedPostIds: selectedPosts,
      targetUrl: builtUrl,
    }));
    onNext();
  };

  const isContinueDisabled = selectedPosts.length === 0;

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

          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8 mt-12">Select TikTok Videos</h2>

          {/* Profile Picture and Username */}
          {profile && (
            <div className="flex flex-col items-center mb-6">
              <img
                src={profile.avatar || "/placeholder.svg"}
                alt={profile.nickname || profile.unique_id}
                className="w-20 h-20 rounded-full object-cover border-2 border-gray-300"
              />
              <div className="mt-2 font-semibold text-lg">{profile.nickname || profile.unique_id}</div>
            </div>
          )}

          <div className="mb-6 text-center text-gray-600">
            <p>
              <span className="font-semibold">{selectedPosts.length}</span> videos selected
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
              <p className="ml-4 text-gray-600">Fetching videos...</p>
            </div>
          ) : error ? (
            <div className="text-center text-red-600 py-8">{error}</div>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              {posts.map((video) => (
                <div
                  key={video.aweme_id}
                  className={`relative aspect-square bg-gray-200 rounded-lg overflow-hidden cursor-pointer ${selectedPosts.includes(video.aweme_id) ? "border-4 border-pink-500" : "border border-gray-300"}`}
                  onClick={() => handlePostSelect(video.aweme_id)}
                >
                  <img
                    src={video.cover || "/placeholder.svg"}
                    alt={video.title || "TikTok video"}
                    className="w-full h-full object-cover"
                  />
                  {selectedPosts.includes(video.aweme_id) && (
                    <div className="absolute top-2 right-2 bg-pink-500 rounded-full p-1">
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
              <select className="w-full pl-4 pr-10 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm appearance-none bg-white">
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
        {/* You can reuse CheckoutSummaryCard if needed, or pass props as required */}
        {/* <CheckoutSummaryCard formData={formData} onContinue={handleSubmit} isContinueDisabled={isContinueDisabled} /> */}
        <div className="flex items-center justify-center">
          <button
            onClick={handleSubmit}
            disabled={isContinueDisabled}
            className="mt-8 px-8 py-3 bg-pink-500 text-white rounded-lg font-semibold hover:bg-pink-600 disabled:opacity-50"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default TikTokSelectPostsStep; 
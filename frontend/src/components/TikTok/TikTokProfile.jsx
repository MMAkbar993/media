import { useEffect, useState } from "react";
import { fetchTikTokUserPosts } from "../../services/tiktokApi";

const TikTokProfile = ({ username }) => {
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!username) return;
    setLoading(true);
    setError(null);
    fetchTikTokUserPosts(username)
      .then((data) => {
        if (data && data.data && data.data.videos && data.data.videos.length > 0) {
          setPosts(data.data.videos);
          // Profile info is in the first video's author
          setProfile(data.data.videos[0].author);
        } else {
          setPosts([]);
          setProfile(null);
        }
      })
      .catch((err) => {
        setError(err.message || "Failed to fetch TikTok data");
        setPosts([]);
        setProfile(null);
      })
      .finally(() => setLoading(false));
  }, [username]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <span className="text-gray-600">Loading TikTok profile...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center text-red-600">
        {error}
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-500">
        No TikTok profile or posts found.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 flex items-center gap-4">
        <img
          src={profile.avatar || "/placeholder.svg"}
          alt={profile.nickname || profile.unique_id}
          className="w-20 h-20 rounded-full object-cover border-2 border-gray-300"
        />
        <div>
          <h3 className="text-xl font-bold">{profile.nickname || profile.unique_id}</h3>
          <div className="text-gray-600 text-sm">@{profile.unique_id}</div>
        </div>
      </div>

      {/* Recent Videos */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h3 className="text-lg font-bold mb-4">Recent TikTok Videos</h3>
        {posts.length === 0 ? (
          <div className="text-center text-gray-500">No videos found.</div>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {posts.map((video) => (
              <div key={video.aweme_id} className="relative aspect-square group cursor-pointer">
                <img
                  src={video.cover || "/placeholder.svg"}
                  alt={video.title || "TikTok video"}
                  className="w-full h-full object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center text-white">
                    <span className="font-medium text-sm mb-1">{video.title}</span>
                    <span className="text-xs">{video.duration}s</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TikTokProfile; 
// TikTok API frontend service

/**
 * Fetch TikTok user posts from the backend
 * @param {string} username TikTok username (unique_id)
 * @param {number} count Number of posts to fetch
 * @param {number} cursor Pagination cursor (default 0)
 * @returns {Promise<Object>} TikTok posts data
 */
export async function fetchTikTokUserPosts(username, count = 10, cursor = 0) {
  const params = new URLSearchParams({
    username,
    count,
    cursor,
  });
  const response = await fetch(`/api/tiktok/posts?${params.toString()}`);
  if (!response.ok) {
    throw new Error('Failed to fetch TikTok posts');
  }
  return response.json();
} 
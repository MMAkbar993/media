const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
    this.cacheLimit = 1000;

    // Optional: RapidAPI headers (only if needed for direct frontend calls)
    this.rapidApiKey = import.meta.env.VITE_RAPIDAPI_KEY || "";
    this.rapidApiHost = import.meta.env.VITE_RAPIDAPI_HOST || "";

    console.log(`✅ API Service initialized: ${this.baseURL}`);
  }

  // ------------------ Core API Request ------------------
  async request(endpoint, options = {}, retries = 2) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    };

    try {
      if (import.meta.env.MODE === "development") {
        console.log(`➡️ Fetching: ${url}`, config);
      }

      const res = await fetch(url, config);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || data.error || `HTTP ${res.status}`);
      }

      return data;
    } catch (error) {
      if (retries > 0) {
        console.warn(`🔁 Retrying (${retries} left): ${url}`);
        return this.request(endpoint, options, retries - 1);
      }

      console.error(`❌ API Request Failed: ${url}`, error.message);
      throw error;
    }
  }

  // ------------------ Instagram API ------------------
  async fetchUserProfile(username) {
    const cleanUsername = this.cleanUsername(username);
    const cacheKey = `profile_${cleanUsername}`;

    if (!this.isValidInstagramUsername(cleanUsername)) {
      throw new Error("Invalid Instagram username format");
    }

    const cached = this.getCache(cacheKey);
    if (cached) return cached;

    // Updated: expects { profileImage }
    const response = await this.request(`/api/instagram/public-profile/${cleanUsername}`);
    if (response.profileImage) {
      const profile = { profile_pic_url: response.profileImage, username: cleanUsername };
      this.setCache(cacheKey, profile);
      return profile;
    }

    throw new Error(response.error || "Failed to fetch Instagram profile");
  }

  async fetchInstagramPosts(username, limit = 10) {
    const cleanUsername = this.cleanUsername(username);
    const cacheKey = `posts_${cleanUsername}`;
    const cached = this.getCache(cacheKey);
    if (cached) return cached.slice(0, limit); // truncate cache result

    // Enhanced: backend returns { profileImage, postImages, postPermalinks, posts }
    const response = await this.request(`/api/instagram/posts/${cleanUsername}`);
    let posts = [];
    if (Array.isArray(response.posts) && response.posts.length) {
      // Prefer structured posts with permalinks
      posts = response.posts
        .map((p, idx) => ({
          id: p.id?.toString() || idx.toString(),
          imageUrl: p.imageUrl,
          url: p.permalink, // used by SelectPostsStep as targetUrl
          like_count: p.like_count,
          comments_count: p.comments_count,
        }));
    } else {
      // Fallback to legacy arrays
      const images = Array.isArray(response.postImages) ? response.postImages : [];
      const links = Array.isArray(response.postPermalinks) ? response.postPermalinks : [];
      posts = images.map((img, idx) => ({
        id: idx.toString(),
        imageUrl: img,
        url: links[idx] || undefined,
      }));
    }
    this.setCache(cacheKey, posts);
    return posts.slice(0, limit);
  }


  async getProfilePosts(profile, limit = 12) {
    return profile?.username ? this.fetchInstagramPosts(profile.username, limit) : [];
  }

  async fetchInstagramAnalytics(username) {
    const cleanUsername = this.cleanUsername(username);
    const profile = await this.fetchUserProfile(cleanUsername);
    const posts = await this.fetchInstagramPosts(cleanUsername, 12);

    const followers = profile.followers_count || 0;
    const engagementRate = this.calculateEngagementRate(posts, followers);

    return {
      profile_stats: {
        followers,
        following: profile.following_count,
        posts: profile.media_count,
        engagement_rate: engagementRate,
      },
      recent_posts: posts.slice(0, 5).map((post) => ({
        id: post.id,
        likes: post.like_count,
        comments: post.comments_count,
        engagement: this.calculatePostEngagement(post, followers),
      })),
      fetched_at: new Date().toISOString(),
    };
  }

  calculateEngagementRate(posts, followers) {
    if (!posts.length || !followers) return 0;
    const total = posts.reduce((sum, post) => sum + (post.like_count || 0) + (post.comments_count || 0), 0);
    return +((total / posts.length / followers) * 100).toFixed(2);
  }

  calculatePostEngagement(post, followers) {
    if (!followers) return "0";
    const engagement = ((post.like_count + post.comments_count) / followers) * 100;
    return engagement.toFixed(2);
  }

  async checkInstagramHealth() {
    return this.request("/api/instagram/health");
  }

  async testInstagramProfile(username) {
    const cleanUsername = this.cleanUsername(username);
    return this.request(`/api/instagram/test/${cleanUsername}`);
  }

  // ------------------ Orders API ------------------
  async createOrder(orderData) {
    return this.request("/api/orders", {
      method: "POST",
      body: JSON.stringify(orderData),
    });
  }

  async getOrder(orderId) {
    return this.request(`/api/orders/${orderId}`);
  }

  async getOrderStatus(orderId) {
    return this.request(`/api/orders/${orderId}/status`);
  }

  // ------------------ Services API ------------------
  async getServices() {
    return this.request("/api/services");
  }

  async getServicesByPlatform(platform) {
    return this.request(`/api/services?platform=${platform}`);
  }

  // ------------------ Cache Utilities ------------------
  getCache(key) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      if (import.meta.env.MODE === "development") {
        console.log(`📦 Using cache for: ${key}`);
      }
      return cached.data;
    }
    return null;
  }

  setCache(key, data) {
    if (this.cache.size >= this.cacheLimit) {
      this.cache.clear();
    }
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  clearCache() {
    this.cache.clear();
    console.log("🧹 Client cache cleared");
  }

  async clearServerCache() {
    return this.request("/api/instagram/clear-cache", { method: "POST" });
  }

  async getServerCacheStats() {
    return this.request("/api/instagram/cache-stats");
  }

  getCacheStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }

  // ------------------ Utilities ------------------
  cleanUsername(username) {
    return username.replace("@", "").toLowerCase().trim();
  }

  isValidInstagramUsername(username) {
    return /^[a-zA-Z0-9._]{1,30}$/.test(this.cleanUsername(username));
  }

  extractInstagramUsername(url) {
    if (!url) return null;
    if (url.startsWith("@")) return url.slice(1);
    const match = url.match(/instagram\.com\/([a-zA-Z0-9._]+)/);
    if (match) return match[1];
    if (/^[a-zA-Z0-9._]+$/.test(url)) return url;
    return null;
  }

  formatNumber(num) {
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
    if (num >= 1_000) return (num / 1_000).toFixed(1) + "K";
    return num.toString();
  }

  // ------------------ Admin API ------------------
  async getAdminOrders(filters = {}) {
    const params = new URLSearchParams();
    if (filters.status) params.append("status", filters.status);
    if (filters.platform) params.append("platform", filters.platform);
    if (filters.serviceType) params.append("serviceType", filters.serviceType);
    if (filters.page) params.append("page", filters.page);
    if (filters.limit) params.append("limit", filters.limit);
    if (filters.search) params.append("search", filters.search);
    
    const queryString = params.toString();
    return this.request(`/api/admin/orders${queryString ? `?${queryString}` : ""}`);
  }

  async getAdminClients(filters = {}) {
    const params = new URLSearchParams();
    if (filters.page) params.append("page", filters.page);
    if (filters.limit) params.append("limit", filters.limit);
    if (filters.search) params.append("search", filters.search);
    
    const queryString = params.toString();
    return this.request(`/api/admin/clients${queryString ? `?${queryString}` : ""}`);
  }

  async getAdminClientDetails(userId) {
    return this.request(`/api/admin/clients/${userId}`);
  }

  async updateOrderStatus(orderId, statusData) {
    return this.request(`/api/admin/orders/${orderId}/status`, {
      method: "PATCH",
      body: JSON.stringify(statusData),
    });
  }

  async getAdminDashboardStats() {
    return this.request("/api/admin/dashboard/stats");
  }
}

export default new ApiService();

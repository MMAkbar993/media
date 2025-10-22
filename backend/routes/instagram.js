const express = require("express");
const axios = require("axios");
const router = express.Router();
const logger = require("../utils/logger"); // Adjust if needed

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
const RAPIDAPI_HOST = "instagram-social-api.p.rapidapi.com";

// Route: GET /posts/:username
router.get("/posts/:username", async (req, res) => {
  const { username } = req.params;
  // logger.info(`📸 Fetching Instagram posts for: ${username}`);

  try {
    const response = await axios.get(
      `https://${RAPIDAPI_HOST}/v1/posts?username_or_id_or_url=${username}`,
      {
        headers: {
          "X-RapidAPI-Key": RAPIDAPI_KEY,
          "X-RapidAPI-Host": RAPIDAPI_HOST,
        },
        timeout: 5000, // 5 seconds timeout
      }
    );

    // logger.info(`RapidAPI response for posts: ${JSON.stringify(response.data, null, 2)}`);

    // Extract posts array robustly
    let posts = [];
    let user = null;
    if (response.data?.data?.items && Array.isArray(response.data.data.items)) {
      posts = response.data.data.items;
      user = response.data.data.user;
    } else if (Array.isArray(response.data)) {
      posts = response.data;
    } else if (response.data.data && Array.isArray(response.data.data)) {
      posts = response.data.data;
    } else if (response.data.items && Array.isArray(response.data.items)) {
      posts = response.data.items;
    } else if (response.data.posts && Array.isArray(response.data.posts)) {
      posts = response.data.posts;
    }

    if (!posts || posts.length === 0) {
      logger.warn(`User not found or no posts for: ${username}`);
      return res.status(404).json({ error: "User not found or no posts available" });
    }

    // Extract post image URLs and permalinks (best-effort)
    const postImages = [];
    const postPermalinks = [];
    const structuredPosts = [];

    // Attempt to derive a username for permalinks
    const inferredUsername = (user && (user.username || user.user_name)) || username;

    for (const item of posts) {
      const imageUrl = item?.image_versions?.items?.[0]?.url || null;
      // Try common fields for permalink creation: shortcode/code
      const shortcode = item?.code || item?.shortcode || null;
      const mediaType = (item?.media_type || "").toString();
      // Default path segment for regular posts is /p/, reels sometimes /reel/
      let permalink = null;
      if (shortcode) {
        const segment = mediaType === "2" || mediaType === "VIDEO" ? "p" : "p"; // keep /p/ to be safe
        permalink = `https://www.instagram.com/${segment}/${shortcode}/`;
      }

      if (imageUrl) postImages.push(imageUrl);
      if (permalink) postPermalinks.push(permalink);

      structuredPosts.push({
        id: item?.id || shortcode || undefined,
        imageUrl: imageUrl || undefined,
        permalink: permalink || undefined,
        like_count: item?.like_count,
        comments_count: item?.comment_count || item?.comments_count,
        media_type: item?.media_type,
      });
    }

    // logger.info(`Extracted postImages URLs: ${JSON.stringify(postImages)}`);

    // Extract profile image from user or first post's caption.user
    let profileImage = null;
    if (user?.profile_pic_url) {
      profileImage = user.profile_pic_url;
    } else if (posts[0]?.caption?.user?.profile_pic_url) {
      profileImage = posts[0].caption.user.profile_pic_url;
    }

    logger.info(`Extracted profileImage: ${profileImage}`);
    logger.info(`Extracted postImages: ${JSON.stringify(postImages)}`);

    // Keep backward compatibility (postImages) and add postPermalinks + posts
    res.json({ profileImage, postImages, postPermalinks, posts: structuredPosts });
  } catch (error) {
    logger.error(`❌ Instagram API Error: ${error.message}`);

    if (error.code === "ECONNABORTED") {
      return res.status(504).json({ error: "Request timed out" });
    } else if (error.response && error.response.status === 404) {
      return res.status(404).json({ error: "User not found" });
    } else if (error.response && error.response.data && (error.response.data.error || error.response.data.status === false)) {
      return res.status(404).json({ error: error.response.data.error || "User not found" });
    }

    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route: GET /public-profile/:username
router.get("/public-profile/:username", async (req, res) => {
  const { username } = req.params;
  // logger.info(`Fetching Instagram profile for: ${username}`);
  try {
    const response = await axios.get(
      `https://${RAPIDAPI_HOST}/v1/info?username_or_id_or_url=${username}`,
      {
        headers: {
          "X-RapidAPI-Key": RAPIDAPI_KEY,
          "X-RapidAPI-Host": RAPIDAPI_HOST,
        },
        timeout: 5000,
      }
    );
    // logger.info(`RapidAPI response for profile: ${JSON.stringify(response.data, null, 2)}`);
    // Try to extract profile image robustly
    let profile = response.data?.data || response.data?.user || response.data;
    let profileImage = profile?.profile_pic_url_hd || profile?.profile_pic_url || null;
    // logger.info(`Extracted profileImage: ${profileImage}`);
    if (!profileImage) {
      logger.warn(`User not found for profile: ${username}`);
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ profileImage });
  } catch (error) {
    logger.error(`❌ Instagram Profile API Error: ${error.message}`);
    if (error.code === "ECONNABORTED") {
      return res.status(504).json({ error: "Request timed out" });
    } else if (error.response && error.response.status === 404) {
      return res.status(404).json({ error: "User not found" });
    } else if (error.response && error.response.data && (error.response.data.error || error.response.data.status === false)) {
      return res.status(404).json({ error: error.response.data.error || "User not found" });
    }
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Proxy Instagram images to bypass CORS
const https = require('https');
router.get('/image-proxy', async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).send('Missing url parameter');
  try {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    res.set('Content-Type', response.headers['content-type']);
    res.send(response.data);
  } catch (err) {
    res.status(500).send('Failed to fetch image');
  }
});

module.exports = router;

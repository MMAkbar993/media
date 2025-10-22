const express = require('express');
const router = express.Router();
const { fetchTikTokUserPosts } = require('../services/tiktokApiService');

// GET /api/tiktok/posts?username=...&count=...&cursor=...
router.get('/posts', async (req, res) => {
  const { username, count = 10, cursor = 0 } = req.query;
  if (!username) {
    return res.status(400).json({ error: 'Missing username parameter' });
  }
  try {
    const data = await fetchTikTokUserPosts(username, Number(count), Number(cursor));
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to fetch TikTok posts' });
  }
});

module.exports = router; 
const https = require('https');

// You should store your API key in an environment variable for security
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY || '8449ada219mshb1bc7b7a76025b3p1d6af0jsn7725dcf14772';
const RAPIDAPI_HOST = 'tiktok-scraper7.p.rapidapi.com';

/**
 * Fetch TikTok user posts by username
 * @param {string} uniqueId TikTok username (unique_id)
 * @param {number} count Number of posts to fetch
 * @param {number} cursor Pagination cursor (default 0)
 * @returns {Promise<Object>} TikTok posts data
 */
function fetchTikTokUserPosts(uniqueId, count = 10, cursor = 0) {
  return new Promise((resolve, reject) => {
    const options = {
      method: 'GET',
      hostname: RAPIDAPI_HOST,
      port: null,
      path: `/user/posts?unique_id=${encodeURIComponent(uniqueId)}&count=${count}&cursor=${cursor}`,
      headers: {
        'x-rapidapi-key': RAPIDAPI_KEY,
        'x-rapidapi-host': RAPIDAPI_HOST,
      },
    };

    const req = https.request(options, (res) => {
      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => {
        const body = Buffer.concat(chunks).toString();
        try {
          const data = JSON.parse(body);
          resolve(data);
        } catch (err) {
          reject(new Error('Failed to parse TikTok API response: ' + err.message));
        }
      });
    });

    req.on('error', (err) => reject(err));
    req.end();
  });
}

module.exports = {
  fetchTikTokUserPosts,
}; 
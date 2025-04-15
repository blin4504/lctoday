// api/leetcode.js
export default async function handler(req, res) {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Only POST supported' });
    }
  
    try {
      const leetcodeRes = await fetch('https://leetcode.com/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Referer': 'https://leetcode.com',
          'Origin': 'https://leetcode.com',
          'User-Agent': 'Mozilla/5.0',
        },
        body: JSON.stringify(req.body),
      });
  
      const data = await leetcodeRes.json();
      console.log(data)
      res.status(200).json(data);
    } catch (err) {
      console.error('Error fetching from LeetCode:', err);
      res.status(500).json({ error: 'Failed to fetch from LeetCode' });
    }
  }
  
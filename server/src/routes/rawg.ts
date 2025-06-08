import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();

router.get('/games', async (req, res) => {
  const { search, dates, ordering, page_size } = req.query;
  const key = process.env.RAWG_API_KEY;

  const queryParams = new URLSearchParams({
    key: key || '',
    ...(search ? { search: search.toString() } : {}),
    ...(dates ? { dates: dates.toString() } : {}),
    ...(ordering ? { ordering: ordering.toString() } : {}),
    ...(page_size ? { page_size: page_size.toString() } : {}),
  });

  try {
    const response = await fetch(`https://api.rawg.io/api/games?${queryParams}`);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error('RAWG Proxy Error:', err);
    res.status(500).json({ error: 'Failed to fetch games' });
  }
});

export default router;

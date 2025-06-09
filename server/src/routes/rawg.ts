// server/src/routes/rawgRoutes.ts
import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

router.get('/games', async (req, res) => {
  const { search = '', ordering = '-rating', page_size = '5' } = req.query;
  const rawgKey = process.env.RAWG_API_KEY;

  const url = `https://api.rawg.io/api/games?key=${rawgKey}&search=${search}&ordering=${ordering}&page_size=${page_size}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error('[RAWG] Error:', err);
    res.status(500).json({ error: 'RAWG fetch failed' });
  }
});

export default router;

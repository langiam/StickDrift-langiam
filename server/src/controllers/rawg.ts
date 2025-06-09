// server/src/controllers/rawg.ts
import { Request, Response } from 'express';
import fetch from 'node-fetch';

export async function fetchGamesFromRawg(req: Request, res: Response): Promise<void> {
  const { search, dates, ordering, page_size } = req.query;
  const key = process.env.RAWG_API_KEY;

  if (!key) {
    console.error('❌ RAWG_API_KEY not set');
    res.status(500).json({ error: 'RAWG API key missing' });
    return;
  }

  const queryParams = new URLSearchParams({
    key,
    ...(search ? { search: search.toString() } : {}),
    ...(dates ? { dates: dates.toString() } : {}),
    ...(ordering ? { ordering: ordering.toString() } : {}),
    ...(page_size ? { page_size: page_size.toString() } : {}),
  });

  try {
    const response = await fetch(`https://api.rawg.io/api/games?${queryParams}`);
    const data = await response.json();

    if (!response.ok) {
      console.error('❌ RAWG response error:', data);
      res.status(response.status).json({ error: data });
      return;
    }

    res.json(data);
  } catch (err) {
    console.error('❌ RAWG Proxy Error:', err);
    res.status(500).json({ error: 'Failed to fetch games' });
  }
}
export async function fetchGameDetailsFromRawg(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const key = process.env.RAWG_API_KEY;

  if (!key) {
    console.error('❌ RAWG_API_KEY not set');
    res.status(500).json({ error: 'RAWG API key missing' });
    return;
  }

  try {
    const response = await fetch(`https://api.rawg.io/api/games/${id}?key=${key}`);
    const data = await response.json();

    if (!response.ok) {
      console.error('❌ RAWG response error:', data);
      res.status(response.status).json({ error: data });
      return;
    }

    res.json(data);
  } catch (err) {
    console.error('❌ RAWG Proxy Error:', err);
    res.status(500).json({ error: 'Failed to fetch game details' });
  }
}
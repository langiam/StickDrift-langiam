// server/src/routes/rawg.ts
import express from 'express';
import {
  fetchGamesFromRawg,
  fetchGameDetailsFromRawg,
} from '../controllers/rawg.js'; // .js if using ESM output

const router = express.Router();

// Search for games
router.get('/games', fetchGamesFromRawg);

// Get details for a single game
router.get('/games/:id', fetchGameDetailsFromRawg);

export default router;

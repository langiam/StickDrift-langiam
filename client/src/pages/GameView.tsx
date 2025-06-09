import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/GameView.css';
import { useMutation } from '@apollo/client';
import {
  ADD_TO_LIBRARY,
  ADD_TO_WISHLIST,
  ADD_TO_PLAYLIST,
} from '../utils/mutations';

const GameView = () => {
  const { id } = useParams();
  const [game, setGame] = useState<any>(null);
  const apiKey = import.meta.env.VITE_RAWG_API_KEY;

  const [addToLibrary] = useMutation(ADD_TO_LIBRARY);
  const [addToWishlist] = useMutation(ADD_TO_WISHLIST);
  const [addToPlaylist] = useMutation(ADD_TO_PLAYLIST);

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const res = await fetch(
          `https://api.rawg.io/api/games/${id}?key=${apiKey}`
        );
        const data = await res.json();
        setGame(data);
      } catch (error) {
        console.error('Failed to fetch game:', error);
        alert('Failed to load game details.');
      }
    };
    fetchGame();
  }, [id, apiKey]);

  const buildGameInput = () => ({
    rawgId: game.id,
    name: game.name,
    released: game.released || '',
    background_image: game.background_image || '',
  });

  const handleAdd = async (action: 'library' | 'wishlist' | 'playlist') => {
    const input = buildGameInput();
    try {
      if (action === 'library') {
        await addToLibrary({ variables: { gameInput: input } });
      } else if (action === 'wishlist') {
        await addToWishlist({ variables: { gameInput: input } });
      } else if (action === 'playlist') {
        await addToPlaylist({ variables: { gameInput: input } });
      }
      alert(`Added to ${action} successfully!`);
    } catch (error) {
      console.error(`Error adding to ${action}:`, error);
      alert(`Failed to add to ${action}. Please try again.`);
    }
  };

  if (!game) return <p>Loading...</p>;

  return (
    <div className="gameview-container">
      <h1>{game.name}</h1>
      <img
        src={game.background_image || defaultImage}
        alt={game.name}
        className="game-cover"
      />

      <p>{game.description_raw}</p>
      <p>
        <strong>Platforms:</strong>{' '}
        {game.platforms?.map((p: any) => p.platform.name).join(', ')}
      </p>
      <p>
        <strong>Release Date:</strong> {game.released}
      </p>
      <div className="gameview-buttons">
        <button onClick={() => handleAdd('library')}>Add to Library</button>
        <button onClick={() => handleAdd('wishlist')}>Add to Wishlist</button>
        <button onClick={() => handleAdd('playlist')}>Add to Playlist</button>
      </div>
    </div>
  );
};

export default GameView;

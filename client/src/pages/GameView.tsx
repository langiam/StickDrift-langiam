import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/GameView.css';
import { useMutation } from '@apollo/client';
import { ADD_TO_LIBRARY, ADD_TO_WISHLIST, ADD_TO_PLAYLIST } from '../utils/mutations';

const GameView = () => {
  const { id } = useParams();
  const [game, setGame] = useState<any>(null);
  const apiKey = import.meta.env.VITE_RAWG_API_KEY;

  const [addToLibrary] = useMutation(ADD_TO_LIBRARY);
  const [addToWishlist] = useMutation(ADD_TO_WISHLIST);
  const [addToPlaylist] = useMutation(ADD_TO_PLAYLIST);

  useEffect(() => {
    const fetchGame = async () => {
      const res = await fetch(`https://api.rawg.io/api/games/${id}?key=${apiKey}`);
      const data = await res.json();
      setGame(data);
    };
    fetchGame();
  }, [id, apiKey]);

  if (!game) return <p>Loading...</p>;

  return (
    <div className="gameview-container">
      <h1>{game.name}</h1>
      <img src={game.background_image} alt={game.name} className="gameview-image" />
      <p>{game.description_raw}</p>
      <p><strong>Platforms:</strong> {game.platforms?.map((p: any) => p.platform.name).join(', ')}</p>
      <p><strong>Release Date:</strong> {game.released}</p>
      <div className="gameview-buttons">
        <button onClick={() => addToLibrary({ variables: { gameId: game.id, gameName: game.name } })}>Add to Library</button>
        <button onClick={() => addToWishlist({ variables: { gameId: game.id, gameName: game.name } })}>Add to Wishlist</button>
        <button onClick={() => addToPlaylist({ variables: { gameId: game.id, gameName: game.name } })}>Add to Playlist</button>
      </div>
    </div>
  );
};

export default GameView;
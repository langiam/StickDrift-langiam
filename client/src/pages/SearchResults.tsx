import React from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useNavigate, useLocation } from 'react-router-dom';

import {
  ADD_TO_LIBRARY,
  ADD_TO_WISHLIST,
  ADD_TO_PLAYLIST,
  REMOVE_FROM_LIBRARY,
  REMOVE_FROM_WISHLIST,
  REMOVE_FROM_PLAYLIST
} from '../utils/mutations';
import { QUERY_ME } from '../utils/queries';

import '../styles/SearchResults.css';

interface Game {
  id: number;
  name: string;
  released?: string;
  background_image?: string;
}

const SearchResults: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const results: Game[] = location.state?.results || [];

  const { data } = useQuery(QUERY_ME);
  const [addToLibrary] = useMutation(ADD_TO_LIBRARY);
  const [addToWishlist] = useMutation(ADD_TO_WISHLIST);
  const [addToPlaylist] = useMutation(ADD_TO_PLAYLIST);
  const [removeFromLibrary] = useMutation(REMOVE_FROM_LIBRARY);
  const [removeFromWishlist] = useMutation(REMOVE_FROM_WISHLIST);
  const [removeFromPlaylist] = useMutation(REMOVE_FROM_PLAYLIST);

  const me = data?.me;

  const isInList = (list: any[], rawgId: string) =>
    list?.some((g) => g.rawgId === rawgId);

  const handleAction = async (
    game: Game,
    type: 'library' | 'wishlist' | 'playlist'
  ) => {
    const input = {
      id: parseInt(game.id.toString(), 10),
      name: game.name,
      released: game.released,
      background_image: game.background_image
    };

    try {
      if (type === 'library') await addToLibrary({ variables: { gameInput: input } });
      if (type === 'wishlist') await addToWishlist({ variables: { gameInput: input } });
      if (type === 'playlist') {
        await addToLibrary({ variables: { gameInput: input } });
        await addToPlaylist({ variables: { gameInput: input } });
      }
    } catch (err) {
      console.error(`Error adding to ${type}:`, err);
    }
  };

  const handleRemove = async (
    rawgId: string,
    type: 'library' | 'wishlist' | 'playlist'
  ) => {
    try {
      if (type === 'library') await removeFromLibrary({ variables: { gameId: rawgId } });
      if (type === 'wishlist') await removeFromWishlist({ variables: { gameId: rawgId } });
      if (type === 'playlist') await removeFromPlaylist({ variables: { gameId: rawgId } });
    } catch (err) {
      console.error(`Error removing from ${type}:`, err);
    }
  };

  return (
    <main className="page-wrapper">
      <div className="searchresults-container">
        <h1 className="searchresults-title">Search Results</h1>
        {results.length === 0 ? (
          <p className="glow-text">No results found.</p>
        ) : (
          <ul className="searchresults-list">
            {results.map((game) => {
              const rawgId = game.id.toString();
              const inLibrary = isInList(me?.library, rawgId);
              const inWishlist = isInList(me?.wishlist, rawgId);
              const inPlaylist = isInList(me?.playlist, rawgId);

              return (
                <li key={`${game.id}-${game.name}`} className="searchresults-item">
                  <span
                    className="searchresults-game-title"
                    onClick={() => navigate(`/game/${game.id}`)}
                    style={{ cursor: 'pointer', textDecoration: 'underline' }}
                  >
                    {game.name}
                  </span>
                  <span className="searchresults-release">
                    {game.released || 'Unknown Release Date'}
                  </span>
                  <div className="searchresults-actions">
                    {inLibrary ? (
                      <button onClick={() => handleRemove(rawgId, 'library')}>Remove from Library</button>
                    ) : (
                      <button onClick={() => handleAction(game, 'library')}>Add to Library</button>
                    )}
                    {inWishlist ? (
                      <button onClick={() => handleRemove(rawgId, 'wishlist')}>Remove from Wishlist</button>
                    ) : (
                      <button onClick={() => handleAction(game, 'wishlist')}>Add to Wishlist</button>
                    )}
                    {inPlaylist ? (
                      <button onClick={() => handleRemove(rawgId, 'playlist')}>Remove from Playlist</button>
                    ) : (
                      <button onClick={() => handleAction(game, 'playlist')}>Add to Playlist</button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </main>
  );
};

export default SearchResults;

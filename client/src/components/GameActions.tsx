// client/src/components/GameActionButtons.tsx

import React from 'react';

interface Props {
  onAdd?: () => void;
  onRemove?: () => void;
}

const GameActionButtons: React.FC<Props> = ({ onAdd, onRemove }) => (
  <div style={{ marginTop: '0.5rem' }}>
    {onAdd && (
      <button className="action-button" onClick={onAdd} style={{ marginRight: '0.5rem' }}>
        Add to Playlist
      </button>
    )}
    {onRemove && (
      <button className="action-button" onClick={onRemove}>
        Remove
      </button>
    )}
  </div>
);

export default GameActionButtons;

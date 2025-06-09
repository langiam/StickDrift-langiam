import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Calendar.css';

interface Game {
  id: number;
  name: string;
  released: string;
  background_image?: string;
}

const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const Calendar: React.FC = () => {
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth()); // 0-11
  const [year, setYear] = useState(today.getFullYear());
  const [games, setGames] = useState<Game[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedGamesDay, setSelectedGamesDay] = useState<Game[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const apiKey = import.meta.env.VITE_RAWG_API_KEY;

  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startDay = firstDay.getDay();

  const handlePrevMonth = () => {
    setMonth((prev) => (prev === 0 ? 11 : prev - 1));
    if (month === 0) setYear((prev) => prev - 1);
  };

  const handleNextMonth = () => {
    setMonth((prev) => (prev === 11 ? 0 : prev + 1));
    if (month === 11) setYear((prev) => prev + 1);
  };

  useEffect(() => {
    const fetchMonthlyGames = async () => {
      const startDate = new Date(year, month, 1).toISOString().split('T')[0];
      const endDate = new Date(year, month + 1, 0).toISOString().split('T')[0];

      try {
        const res = await fetch(
          `https://api.rawg.io/api/games?key=${apiKey}&dates=${startDate},${endDate}&ordering=released&page_size=100`
        );
        const data = await res.json();
        setGames(data.results || []);
      } catch (err) {
        console.error('Error fetching monthly games:', err);
      }
    };

    fetchMonthlyGames();
  }, [month, year, apiKey]);

  const cells = [];

  // Add leading blanks
  for (let i = 0; i < startDay; i++) {
    cells.push(<div key={`blank-${i}`} className="cell empty" />);
  }

  // Add calendar days
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dayGames = games.filter(game => game.released?.startsWith(dateStr));
    const gamesShown = dayGames.slice(0, 2); // Show only first 2 games

    cells.push(
      <div key={`day-${day}`} className="cell"
        onClick={() => {
          if (dayGames.length > 0) {
            setSelectedGamesDay(dayGames);
            setSelectedDate(dateStr);
            setModalOpen(true);
          }
        }} style={{ cursor: dayGames.length > 0 ? 'pointer' : 'default' }}>
        <div className="cell-date">{day}</div>
        <ul className="day-game-list">
          {gamesShown.map(game => (
            <li key={game.id}>
              <Link to={`/game/${game.id}`} className="calendar-game-link"
              onClick={e => e.stopPropagation()}>
                {game.name}
              </Link>
            </li>
          ))}
          {dayGames.length > 2 && (
            <li className="see-all">+{dayGames.length - 2} more</li>
          )}
        </ul>
      </div>
    );
  }

  
  return (
    <main className="page-wrapper">
      <div className="calendar-container">
        <h1 className="calendar-title">Release Calendar</h1>

        <div className="navigation">
          <button className="nav-button" onClick={handlePrevMonth}>← Previous</button>
          <h2 className="calendar-subtitle">
            {firstDay.toLocaleString('default', { month: 'long' })} {year}
          </h2>
          <button className="nav-button" onClick={handleNextMonth}>Next →</button>
        </div>

        <div className="grid">
          {weekdays.map(day => (
            <div key={`weekday-${day}`} className="weekday header">{day}</div>
          ))}
          {cells}
          </div>
          
        {modalOpen && (
          <div className="calendar-modal-overlay" onClick={() => setModalOpen(false)}>
            <div className="calendar-modal" onClick={e => e.stopPropagation()}>
              <h3>Games for {selectedDate}</h3>
              <ul>
                {selectedGamesDay.map(game => (
                  <li key={game.id}>
                    <Link to={`/game/${game.id}`} className="calendar-game-link" onClick={() => setModalOpen(false)}>
                      {game.name}
                    </Link>
                  </li>
                ))}
              </ul>
              <button onClick={() => setModalOpen(false)}>Close</button>
            </div>
          </div>
        )}    

        <div className="calendar-games">
          <h3>Top Games This Month</h3>
          {games.length === 0 ? (
            <p>Loading...</p>
          ) : (
            <ul className="top-games-list">
              {games.slice(0, 8).map(game => (
                <li key={game.id}>
                  <Link to={`/game/${game.id}`} className="calendar-game-link">
                    {game.name} {game.released ? `(${game.released})` : ''}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </main>
  );
};

export default Calendar;

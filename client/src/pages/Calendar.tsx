import React, { useState, useEffect } from 'react';
import '../styles/Calendar.css';

interface Props {
  month: number; // optional if passed via props
  year: number;
}

const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const Calendar: React.FC<Props> = () => {
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth()); // JS month index: 0–11
  const [year, setYear] = useState(today.getFullYear());

  const [games, setGames] = useState([]);
  const apiKey = import.meta.env.VITE_RAWG_API_KEY;

  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startDay = firstDay.getDay();

  const handlePrevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear(prev => prev - 1);
    } else {
      setMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear(prev => prev + 1);
    } else {
      setMonth(prev => prev + 1);
    }
  };

  useEffect(() => {
    const fetchMonthlyGames = async () => {
      const startDate = new Date(year, month, 1).toISOString().split('T')[0];
      const endDate = new Date(year, month + 1, 0).toISOString().split('T')[0];

      try {
        const res = await fetch(
          `https://api.rawg.io/api/games?key=${apiKey}&dates=${startDate},${endDate}&ordering=-added`
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
  for (let i = 0; i < startDay; i++) {
    cells.push(<div key={`empty-${i}`} className="cell empty" />);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    cells.push(<div key={day} className="cell">{day}</div>);
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

        <div className="calendar-grid">
          {weekdays.map((day) => (
            <div key={day} className="weekday">{day}</div>
          ))}
          {cells}
        </div>

        <div className="calendar-games">
          <h3>Top Games This Month</h3>
          {games.length === 0 ? (
            <p>Loading...</p>
          ) : (
            <ul>
              {games.slice(0, 8).map((game: any) => (
                <li key={game.id}>
                  {game.name} {game.released ? `(${game.released})` : ''}
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

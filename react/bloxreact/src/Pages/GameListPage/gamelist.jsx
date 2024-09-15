import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './gamelist.css';
import { games, formatGameName } from '../../components/content'

const GameList = () => {
    const [filter, setFilter] = useState('');
    const [sortOrder, setSortOrder] = useState('A-Z');
    const location = useLocation();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const searchQuery = queryParams.get('search') || '';
        setFilter(searchQuery.toLowerCase());
    }, [location.search]);

    const handleFilterChange = (e) => {
        setFilter(e.target.value.toLowerCase());
    };

    const handleSortChange = (e) => {
        setSortOrder(e.target.value);
    };

    const filteredGames = games
        .filter((game) => game.gameName.toLowerCase().includes(filter))
        .sort((a, b) => {
            if (sortOrder === 'A-Z') {
                return a.gameName.localeCompare(b.gameName);
            } else {
                return b.gameName.localeCompare(a.gameName);
            }
        });

    const groupedGames = filteredGames.reduce((acc, game) => {
        const firstLetter = game.gameName[0].toUpperCase();
        if (!acc[firstLetter]) {
            acc[firstLetter] = [];
        }
        acc[firstLetter].push(game);
        return acc;
    }, {});

    return (
        <div className="game-list-container">
            <h1 className="games-headers">Games</h1>

            <div className="filter-sort-container">
                <input
                    type="text"
                    placeholder="Filter by game name"
                    value={filter}
                    onChange={handleFilterChange}
                    className="filter-input"
                />
                <select value={sortOrder} onChange={handleSortChange} className="sort-select">
                    <option value="A-Z">Alphabetical Order (A to Z)</option>
                    <option value="Z-A">Alphabetical Order (Z to A)</option>
                </select>
            </div>

            {filteredGames.length === 0 ? (
                <div className="not-found-message">
                    <h2>No games found</h2>
                    <p>Try adjusting your search or sort criteria.</p>
                </div>
            ) : (
                Object.keys(groupedGames).sort(sortOrder === 'A-Z' ? undefined : (a, b) => b.localeCompare(a)).map((letter) => (
                    <div key={letter} className="game-group">
                        <h2 className="group-header">{letter}</h2>
                        <div className="separator" />
                        <div className="games-container">
                            {groupedGames[letter].map((game, index) => (
                                <div key={index} className="game-section">
                                    <img src={game.img} alt={game.gameName} />
                                    <h3>{game.gameName}</h3>
                                    <Link to={`/game/${formatGameName(game.gameName)}`}>
                                        <button className="top-up-btn">Top Up</button>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default GameList;

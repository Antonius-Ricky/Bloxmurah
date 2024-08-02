import React, { useState } from 'react';
import '../Pages/LandingPage/landingpage.css';

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    return (
        <>
            <div className={`sidebar ${isOpen ? 'open' : ''}`}>
                <ul>
                    <li>Home</li>
                    <li>Promo dan Acara</li>
                    <li>Game</li>
                </ul>
            </div>
            <div className="hamburger" onClick={toggleSidebar}>
                <span></span>
                <span></span>
                <span></span>
            </div>
        </>
    );
};

export default Sidebar;

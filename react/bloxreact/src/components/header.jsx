import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Pages/LandingPage/landingpage.css';
import logo from '../assets/images/logo.png';
import 'remixicon/fonts/remixicon.css'; 

const Header = ({ username, token }) => {
    const navigate = useNavigate();
    const [menuVisible, setMenuVisible] = useState(false);
    const [notifications, setNotifications] = useState([
        { id: 1, text: 'Welcome to Bloxmurah, Have a look around!', unread: true },
    ]);
    const [notifVisible, setNotifVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const handleLogoClick = () => {
        navigate('/');
    };

    const handleProfileClick = () => {
        navigate('/profile');
    };

    const toggleMenu = () => {
        setMenuVisible(!menuVisible);
    };

    const toggleNotif = () => {
        setNotifVisible(!notifVisible);
        setNotifications(notifications.map(notif => ({ ...notif, unread: false })));
    };

    const navigateAndCloseMenu = (path) => {
        navigate(path);
        setMenuVisible(false);
    };

    const handleSearch = (e) => {
        if (e.key === 'Enter' && searchQuery.trim()) {
            navigate(`/gamelist?search=${encodeURIComponent(searchQuery)}`);
        }
    };

    const unreadNotifications = notifications.some(notif => notif.unread);

    return (
        <header className="header">
            <div className="header-left">
                <i 
                    className="ri-menu-line hamburger-icon"
                    onClick={toggleMenu}
                    style={{ cursor: 'pointer' }}
                ></i> 
                <img 
                    src={logo} 
                    alt="Logo" 
                    className="header-logo" 
                    onClick={handleLogoClick}
                    style={{ cursor: 'pointer' }}
                />
            </div>
            <input 
                type="text" 
                placeholder="Search in Bloxmurah...." 
                className="search-bar" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch}
            />
            <div className="header-right">
                <div className="promo-icon" onClick={() => navigate('/promo')}>
                    <i className="ri-discount-percent-fill"></i> 
                </div>
                <div className="notif-icon" onClick={toggleNotif}>
                    <i className={unreadNotifications ? "ri-mail-unread-fill" : "ri-mail-fill"}></i>
                </div>
                {token ? (
                    <span onClick={handleProfileClick} className="username-header">
                        {username}
                    </span>
                ) : (
                    <button onClick={() => navigate('/signup')} className="sign-in">
                        Sign Up
                    </button>
                )}
            </div>
            <nav className={`hamburger-menu ${menuVisible ? 'visible' : ''}`}>
                <i 
                    className="ri-close-line close-icon" 
                    onClick={toggleMenu}
                    style={{ cursor: 'pointer' }}
                ></i>
                <ul>
                    <li onClick={() => navigateAndCloseMenu('/')}>
                        <i className="ri-home-fill"></i> Home
                    </li>
                    <li onClick={() => navigateAndCloseMenu('/promo')}>
                        <i className="ri-discount-percent-fill"></i> Promo dan Acara
                    </li>
                    <li onClick={() => navigateAndCloseMenu('/gamelist')}>
                        <i className="ri-gamepad-fill"></i> Game
                    </li>
                    <li onClick={() => navigateAndCloseMenu('/customer-service')}>
                        <i className="ri-customer-service-fill"></i> Customer Service
                    </li>
                </ul>
            </nav>
            {menuVisible && <div className="overlay" onClick={toggleMenu}></div>}

            {notifVisible && (
                <div className="notification-dropdown">
                    <div className="notification-header">Notification</div>
                    {notifications.map((notif) => (
                        <div key={notif.id} className="notification-item">
                            {notif.text}
                        </div>
                    ))}
                </div>
            )}
        </header>
    );
};

export default Header;

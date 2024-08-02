import React from 'react';
import '../Pages/LandingPage/landingpage.css';
import logo from '../assets/images/logo.png';
import '@fortawesome/fontawesome-free/css/all.min.css'; 

const Header = () => {
    return (
        <header className="header">
            <img src={logo} alt="Logo" className="logo" />
            <input type="text" placeholder="Search" className="search-bar" />
            <div className="header-right">
                <button className="sign-in">Sign In</button>
                <i className="fas fa-shopping-cart cart-icon"></i> 
                <div className="language-preference">
                    <button>ID</button>
                    <button>EN</button>
                </div>
            </div>
        </header>
    );
};

export default Header;

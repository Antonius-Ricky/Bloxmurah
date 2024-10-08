import React from 'react';
import '../Pages/LandingPage/landingpage.css';
import logo from '../assets/images/logo.png';

const Footer = () => {
    return (
        <footer className="footer">
            <img src={logo} alt="Logo" className="footer-logo" />
            <div className="footer-links">
                <a href="/terms">Terms</a>
                <a href="/privacy">Privacy policy</a>
            </div>
            <p>&copy; 2023 BloxMurah. All rights reserved.</p>
        </footer>
    );
};

export default Footer;

import React from 'react';
import { useNavigate } from 'react-router-dom';
import './404.css'; 
import notfound from '../../assets/images/404.png'; 

const NotFound = () => {
    const navigate = useNavigate();

    const goHome = () => {
        navigate('/');
    };

    return (
        <div className="notfound-container">
            <img src={notfound} alt="404" className="notfound-image" /> 
            <h1 className="notfound-text">Unfortunately, the page you are looking for does not exist.</h1>
            <button onClick={goHome} className="notfound-button">Back To Home</button>
        </div>
    );
};

export default NotFound;

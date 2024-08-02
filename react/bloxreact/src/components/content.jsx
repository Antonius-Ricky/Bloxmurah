import React, { useState, useEffect } from 'react';
import '../Pages/LandingPage/landingpage.css';
import bfBanner1 from '../assets/images/bf_banner1.png';
import psBanner1 from '../assets/images/PS_banner1.png';
import bf_icon from '../assets/images/bf_icon.png';
import PetsimIcon from '../assets/images/PetsimIcon.png';


const images = [bfBanner1, psBanner1];

const games = [
    {
        name: "Blox Fruit",
        img: bf_icon
    },
    {
        name: "Pet Simulator 99",
        img: PetsimIcon
    },
    {
        name: "Pet Simulator X",
        img: PetsimIcon
    },
    {
        name: "Pet Simulator X",
        img: PetsimIcon
    },
    {
        name: "Pet Simulator X",
        img: PetsimIcon
    },
    {
        name: "Pet Simulator X",
        img: PetsimIcon
    },


];

const GameSection = ({ name, img }) => (
    <div className="game-section">
        <img src={img} alt={name} />
        <h3>{name}</h3>
        <button className="top-up-btn">Top Up</button>
    </div>
);

const Content = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((currentIndex + 1) % images.length);
        }, 3000); 
        return () => clearInterval(interval);
    }, [currentIndex]);

    return (
        <div className="content">
            <div className="carousel">
                {images.map((image, index) => (
                    <div
                        key={index}
                        className={`carousel-item ${index === currentIndex ? 'active' : ''}`}
                        style={{ backgroundImage: `url(${image})` }}
                    />
                ))}
            </div>
            <div className="game-sections">
                {games.map((game, index) => (
                    <GameSection key={index} name={game.name} img={game.img} />
                ))}
            </div>
        </div>
    );
};

export default Content;

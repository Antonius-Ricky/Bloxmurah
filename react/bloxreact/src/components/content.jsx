import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import '../Pages/LandingPage/landingpage.css';
import { useSwipeable } from 'react-swipeable';
import bfBanner1 from '../assets/images/bf_banner1.png';
import psBanner1 from '../assets/images/PS_banner1.png';
import psBanner2 from '../assets/images/PS_banner2.png';
import bf_icon from '../assets/images/bf_icon.png';
import Petsim99Icon from '../assets/images/Petsim99_Icon.png';
import PetsimXIcon from '../assets/images/Petsimx_Icon.png';
import AdoptMeIcon from '../assets/images/Adoptme_Icon.png';
import AnimeDefenders from '../assets/images/AnimeDefenders_Icon.png'
import MurderMystery from '../assets/images/MurderMystery_Icon.png'

const images = [bfBanner1, psBanner1, psBanner2];

export const games = [
    {
        gameName: "Blox Fruit",
        img: bf_icon
    },
    {
        gameName: "Pet Simulator 99",
        img: Petsim99Icon
    },
    {
        gameName: "Pet Simulator X",
        img: PetsimXIcon
    },
    {
        gameName : "Anime Defenders",
        img: AnimeDefenders
    },
    {
        gameName: "Adopt Me",
        img: AdoptMeIcon
    },
    {
        gameName : "Murder Myster",
        img : MurderMystery
    }
        
];

export const formatGameName = (name) => name.toLowerCase().replace(/\s+/g, '');

const GameSection = ({ gameName, img }) => (
    <div className="game-section">
        <img src={img} alt={gameName} />
        <h3>{gameName}</h3>
        <Link to={`/game/${formatGameName(gameName)}`}>
            <button className="top-up-btn">Top Up</button>
        </Link>
    </div>
);

const Content = () => {
    const [currentIndex, setCurrentIndex] = useState(1);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const autoSwipeRef = useRef(null);
    const swipeTimeoutRef = useRef(null);

    const resetAutoSwipe = (delay = 5000) => {
        if (autoSwipeRef.current) {
            clearInterval(autoSwipeRef.current);
        }
        autoSwipeRef.current = setInterval(handleNext, delay);
    };

    const handleNext = () => {
        if (!isTransitioning) {
            setIsTransitioning(true);
            setCurrentIndex((prevIndex) => prevIndex + 1);
        }
    };

    const handlePrev = () => {
        if (!isTransitioning) {
            setIsTransitioning(true);
            setCurrentIndex((prevIndex) => prevIndex - 1);
        }
    };

    const pauseAutoSwipe = () => {
        if (autoSwipeRef.current) {
            clearInterval(autoSwipeRef.current); 
        }
    };

    const resumeAutoSwipe = () => {
        pauseAutoSwipe(); 
        resetAutoSwipe(); 
    };

    const handlers = useSwipeable({
        onSwipedLeft: () => {
            pauseAutoSwipe(); 
            handleNext();
            clearTimeout(swipeTimeoutRef.current); 
            swipeTimeoutRef.current = setTimeout(resumeAutoSwipe, 5000);
        },
        onSwipedRight: () => {
            pauseAutoSwipe();
            handlePrev();
            clearTimeout(swipeTimeoutRef.current);
            swipeTimeoutRef.current = setTimeout(resumeAutoSwipe, 5000);
        },
        preventDefaultTouchmoveEvent: true,
        trackMouse: true,
    });

    useEffect(() => {
        window.scrollTo(0, 0); 
        resetAutoSwipe(); 
        return () => {
            clearInterval(autoSwipeRef.current); 
            clearTimeout(swipeTimeoutRef.current);
        };
    }, []);

    useEffect(() => {
        if (isTransitioning) {
            const transitionTimeout = setTimeout(() => {
                setIsTransitioning(false);
                if (currentIndex === images.length + 1) {
                    setCurrentIndex(1); 
                } else if (currentIndex === 0) {
                    setCurrentIndex(images.length); 
                }
            }, 500);
            return () => clearTimeout(transitionTimeout);
        }
    }, [currentIndex, isTransitioning]);

    const handleIndicatorClick = (index) => {
        pauseAutoSwipe();
        setCurrentIndex(index + 1);
        clearTimeout(swipeTimeoutRef.current); 
        swipeTimeoutRef.current = setTimeout(resumeAutoSwipe, 5000); 
    };

    return (
        <div className="content">
            <div className="carousel" {...handlers}>
                <div
                    className="carousel-inner"
                    style={{
                        transform: `translateX(-${currentIndex * 100}%)`,
                        transition: isTransitioning ? 'transform 0.5s ease-in-out' : 'none',
                    }}
                >
                    {[images[images.length - 1], ...images, images[0]].map((image, index) => (
                        <div
                            key={index}
                            className="carousel-item"
                            style={{ backgroundImage: `url(${image})` }}
                        />
                    ))}
                </div>
                <div className="carousel-indicators">
                    {images.map((_, index) => (
                        <span
                            key={index}
                            className={index === currentIndex - 1 ? 'active' : ''}
                            onClick={() => handleIndicatorClick(index)}
                        />
                    ))}
                </div>
            </div>
            
            <div className="game-section-header">
                <h2>Games</h2>
                <div className="separator" />
            </div>
            <div className="game-sections">
                {games.map((game, index) => (
                    <GameSection key={index} gameName={game.gameName} img={game.img} />
                ))}
            </div>
        </div>
    );
};

export default Content;

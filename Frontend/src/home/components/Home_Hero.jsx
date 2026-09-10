// src/routes/components/Home_Hero.jsx
import React, { useState, useEffect } from 'react';
import env_export from '../../config/env_export';
import '../assets/css/Home_Hero.css';

const Home_Hero = () => {
    const { TEAM_TAG, TEAM_NAME, COLOR_CODE_1, COLOR_CODE_2 } = env_export;

    // Hero slides data
    const slides = [
        {
            id: 1,
            image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&h=600&fit=crop',
            title: '#RISE AS ONE',
            subtitle: 'Welcome to the battlefield',
            tag: 'SEASON 2026'
        },
        {
            id: 2,
            image: 'https://images.unsplash.com/photo-1511882150382-421056c89033?w=1200&h=600&fit=crop',
            title: 'DOMINATE',
            subtitle: 'Train. Kill. Repeat.',
            tag: 'TEAM T2K'
        },
        {
            id: 3,
            image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200&h=600&fit=crop',
            title: 'VICTORY AWAITS',
            subtitle: 'Join the elite squad',
            tag: 'ESPORT PRO'
        }
    ];

    const [currentSlide, setCurrentSlide] = useState(0);

    // Auto-slide every 5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [slides.length]);

    // Go to specific slide
    const goToSlide = (index) => {
        setCurrentSlide(index);
    };

    // Next/Prev slide
    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    };

    return (
        <section id="home-hero-section" className="home-hero-section">
            {/* Hero Slider */}
            <div className="hero-slider">
                {slides.map((slide, index) => (
                    <div 
                        key={slide.id}
                        className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
                        style={{
                            transform: `translateX(${(index - currentSlide) * 100}%)`
                        }}
                    >
                        <div className="hero-image-wrapper">
                            <img 
                                src={slide.image} 
                                alt={slide.title}
                                className="hero-image"
                                loading="lazy"
                            />
                            <div className="hero-overlay"></div>
                        </div>
                        
                        <div className="hero-content">
                            <span className="hero-badge" style={{
                                background: `linear-gradient(135deg, ${COLOR_CODE_1}, ${COLOR_CODE_2})`
                            }}>
                                {slide.tag}
                            </span>
                            <h1 className="hero-title">
                                {slide.title.split(' ').map((word, i) => (
                                    <span key={i}>
                                        {word === 'AS' ? (
                                            <span style={{ color: COLOR_CODE_2 }}>AS</span>
                                        ) : word === 'ONE' ? (
                                            <span style={{ color: COLOR_CODE_1 }}>ONE</span>
                                        ) : (
                                            word
                                        )}{' '}
                                    </span>
                                ))}
                            </h1>
                            <p className="hero-subtitle">{slide.subtitle}</p>
                            <div className="hero-actions">
                                <button className="hero-btn-primary" style={{
                                    background: `linear-gradient(135deg, ${COLOR_CODE_1}, ${COLOR_CODE_2})`
                                }}>
                                    Join Now
                                </button>
                                <button className="hero-btn-secondary">
                                    Learn More
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Navigation Arrows */}
            <button 
                className="hero-arrow hero-arrow-left" 
                onClick={prevSlide}
                aria-label="Previous slide"
            >
                <i className="bi bi-caret-left-fill"></i>
            </button>
            <button 
                className="hero-arrow hero-arrow-right" 
                onClick={nextSlide}
                aria-label="Next slide"
            >
                <i className="bi bi-caret-right-fill"></i>
            </button>

            {/* Dots Indicator */}
            <div className="hero-dots">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        className={`hero-dot ${index === currentSlide ? 'active' : ''}`}
                        onClick={() => goToSlide(index)}
                        aria-label={`Go to slide ${index + 1}`}
                        style={{
                            background: index === currentSlide 
                                ? `linear-gradient(135deg, ${COLOR_CODE_1}, ${COLOR_CODE_2})`
                                : 'var(--border-color-secondary)'
                        }}
                    />
                ))}
            </div>

            {/* Team Info Overlay */}
            <div className="hero-team-info">
                <div className="hero-team-tag" style={{ color: COLOR_CODE_1 }}>
                    {TEAM_TAG}
                </div>
                <div className="hero-team-name">{TEAM_NAME}</div>
            </div>
        </section>
    );
};

export default Home_Hero;
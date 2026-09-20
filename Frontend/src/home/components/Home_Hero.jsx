// src/routes/components/Home_Hero.jsx
import React, { useState, useEffect } from 'react';
import { getOrgConfig } from '../../config/org_config';
import { useHomeAPI } from '../../home/Home_API_Context';
import '../assets/css/Home_Hero.css';

const Home_Hero = () => {
    const { team_tag, team_name, color_code_1, color_code_2 } = getOrgConfig();
    const { hero, loading, error, refresh } = useHomeAPI();

    const [currentSlide, setCurrentSlide] = useState(0);
    const slides = hero?.slides || [];

    // Auto-slide every 5 seconds
    useEffect(() => {
        if (!slides.length) return;
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [slides.length]);

    const goToSlide = (index) => setCurrentSlide(index);
    const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
    const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

    // Loading state
    if (loading && !hero) {
        return (
            <section id="home-hero-section" className="home-hero-section">
                <div className="hero-loading">
                    <div className="loading-spinner" style={{ borderColor: color_code_1 }}></div>
                </div>
            </section>
        );
    }

    // Error state
    if (error && !hero) {
        return (
            <section id="home-hero-section" className="home-hero-section">
                <div className="hero-error">
                    <p>Failed to load hero content</p>
                    <button onClick={refresh} style={{ background: color_code_1, color: '#fff' }}>
                        Retry
                    </button>
                </div>
            </section>
        );
    }

    return (
        <section id="home-hero-section" className="home-hero-section">
            {/* Hero Slider */}
            <div className="hero-slider">
                {slides.map((slide, index) => (
                    <div
                        key={slide.id}
                        className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
                        style={{ transform: `translateX(${(index - currentSlide) * 100}%)` }}
                    >
                        <div className="hero-image-wrapper">
                            <img src={slide.image} alt={slide.title} className="hero-image" loading="lazy" />
                            <div className="hero-overlay"></div>
                        </div>

                        <div className="hero-content">
                            <span className="hero-badge" style={{
                                background: `linear-gradient(135deg, ${color_code_1}, ${color_code_2})`
                            }}>
                                {slide.tag}
                            </span>
                            <h1 className="hero-title">
                                {slide.title.split(' ').map((word, i) => (
                                    <span key={i}>
                                        {word === 'AS' ? (
                                            <span style={{ color: color_code_2 }}>AS</span>
                                        ) : word === 'ONE' ? (
                                            <span style={{ color: color_code_1 }}>ONE</span>
                                        ) : word}{' '}
                                    </span>
                                ))}
                            </h1>
                            <p className="hero-subtitle">{slide.subtitle}</p>
                            <div className="hero-actions">
                                <button className="hero-btn-primary" style={{
                                    background: `linear-gradient(135deg, ${color_code_1}, ${color_code_2})`
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
            <button className="hero-arrow hero-arrow-left" onClick={prevSlide} aria-label="Previous slide">
                <i className="bi bi-caret-left-fill"></i>
            </button>
            <button className="hero-arrow hero-arrow-right" onClick={nextSlide} aria-label="Next slide">
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
                                ? `linear-gradient(135deg, ${color_code_1}, ${color_code_2})`
                                : 'var(--border-color-secondary)'
                        }}
                    />
                ))}
            </div>

            {/* Team Info Overlay */}
            <div className="hero-team-info">
                <div className="hero-team-tag" style={{ color: color_code_1 }}>{team_tag}</div>
                <div className="hero-team-name">{team_name}</div>
            </div>
        </section>
    );
};

export default Home_Hero;
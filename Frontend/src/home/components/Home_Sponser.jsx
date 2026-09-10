// src/routes/components/Home_Sponser.jsx
import React, { useRef, useState, useEffect } from 'react';
import env_export from '../../config/env_export';
import "../assets/css/Home_Sponser.css";

const Home_Sponser = () => {
    const { 
        TEAM_TAG, 
        TEAM_NAME, 
        COLOR_CODE_1, 
        COLOR_CODE_2 
    } = env_export;

    const scrollRef = useRef(null);
    const [sponsors, setSponsors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch sponsors with simple URLs
    useEffect(() => {
        try {
            setLoading(true);
            // Simple sponsor data with direct image URLs
            const sponsorData = [
                { 
                    id: 1, 
                    name: 'adidas', 
                    logo: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/20/Adidas_Logo.svg/3840px-Adidas_Logo.svg.png?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=thumbnail' 
                },
                { 
                    id: 2, 
                    name: 'Nike', 
                    logo: 'https://images.seeklogo.com/logo-png/9/2/nike-logo-png_seeklogo-99478.png' 
                },
                { 
                    id: 3, 
                    name: 'Puma', 
                    logo: 'https://static.vecteezy.com/system/resources/previews/020/336/032/non_2x/puma-logo-puma-icon-free-free-vector.jpg' 
                },
                { 
                    id: 4, 
                    name: 'Red Bull', 
                    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Red_Bull_Energy_Drink_logo.svg/200px-Red_Bull_Energy_Drink_logo.svg.png' 
                },
                { 
                    id: 5, 
                    name: 'Razer', 
                    logo: 'https://logos-world.net/wp-content/uploads/2020/11/Razer-Logo.png' 
                },
                { 
                    id: 6, 
                    name: 'GUESS', 
                    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Guess_logo.svg/200px-Guess_logo.svg.png' 
                },
                { 
                    id: 7, 
                    name: 'Monster', 
                    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Monster_Energy_logo.svg/200px-Monster_Energy_logo.svg.png' 
                },
                { 
                    id: 8, 
                    name: 'amex', 
                    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/American_Express_logo.svg/200px-American_Express_logo.svg.png' 
                },
            ];
            
            setSponsors(sponsorData);
            setError(null);
        } catch (err) {
            console.error('Error loading sponsors:', err);
            setError(err.message);
            // Fallback data with text if images fail
            setSponsors([
                { id: 1, name: 'adidas', logo: '' },
                { id: 2, name: 'Nike', logo: '' },
                { id: 3, name: 'Puma', logo: '' },
                { id: 4, name: 'Red Bull', logo: '' },
                { id: 5, name: 'Razer', logo: '' },
                { id: 6, name: 'GUESS', logo: '' },
                { id: 7, name: 'Monster', logo: '' },
                { id: 8, name: 'amex', logo: '' },
            ]);
        } finally {
            setLoading(false);
        }
    }, []);

    // Duplicate sponsors for infinite scroll effect
    const doubledSponsors = sponsors.length > 0 ? [...sponsors, ...sponsors] : [];

    const scrollLeft = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({
                left: -200,
                behavior: 'smooth'
            });
        }
    };

    const scrollRight = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({
                left: 200,
                behavior: 'smooth'
            });
        }
    };

    // Loading state
    if (loading) {
        return (
            <section id="home-sponser-section" className="home-sponser-section">
                <div className="container">
                    <div className="section-header">
                        <span className="section-badge" style={{ 
                            background: `linear-gradient(135deg, ${COLOR_CODE_1}, ${COLOR_CODE_2})`
                        }}>
                            Our Partners
                        </span>
                        <h2 className="section-title">
                            <span style={{ color: COLOR_CODE_1 }}>Trusted</span> Sponsors
                        </h2>
                    </div>
                    <div className="sponsor-loading">
                        <div className="loading-spinner" style={{ borderColor: COLOR_CODE_1 }}></div>
                        <p>Loading sponsors...</p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section id="home-sponser-section" className="home-sponser-section">
            <div className="container">
                {/* Section Header */}
                <div className="section-header">
                    <span className="section-badge" style={{ 
                        background: `linear-gradient(135deg, ${COLOR_CODE_1}, ${COLOR_CODE_2})`
                    }}>
                        Our Partners
                    </span>
                    <h2 className="section-title">
                        <span style={{ color: COLOR_CODE_1 }}>Trusted</span> Sponsors
                    </h2>
                    <p className="section-subtitle">
                        Proudly supported by industry leaders who believe in our vision
                    </p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="sponsor-error" style={{
                        borderColor: COLOR_CODE_1,
                        color: COLOR_CODE_1
                    }}>
                        <i className="bi bi-exclamation-circle"></i>
                        <span>{error}</span>
                    </div>
                )}

                {/* Sponsor Carousel */}
                {sponsors.length > 0 ? (
                    <div className="sponsor-carousel-wrapper">
                        <button 
                            className="carousel-btn carousel-btn-left" 
                            onClick={scrollLeft}
                            style={{
                                background: `linear-gradient(135deg, ${COLOR_CODE_1}, ${COLOR_CODE_2})`
                            }}
                        >
                            <i className="bi bi-arrow-left-circle"></i>
                        </button>

                        <div className="sponsor-carousel" ref={scrollRef}>
                            <div className="sponsor-track">
                                {doubledSponsors.map((sponsor, index) => (
                                    <div key={`${sponsor.id}-${index}`} className="sponsor-item">
                                        <div className="sponsor-logo-wrapper">
                                            {sponsor.logo ? (
                                                <img 
                                                    src={sponsor.logo} 
                                                    alt={sponsor.name}
                                                    className="sponsor-logo"
                                                    loading="lazy"
                                                    onError={(e) => {
                                                        e.target.style.display = 'none';
                                                        // Show fallback text if image fails to load
                                                        const fallback = document.createElement('span');
                                                        fallback.className = 'sponsor-fallback';
                                                        fallback.textContent = sponsor.name;
                                                        fallback.style.color = COLOR_CODE_1;
                                                        e.target.parentElement.appendChild(fallback);
                                                    }}
                                                />
                                            ) : (
                                                <span className="sponsor-fallback" style={{ color: COLOR_CODE_1 }}>
                                                    {sponsor.name}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <button 
                            className="carousel-btn carousel-btn-right" 
                            onClick={scrollRight}
                            style={{
                                background: `linear-gradient(135deg, ${COLOR_CODE_1}, ${COLOR_CODE_2})`
                            }}
                        >
                            <i className="bi bi-arrow-right-circle"></i>
                        </button>
                    </div>
                ) : (
                    <div className="sponsor-empty">
                        <p>No sponsors available at the moment.</p>
                    </div>
                )}

                {/* Become a Sponsor CTA */}
                <div className="sponsor-cta" style={{
                    background: `linear-gradient(135deg, ${COLOR_CODE_1}22, ${COLOR_CODE_2}22)`,
                    border: `1px solid ${COLOR_CODE_1}44`
                }}>
                    <div className="cta-content">
                        <h3>Become a <span style={{ color: COLOR_CODE_1 }}>Partner</span></h3>
                        <p>Join our growing family of sponsors and partners</p>
                        <button className="cta-btn" style={{
                            background: `linear-gradient(135deg, ${COLOR_CODE_1}, ${COLOR_CODE_2})`,
                            color: '#fff'
                        }}>
                            <i className="bi bi-people"></i> Partner With Us
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Home_Sponser;
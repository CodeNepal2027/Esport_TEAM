// src/routes/components/Home_About.jsx
import React from 'react';
import env_export from '../../config/env_export';
import "../assets/css/Home_About.css";

const Home_About = () => {
    const { 
        TEAM_TAG, 
        TEAM_NAME, 
        COLOR_CODE_1, 
        COLOR_CODE_2 
    } = env_export;

    return (
        <section id="home-about-section" className="home-about-section">
            <div className="container">
                {/* Section Header */}
                <div className="section-header">
                    <span className="section-badge" style={{ 
                        background: `linear-gradient(135deg, ${COLOR_CODE_1}, ${COLOR_CODE_2})`
                    }}>
                        About Us
                    </span>
                    <h2 className="section-title">
                        Who We <span style={{ color: COLOR_CODE_1 }}>Are</span>
                    </h2>
                    <p className="section-subtitle">
                        Learn more about {TEAM_NAME} and our journey
                    </p>
                </div>

                {/* About Content */}
                <div className="about-grid">
                    <div className="about-content">
                        <h3 className="about-heading">
                            <span style={{ color: COLOR_CODE_1 }}>{TEAM_TAG}</span> - {TEAM_NAME}
                        </h3>
                        <p className="about-text">
                            {TEAM_NAME} is a professional esports organization dedicated to 
                            competitive gaming excellence. Founded with a passion for gaming 
                            and a vision to dominate the competitive scene.
                        </p>
                        <p className="about-text">
                            Our team consists of highly skilled players who train rigorously 
                            to compete at the highest level. We believe in teamwork, dedication, 
                            and the relentless pursuit of victory.
                        </p>
                        <div className="about-stats">
                            <div className="stat-item">
                                <span className="stat-number" style={{ color: COLOR_CODE_1 }}>
                                    2019
                                </span>
                                <span className="stat-label">Founded</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-number" style={{ color: COLOR_CODE_1 }}>
                                    50+
                                </span>
                                <span className="stat-label">Tournaments</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-number" style={{ color: COLOR_CODE_1 }}>
                                    87%
                                </span>
                                <span className="stat-label">Win Rate</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-number" style={{ color: COLOR_CODE_1 }}>
                                    12
                                </span>
                                <span className="stat-label">Trophies</span>
                            </div>
                        </div>
                        <button className="about-btn" style={{ 
                            background: `linear-gradient(135deg, ${COLOR_CODE_1}, ${COLOR_CODE_2})`
                        }}>
                            Join Our Team
                        </button>
                    </div>

                    <div className="about-image">
                        <div className="image-placeholder" style={{
                            border: `3px solid ${COLOR_CODE_1}`,
                            boxShadow: `0 0 40px ${COLOR_CODE_1}44`
                        }}>
                            <div className="placeholder-content">
                                <span className="placeholder-icon" style={{ color: COLOR_CODE_1 }}>
                                    <i className="bi bi-controller"></i>
                                </span>
                                <h4>{TEAM_TAG}</h4>
                                <p>{TEAM_NAME}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mission & Vision */}
                <div className="mission-vision">
                    <div className="mission-card" style={{
                        border: `1px solid ${COLOR_CODE_1}44`,
                        background: `linear-gradient(135deg, ${COLOR_CODE_1}11, ${COLOR_CODE_2}11)`
                    }}>
                        <div className="mission-icon" style={{ color: COLOR_CODE_1 }}>
                            <i className="bi bi-bullseye"></i>
                        </div>
                        <h4>Our Mission</h4>
                        <p>To dominate the competitive gaming scene while building a community of passionate gamers who share our vision.</p>
                    </div>

                    <div className="mission-card" style={{
                        border: `1px solid ${COLOR_CODE_2}44`,
                        background: `linear-gradient(135deg, ${COLOR_CODE_2}11, ${COLOR_CODE_1}11)`
                    }}>
                        <div className="mission-icon" style={{ color: COLOR_CODE_2 }}>
                            <i className="bi bi-eye"></i>
                        </div>
                        <h4>Our Vision</h4>
                        <p>To become a global esports powerhouse, inspiring the next generation of competitive gamers worldwide.</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Home_About;
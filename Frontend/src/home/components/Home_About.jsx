// src/home/components/Home_About.jsx
import React from 'react';
import { getOrgConfig } from '../../config/org_config';
import { useHomeAPI } from '../../home/Home_API_Context';
import "../assets/css/Home_About.css";

const Home_About = () => {
    const {
        team_tag,
        team_name,
        team_logo_url,
        color_code_1,
        color_code_2,
        org_whatsapp,
    } = getOrgConfig();
    const { about, loading, error, refresh } = useHomeAPI();

    // Build WhatsApp join-team link with a prefilled message
    const whatsappDigits = org_whatsapp
        ? String(org_whatsapp).replace(/[^0-9]/g, '')
        : '';
    const joinMessage = encodeURIComponent(
        `Hi ${team_name || 'Team'},\n\nI'd like to try out for the team. Here's a bit about me:`
    );
    const whatsappJoinLink = whatsappDigits
        ? `https://wa.me/${whatsappDigits}?text=${joinMessage}`
        : null;

    // Loading — skeleton loader
    if (loading && !about) {
        return (
            <section id="home-about-section" className="home-about-section">
                <div className="container">
                    <div className="section-header">
                        <div className="about-skeleton about-skeleton-badge"></div>
                        <div className="about-skeleton about-skeleton-title"></div>
                        <div className="about-skeleton about-skeleton-subtitle"></div>
                    </div>

                    <div className="about-grid">
                        <div className="about-content">
                            <div className="about-skeleton about-skeleton-heading"></div>

                            <div className="about-skeleton about-skeleton-text"></div>
                            <div className="about-skeleton about-skeleton-text"></div>
                            <div className="about-skeleton about-skeleton-text about-skeleton-text-short"></div>

                            <div className="about-stats">
                                {[0, 1, 2, 3].map((i) => (
                                    <div key={i} className="stat-item">
                                        <div className="about-skeleton about-skeleton-stat-number"></div>
                                        <div className="about-skeleton about-skeleton-stat-label"></div>
                                    </div>
                                ))}
                            </div>

                            <div className="about-skeleton about-skeleton-btn"></div>
                        </div>

                        <div className="about-image">
                            <div className="image-placeholder">
                                <div className="placeholder-glow" />
                                <div className="placeholder-glow-secondary" />
                                <div className="placeholder-content">
                                    <div className="about-skeleton about-skeleton-logo"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mission-vision">
                        {[0, 1].map((i) => (
                            <div key={i} className="mission-card">
                                <div className="about-skeleton about-skeleton-mission-icon"></div>
                                <div className="about-skeleton about-skeleton-mission-title"></div>
                                <div className="about-skeleton about-skeleton-mission-text"></div>
                                <div className="about-skeleton about-skeleton-mission-text about-skeleton-mission-text-short"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    // Error
    if (error && !about) {
        return (
            <section id="home-about-section" className="home-about-section">
                <div className="container">
                    <div className="section-error">
                        <p>Failed to load about content</p>
                        <button onClick={refresh} style={{ background: color_code_1, color: '#fff' }}>Retry</button>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section id="home-about-section" className="home-about-section">
            <div className="container">
                {/* Section Header */}
                <div className="section-header">
                    <span className="section-badge" style={{
                        background: `linear-gradient(135deg, ${color_code_1}, ${color_code_2})`
                    }}>
                        About Us
                    </span>
                    <h2 className="section-title">
                        Who We <span style={{ color: color_code_1 }}>Are</span>
                    </h2>
                    <p className="section-subtitle">
                        Learn more about {team_name} and our journey
                    </p>
                </div>

                {/* About Content */}
                <div className="about-grid">
                    <div className="about-content">
                        <h3 className="about-heading">
                            <span style={{ color: color_code_1 }}>{team_tag}</span> - {about?.heading || team_name}
                        </h3>

                        {about?.paragraphs?.map((para, i) => (
                            <p key={para?.id ?? i} className="about-text">
                                {typeof para === 'string' ? para : para?.text}
                            </p>
                        ))}

                        <div className="about-stats">
                            {about?.stats?.map((stat, i) => (
                                <div key={stat?.id ?? i} className="stat-item">
                                    <span className="stat-number" style={{ color: color_code_1 }}>
                                        {stat?.value}
                                    </span>
                                    <span className="stat-label">{stat?.label}</span>
                                </div>
                            ))}
                        </div>

                        {whatsappJoinLink ? (
                            <a
                                href={whatsappJoinLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="about-btn"
                                style={{
                                    background: `linear-gradient(135deg, ${color_code_1}, ${color_code_2})`
                                }}
                            >
                                <i className="bi bi-whatsapp"></i> Join Our Team
                            </a>
                        ) : (
                            <button
                                className="about-btn"
                                style={{
                                    background: `linear-gradient(135deg, ${color_code_1}, ${color_code_2})`
                                }}
                            >
                                Join Our Team
                            </button>
                        )}
                    </div>

                    {/* About Image — Logo */}
                    <div className="about-image">
                        <div className="image-placeholder">
                            <div className="placeholder-glow" style={{
                                background: `radial-gradient(circle, ${color_code_1}33 0%, transparent 70%)`
                            }} />
                            <div className="placeholder-glow-secondary" style={{
                                background: `radial-gradient(circle, ${color_code_2}22 0%, transparent 70%)`
                            }} />

                            <div className="placeholder-content">
                                {team_logo_url ? (
                                    <img
                                        src={team_logo_url}
                                        alt={team_name}
                                        className="about-logo"
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                            const fallback = e.target.parentElement.querySelector('.about-logo-fallback');
                                            if (fallback) fallback.style.display = 'flex';
                                        }}
                                    />
                                ) : null}

                                <div
                                    className="about-logo-fallback"
                                    style={{ display: team_logo_url ? 'none' : 'flex' }}
                                >
                                    <span className="placeholder-icon" style={{ color: color_code_1 }}>
                                        <i className="bi bi-controller"></i>
                                    </span>
                                    <h4>{team_tag}</h4>
                                    <p>{team_name}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mission & Vision */}
                <div className="mission-vision">
                    <div className="mission-card" style={{
                        border: `1px solid ${color_code_1}44`,
                        background: `linear-gradient(135deg, ${color_code_1}11, ${color_code_2}11)`
                    }}>
                        <div className="mission-icon" style={{ color: color_code_1 }}>
                            <i className="bi bi-bullseye"></i>
                        </div>
                        <h4>Our Mission</h4>
                        <p>{about?.mission}</p>
                    </div>

                    <div className="mission-card" style={{
                        border: `1px solid ${color_code_2}44`,
                        background: `linear-gradient(135deg, ${color_code_2}11, ${color_code_1}11)`
                    }}>
                        <div className="mission-icon" style={{ color: color_code_2 }}>
                            <i className="bi bi-eye"></i>
                        </div>
                        <h4>Our Vision</h4>
                        <p>{about?.vision}</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Home_About;
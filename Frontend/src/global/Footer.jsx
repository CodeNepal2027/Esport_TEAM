// src/global/Footer.jsx
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { getOrgConfig } from '../config/org_config';
import {
    POWERED_BY_NAME,
    POWERED_BY_LINK,
    POWERED_BY_LOGO_URL,
} from '../config/env_export';
import "./assets/css/Footer.css";

const Footer = () => {
    const { 
        team_tag,
        team_name,
        team_logo_url,
        color_code_1,
        color_code_2,
        org_shop,
        org_email,
        org_phone_1,
        org_phone_2,
        org_address,
        org_country,
        org_youtube_link,
        org_tiktok_link,
        org_instagram_link,
        org_discord_link,
        org_twitter_link,
    } = getOrgConfig();

    const navigate = useNavigate();
    const location = useLocation();

    // Auto-fetch current year from system calendar
    const currentYear = new Date().getFullYear();

    // Smooth scroll to section (same as navbar)
    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 80;
            const topbarHeight = document.querySelector('.topbar')?.offsetHeight || 0;
            const totalOffset = navbarHeight + topbarHeight;

            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - totalOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    };

    // Handle click for section links
    const handleSectionClick = (e, sectionId) => {
        e.preventDefault();

        // If already on home page, just scroll
        if (location.pathname === '/') {
            scrollToSection(sectionId);
        } else {
            // Navigate to home then scroll after render
            navigate('/');
            setTimeout(() => {
                scrollToSection(sectionId);
            }, 150);
        }
    };

    // Handle home click
    const handleHomeClick = (e) => {
        e.preventDefault();
        if (location.pathname === '/') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            navigate('/');
        }
    };

    return (
        <footer className="footer">
            <div className="container">
                {/* Main Footer Content */}
                <div className="footer-grid">
                    {/* Brand Column */}
                    <div className="footer-brand">
                        <div className="footer-logo-wrapper">
                            <img 
                                src={team_logo_url} 
                                alt={team_name}
                                className="footer-logo"
                                onError={(e) => {
                                    e.target.src = `https://ui-avatars.com/api/?name=${team_tag}&background=${color_code_1.replace('#', '')}&color=fff&size=64`;
                                }}
                            />
                            <h2 className="footer-brand-name" style={{ color: color_code_1 }}>
                                {team_tag} <span>ESPORTS</span>
                            </h2>
                        </div>
                        <p className="footer-description">
                            Showcasing Excellence: {team_name} represents passion, skill, and creativity—explore our journey, achievements, and the team behind the success.
                        </p>
                    </div>

                    {/* Company Column */}
                    <div className="footer-column">
                        <h4 className="footer-column-title">Company</h4>
                        <ul className="footer-links">
                            <li>
                                <a href="/" onClick={handleHomeClick}>Home</a>
                            </li>
                            <li>
                                <a href="#home-about-section" onClick={(e) => handleSectionClick(e, 'home-about-section')}>
                                    About Us
                                </a>
                            </li>
                            <li>
                                <a href="#home-gallery-section" onClick={(e) => handleSectionClick(e, 'home-gallery-section')}>
                                    Gallery
                                </a>
                            </li>
                            <li>
                                <a href="#home-event-section" onClick={(e) => handleSectionClick(e, 'home-event-section')}>
                                    Latest News
                                </a>
                            </li>
                            <li>
                                <a href="#home-team-section" onClick={(e) => handleSectionClick(e, 'home-team-section')}>
                                    Our Teams
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Store Column */}
                    <div className="footer-column">
                        <h4 className="footer-column-title">{team_tag} Store</h4>
                        <ul className="footer-links">
                            {org_shop && (
                                <li>
                                    <a 
                                        href={org_shop} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                    >
                                        Shop Now
                                    </a>
                                </li>
                            )}
                            <li>
                                <a href="#home-contact-section" onClick={(e) => handleSectionClick(e, 'home-contact-section')}>
                                    Contact Support
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Get In Touch Column */}
                    <div className="footer-column">
                        <h4 className="footer-column-title">Get In Touch</h4>
                        <div className="footer-contact">
                            {org_email && (
                                <div className="contact-item">
                                    <span className="contact-label">EMAIL</span>
                                    <a 
                                        href={`mailto:${org_email}`} 
                                        className="contact-value" 
                                        style={{ color: color_code_1 }}
                                    >
                                        {org_email}
                                    </a>
                                </div>
                            )}
                            {org_phone_1 && (
                                <div className="contact-item">
                                    <span className="contact-label">PHONE</span>
                                    <a 
                                        href={`tel:${org_phone_1}`} 
                                        className="contact-value"
                                    >
                                        {org_phone_1}
                                    </a>
                                    {org_phone_2 && (
                                        <a 
                                            href={`tel:${org_phone_2}`} 
                                            className="contact-value"
                                        >
                                            {org_phone_2}
                                        </a>
                                    )}
                                </div>
                            )}
                            {(org_address || org_country) && (
                                <div className="contact-item">
                                    <span className="contact-label">LOCATION</span>
                                    <span className="contact-value">
                                        {org_address}{org_address && org_country ? ', ' : ''}{org_country}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Social Media Section */}
                {(org_youtube_link || org_tiktok_link || org_instagram_link || org_discord_link || org_twitter_link) && (
                    <div className="footer-social-section">
                        <div className="footer-social">
                            <h4 className="footer-social-title">FOLLOW OUR JOURNEY</h4>
                            <div className="social-icons">
                                {org_twitter_link && (
                                    <a 
                                        href={org_twitter_link} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="social-icon"
                                        // style={{ color: color_code_1 }}
                                    >
                                        <i className="bi bi-twitter"></i>
                                    </a>
                                )}
                                {org_instagram_link && (
                                    <a 
                                        href={org_instagram_link} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="social-icon"
                                        // style={{ color: color_code_2 }}
                                    >
                                        <i className="bi bi-instagram"></i>
                                    </a>
                                )}
                                {org_youtube_link && (
                                    <a 
                                        href={org_youtube_link} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="social-icon"
                                    >
                                        <i className="bi bi-youtube"></i>
                                    </a>
                                )}
                                {org_tiktok_link && (
                                    <a 
                                        href={org_tiktok_link} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="social-icon"
                                    >
                                        <i className="bi bi-tiktok"></i>
                                    </a>
                                )}
                                {org_discord_link && (
                                    <a 
                                        href={org_discord_link} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="social-icon"
                                    >
                                        <i className="bi bi-discord"></i>
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Bottom Bar */}
                <div className="footer-bottom">
                    <div className="footer-bottom-left">
                        <span className="footer-powered">
                            Powered By{' '}
                            {POWERED_BY_LINK ? (
                                <a 
                                    href={POWERED_BY_LINK} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="powered-by-link"
                                >
                                    {POWERED_BY_LOGO_URL && (
                                        <img 
                                            src={POWERED_BY_LOGO_URL} 
                                            alt={POWERED_BY_NAME}
                                            className="powered-by-logo"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                            }}
                                        />
                                    )}
                                    <span>{POWERED_BY_NAME}</span>
                                </a>
                            ) : (
                                <span className="powered-by-text">{POWERED_BY_NAME}</span>
                            )}
                        </span>
                    </div>
                    <div className="footer-bottom-right">
                        <Link to="/privacy">Privacy Policy</Link>
                        <span className="separator">|</span>
                        <Link to="/terms">Terms & Conditions</Link>
                    </div>
                </div>

                {/* Copyright - Auto Year from System Calendar */}
                <div className="footer-copyright">
                    <p>© {currentYear} {team_name}. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
// src/global/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import env_export from '../config/env_export';
import "./assets/css/Footer.css";

const Footer = () => {
    const { 
        TEAM_TAG, 
        TEAM_NAME, 
        TEAM_LOGO_URL,
        COLOR_CODE_1, 
        COLOR_CODE_2 
    } = env_export;

    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="container">
                {/* Main Footer Content */}
                <div className="footer-grid">
                    {/* Brand Column */}
                    <div className="footer-brand">
                        <div className="footer-logo-wrapper">
                            <img 
                                src={TEAM_LOGO_URL} 
                                alt={TEAM_NAME}
                                className="footer-logo"
                                onError={(e) => {
                                    e.target.src = 'https://ui-avatars.com/api/?name=T2K&background=FF0000&color=fff&size=64';
                                }}
                            />
                            <h2 className="footer-brand-name" style={{ color: COLOR_CODE_1 }}>
                                {TEAM_TAG} <span>ESPORTS</span>
                            </h2>
                        </div>
                        <p className="footer-description">
                            Showcasing Excellence: {TEAM_NAME} represents passion, skill, and creativity—explore our journey, achievements, and the team behind the success.
                        </p>
                    </div>

                    {/* Company Column */}
                    <div className="footer-column">
                        <h4 className="footer-column-title">Company</h4>
                        <ul className="footer-links">
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/about">About Us</Link></li>
                            <li><Link to="/gallery">Gallery</Link></li>
                            <li><Link to="/news">Latest News</Link></li>
                            <li><Link to="/team">Our Teams</Link></li>
                        </ul>
                    </div>

                    {/* Store Column */}
                    <div className="footer-column">
                        <h4 className="footer-column-title">{TEAM_TAG} Store</h4>
                        <ul className="footer-links">
                            <li><Link to="/shop">Shop Now</Link></li>
                            <li><Link to="/contact">Contact Support</Link></li>
                        </ul>
                    </div>

                    {/* Get In Touch Column */}
                    <div className="footer-column">
                        <h4 className="footer-column-title">Get In Touch</h4>
                        <div className="footer-contact">
                            <div className="contact-item">
                                <span className="contact-label">EMAIL</span>
                                <a href="mailto:info@t2k.com" className="contact-value" style={{ color: COLOR_CODE_1 }}>
                                    info@t2k.com
                                </a>
                            </div>
                            <div className="contact-item">
                                <span className="contact-label">PHONE</span>
                                <a href="tel:+9779803857466" className="contact-value">
                                    +977-9803857466
                                </a>
                            </div>
                            <div className="contact-item">
                                <span className="contact-label">LOCATION</span>
                                <span className="contact-value">Gaming District, Esports City</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Social Media Section */}
                <div className="footer-social-section">
                    <div className="footer-social">
                        <h4 className="footer-social-title">FOLLOW OUR JOURNEY</h4>
                        <div className="social-icons">
                            <a href="#" className="social-icon" style={{ color: COLOR_CODE_1 }}>
                                <i className="bi bi-facebook"></i>
                            </a>
                            <a href="#" className="social-icon" style={{ color: COLOR_CODE_2 }}>
                                <i className="bi bi-instagram"></i>
                            </a>
                            <a href="#" className="social-icon">
                                <i className="bi bi-twitter"></i>
                            </a>
                            <a href="#" className="social-icon">
                                <i className="bi bi-linkedin"></i>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="footer-bottom">
                    <div className="footer-bottom-left">
                        <span className="footer-powered">Powered By NepByte</span>
                    </div>
                    <div className="footer-bottom-right">
                        <Link to="/privacy">Privacy Policy</Link>
                        <span className="separator">|</span>
                        <Link to="/terms">Terms & Conditions</Link>
                    </div>
                </div>

                {/* Copyright */}
                <div className="footer-copyright">
                    <p>© {currentYear} {TEAM_NAME}. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
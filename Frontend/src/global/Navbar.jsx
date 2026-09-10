// src/global/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import env_export from '../config/env_export';
import "./assets/css/Navbar.css";

const Navbar = () => {
    const { TEAM_TAG, TEAM_NAME, COLOR_CODE_1 } = env_export;
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('');

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    // Navigation links with their section IDs
    const navLinks = [
        { name: 'Home', id: 'home-hero-section' },
        { name: 'About', id: 'home-about-section' },
        { name: 'Sponsors', id: 'home-sponser-section' },
        { name: 'Gallery', id: 'home-gallery-section' },
        { name: 'Team', id: 'home-team-section' },
        { name: 'Events', id: 'home-event-section' },
        { name: 'Video', id: 'home-video-section' },
        { name: 'Contact', id: 'home-contact-section' },
    ];

    // Smooth scroll to section
    const scrollToSection = (sectionId) => {
        closeMobileMenu();
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

    // Update active section on scroll
    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY + 150;
            
            for (const link of navLinks) {
                const element = document.getElementById(link.id);
                if (element) {
                    const { offsetTop, offsetHeight } = element;
                    const offsetBottom = offsetTop + offsetHeight;

                    if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
                        setActiveSection(link.id);
                        break;
                    }
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className="navbar">
            <div className="container">


                {/* MIDDLE: Navigation Links */}
                <div className={`navbar-right ${isMobileMenuOpen ? 'open' : ''}`}>
                    <ul className="nav-list">
                        {navLinks.map((link) => (
                            <li key={link.id} className="nav-item">
                                <button
                                    className={`nav-link ${activeSection === link.id ? 'active' : ''}`}
                                    onClick={() => scrollToSection(link.id)}
                                >
                                    {link.name}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* RIGHT: Mobile Toggle */}
                <div className="toggle-hamburger-right">
                    <button 
                        className="mobile-toggle" 
                        onClick={toggleMobileMenu}
                        aria-label="Toggle menu"
                    >
                        {isMobileMenuOpen ? (
                            <i className="bi bi-x-lg"></i>
                        ) : (
                            <i className="bi bi-list"></i>
                        )}
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
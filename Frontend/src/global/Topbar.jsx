// src/global/Topbar.jsx
import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import env_export from '../config/env_export';
import "./assets/css/Topbar.css";

const Topbar = ({ isDark, toggleTheme }) => {
    const { 
        TEAM_TAG, 
        TEAM_NAME, 
        TEAM_LOGO_URL,
        COLOR_CODE_1, 
        COLOR_CODE_2 
    } = env_export;

    return (
        <div className="topbar">
            <div className="container">
                {/* LEFT: Logo and Name */}
                <div className="topbar-left">
                    <Link to="/" className="brand-link">
                        <div className="logo-wrapper">
                            <img 
                                src={TEAM_LOGO_URL} 
                                alt={TEAM_NAME}
                                className="topbar-logo"
                                onError={(e) => {
                                    // Fallback to text logo if image fails
                                    e.target.style.display = 'none';
                                    e.target.parentElement.innerHTML = `<span class="logo-text">${TEAM_TAG}</span>`;
                                }}
                            />
                        </div>
                        <div className="brand-text">
                            <span className="brand-tag">
                                {TEAM_TAG}
                            </span>
                            <span className="brand-name">{TEAM_NAME}</span>
                        </div>
                    </Link>
                </div>

                {/* MIDDLE: Navigation Links */}
                <div className="topbar-middle">
                    <nav className="nav-links">
                        <NavLink 
                            to="/" 
                            onClick={() => {window.scrollTo(0,0);}} 
                            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                        >
                            Official
                        </NavLink>
                        <a 
                            href="https://sujan140.com.np" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="nav-link"
                        >
                            Shop
                        </a>
                        <a 
                            href="https://codevoraui.vercel.app" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="nav-link"
                        >
                            Achievements
                        </a>
                    </nav>
                </div>

                {/* RIGHT: Toggle Button */}
                <div className="topbar-right">
                    <button 
                        className="theme-toggle" 
                        onClick={toggleTheme}
                        aria-label="Toggle theme"
                    >
                        {isDark ? <i className="bi bi-brightness-high"></i> : <i className="bi bi-moon"></i>}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Topbar;
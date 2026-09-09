// src/global/Topbar.jsx (Simplified version)
import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import env_export from '../config/env_export';
import "./assets/css/Topbar.css";

const Topbar = ({ isDark, toggleTheme }) => {
    const { 
        TEAM_TAG, 
        TEAM_NAME, 
        COLOR_CODE_1, 
        COLOR_CODE_2 
    } = env_export;

    return (
        <div className="topbar">
            <div className="container">
                {/* LEFT: Logo and Name */}
                <div className="topbar-left">
                    <Link to="/" className="brand-link">
                        <div className="logo-wrapper" style={{ 
                            background: `linear-gradient(135deg, ${COLOR_CODE_1}, ${COLOR_CODE_2})`,
                            border: `2px solid ${COLOR_CODE_1}`
                        }}>
                            <span className="logo-text">{TEAM_TAG}</span>
                        </div>
                        <div className="brand-text">
                            <span className="brand-tag" style={{ color: COLOR_CODE_1 }}>
                                {TEAM_TAG}
                            </span>
                            <span className="brand-name">{TEAM_NAME}</span>
                        </div>
                    </Link>
                </div>

                {/* MIDDLE: Navigation Links */}
                <div className="topbar-middle">
                    <nav className="nav-links">
                        <NavLink to="/" onClick={() => {window.scrollTo(0,0);}} className={({ isActive }) => 
                            `nav-link ${isActive ? 'active' : ''}`
                        }>Official</NavLink>
                        <NavLink to="https://sujan140.com.np" className={({ isActive }) => 
                            `nav-link ${isActive ? 'active' : ''}`
                        }>Shop</NavLink>
                        <NavLink to="https://codevoraui.vercel.app" className={({ isActive }) => 
                            `nav-link ${isActive ? 'active' : ''}`
                        }>Achivements</NavLink>
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
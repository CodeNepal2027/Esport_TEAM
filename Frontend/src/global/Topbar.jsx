// src/global/Topbar.jsx
import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { getOrgConfig } from '../config/org_config';
import "./assets/css/Topbar.css";

const Topbar = ({ isDark, toggleTheme }) => {
    const { 
        team_tag,
        team_name,
        team_logo_url,
        org_shop,
        org_achievements,
    } = getOrgConfig();

    return (
        <div className="topbar">
            <div className="container">
                {/* LEFT: Logo and Name */}
                <div className="topbar-left">
                    <Link to="/" onClick={() => {window.scrollTo(0,0);}} className="brand-link">
                        <div className="logo-wrapper">
                            <img 
                                src={team_logo_url} 
                                alt={team_name}
                                className="topbar-logo"
                                onError={(e) => {
                                    // Fallback to text logo if image fails
                                    e.target.style.display = 'none';
                                    e.target.parentElement.innerHTML = `<span class="logo-text">${team_tag}</span>`;
                                }}
                            />
                        </div>
                        <div className="brand-text">
                            <span className="brand-tag">
                                {team_tag}
                            </span>
                            <span className="brand-name">{team_name}</span>
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
                        {org_shop && (
                            <a 
                                href={org_shop} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="nav-link"
                            >
                                Shop
                            </a>
                        )}
                        {org_achievements && (
                            <a 
                                href={org_achievements} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="nav-link"
                            >
                                Achievements
                            </a>
                        )}
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
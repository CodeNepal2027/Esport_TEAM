// src/routes/components/Home_Team.jsx
import React, { useState } from 'react';
import { getOrgConfig } from '../../config/org_config';
import { useHomeAPI } from '../../home/Home_API_Context';
import "../assets/css/Home_Team.css";

const Home_Team = () => {
    const { team_name, color_code_1, color_code_2 } = getOrgConfig();
    const { team, loading, error, refresh } = useHomeAPI();

    const [selectedMember, setSelectedMember] = useState(null);
    const [roleFilter, setRoleFilter] = useState('all');

    const teamMembers = team || [];
    const roles = ['all', 'IGL', 'Entry', 'Support', 'Anchor', 'Fragger', 'Sniper'];

    const filteredMembers = roleFilter === 'all'
        ? teamMembers
        : teamMembers.filter(member => member.role.includes(roleFilter));

    const openMemberDetail = (member) => {
        setSelectedMember(member);
        document.body.style.overflow = 'hidden';
    };

    const closeMemberDetail = () => {
        setSelectedMember(null);
        document.body.style.overflow = 'auto';
    };

    // Loading
    if (loading && !team) {
        return (
            <section id="home-team-section" className="home-team-section">
                <div className="container">
                    <div className="section-loading">
                        <div className="loading-spinner" style={{ borderColor: color_code_1 }}></div>
                        <p>Loading roster...</p>
                    </div>
                </div>
            </section>
        );
    }

    // Error
    if (error && !team) {
        return (
            <section id="home-team-section" className="home-team-section">
                <div className="container">
                    <div className="section-error">
                        <p>Failed to load team roster</p>
                        <button onClick={refresh} style={{ background: color_code_1, color: '#fff' }}>Retry</button>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section id="home-team-section" className="home-team-section">
            <div className="container">
                <div className="section-header">
                    <span className="section-badge" style={{
                        background: `linear-gradient(135deg, ${color_code_1}, ${color_code_2})`
                    }}>
                        Our Squad
                    </span>
                    <h2 className="section-title">
                        <span style={{ color: color_code_1 }}>Team</span> Roster
                    </h2>
                    <p className="section-subtitle">
                        Meet the warriors of {team_name}
                    </p>
                </div>

                <div className="team-filters">
                    {roles.map((role) => (
                        <button
                            key={role}
                            className={`role-filter-btn ${roleFilter === role ? 'active' : ''}`}
                            onClick={() => setRoleFilter(role)}
                            style={{
                                borderColor: roleFilter === role ? color_code_1 : 'var(--border-color-secondary)',
                                color: roleFilter === role ? color_code_1 : 'var(--font-color-secondary)'
                            }}
                        >
                            {role === 'all' ? 'All' : role}
                        </button>
                    ))}
                </div>

                <div className="team-grid">
                    {filteredMembers.map((member) => (
                        <div key={member.id} className="team-card" onClick={() => openMemberDetail(member)}>
                            <div className="team-card-image-wrapper">
                                <img src={member.image} alt={member.name} className="team-card-image" loading="lazy" />
                                <div className="team-card-status-badge" style={{
                                    background: `linear-gradient(135deg, ${color_code_1}, ${color_code_2})`
                                }}>
                                    <span className="status-dot"></span>
                                    Active
                                </div>
                                <div className="team-card-overlay" style={{
                                    background: `linear-gradient(135deg, ${color_code_1}99, ${color_code_2}99)`
                                }}>
                                    <div className="team-card-overlay-content">
                                        <i className="bi bi-eye" style={{ color: '#fff' }}></i>
                                        <span>View Profile</span>
                                    </div>
                                </div>
                            </div>
                            <div className="team-card-info">
                                <div className="team-card-header">
                                    <h3 className="team-card-name">{member.name}</h3>
                                    <p className="team-card-role" style={{ color: color_code_1 }}>
                                        {member.role}
                                    </p>
                                </div>
                                <p className="team-card-realname">{member.realName}</p>
                                <div className="team-card-social">
                                    <a href={member.instagram} target="_blank" rel="noopener noreferrer" className="social-link" style={{ color: '#E4405F' }}>
                                        <i className="bi bi-instagram"></i>
                                    </a>
                                    <a href={member.tiktok} target="_blank" rel="noopener noreferrer" className="social-link" style={{ color: '#000000' }}>
                                        <i className="bi bi-tiktok"></i>
                                    </a>
                                    <a href={member.youtube} target="_blank" rel="noopener noreferrer" className="social-link" style={{ color: '#FF0000' }}>
                                        <i className="bi bi-youtube"></i>
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="team-cta" style={{
                    background: `linear-gradient(135deg, ${color_code_1}22, ${color_code_2}22)`,
                    border: `1px solid ${color_code_1}44`
                }}>
                    <div className="team-cta-content">
                        <h3>Join the <span style={{ color: color_code_1 }}>Squad</span></h3>
                        <p>Think you have what it takes to join {team_name}?</p>
                        <button className="team-cta-btn" style={{
                            background: `linear-gradient(135deg, ${color_code_1}, ${color_code_2})`,
                            color: 'white'
                        }}>
                            <i className="bi bi-person-plus"></i> Tryout Now
                        </button>
                    </div>
                </div>

                {selectedMember && (
                    <div className="member-modal" onClick={closeMemberDetail}>
                        <div className="member-modal-content" onClick={(e) => e.stopPropagation()}>
                            <button className="member-modal-close" onClick={closeMemberDetail}>
                                <i className="bi bi-x-lg"></i>
                            </button>

                            <div className="member-modal-grid">
                                <div className="member-modal-image">
                                    <img src={selectedMember.image} alt={selectedMember.name} />
                                    <div className="member-modal-status-badge" style={{
                                        background: `linear-gradient(135deg, ${color_code_1}, ${color_code_2})`
                                    }}>
                                        <span className="status-dot"></span>
                                        Active
                                    </div>
                                </div>
                                <div className="member-modal-info">
                                    <div className="member-modal-header">
                                        <h2 style={{ color: color_code_1 }}>{selectedMember.name}</h2>
                                        <span className="member-modal-country">{selectedMember.country}</span>
                                    </div>
                                    <p className="member-modal-realname">{selectedMember.realName}</p>
                                    <p className="member-modal-role" style={{
                                        background: `linear-gradient(135deg, ${color_code_1}, ${color_code_2})`,
                                        color: '#fff'
                                    }}>
                                        {selectedMember.role}
                                    </p>
                                    <div className="member-modal-social-links">
                                        <a href={selectedMember.instagram} target="_blank" rel="noopener noreferrer" className="modal-social-link" style={{ background: '#E4405F' }}>
                                            <i className="bi bi-instagram"></i> Instagram
                                        </a>
                                        <a href={selectedMember.tiktok} target="_blank" rel="noopener noreferrer" className="modal-social-link" style={{ background: '#000000' }}>
                                            <i className="bi bi-tiktok"></i> TikTok
                                        </a>
                                        <a href={selectedMember.youtube} target="_blank" rel="noopener noreferrer" className="modal-social-link" style={{ background: '#FF0000' }}>
                                            <i className="bi bi-youtube"></i> YouTube
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Home_Team;
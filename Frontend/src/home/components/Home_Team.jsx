// src/routes/components/Home_Team.jsx
import React, { useState } from 'react';
import env_export from '../../config/env_export';
import "../assets/css/Home_Team.css";

const Home_Team = () => {
    const { 
        TEAM_TAG, 
        TEAM_NAME, 
        COLOR_CODE_1, 
        COLOR_CODE_2 
    } = env_export;

    const [selectedMember, setSelectedMember] = useState(null);

    // Team members data
    const teamMembers = [
        {
            id: 1,
            name: 'Apex',
            realName: 'John Doe',
            role: 'IGL (In-Game Leader)',
            image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=400&fit=crop',
            instagram: 'https://instagram.com/apex',
            tiktok: 'https://tiktok.com/@apex',
            youtube: 'https://youtube.com/@apex',
            country: '🇺🇸'
        },
        {
            id: 2,
            name: 'Fury',
            realName: 'Mike Johnson',
            role: 'Entry Fragger',
            image: 'https://images.unsplash.com/photo-1511882150382-421056c89033?w=400&h=400&fit=crop',
            instagram: 'https://instagram.com/fury',
            tiktok: 'https://tiktok.com/@fury',
            youtube: 'https://youtube.com/@fury',
            country: '🇬🇧'
        },
        {
            id: 3,
            name: 'Viper',
            realName: 'Sarah Chen',
            role: 'Support',
            image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&h=400&fit=crop',
            instagram: 'https://instagram.com/viper',
            tiktok: 'https://tiktok.com/@viper',
            youtube: 'https://youtube.com/@viper',
            country: '🇨🇳'
        },
        {
            id: 4,
            name: 'Shadow',
            realName: 'Alex Rivera',
            role: 'Anchor',
            image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400&h=400&fit=crop',
            instagram: 'https://instagram.com/shadow',
            tiktok: 'https://tiktok.com/@shadow',
            youtube: 'https://youtube.com/@shadow',
            country: '🇲🇽'
        },
        {
            id: 5,
            name: 'Blaze',
            realName: 'Emma Wilson',
            role: 'Fragger',
            image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=400&fit=crop',
            instagram: 'https://instagram.com/blaze',
            tiktok: 'https://tiktok.com/@blaze',
            youtube: 'https://youtube.com/@blaze',
            country: '🇦🇺'
        },
        {
            id: 6,
            name: 'Storm',
            realName: 'David Kim',
            role: 'Sniper',
            image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=400&fit=crop',
            instagram: 'https://instagram.com/storm',
            tiktok: 'https://tiktok.com/@storm',
            youtube: 'https://youtube.com/@storm',
            country: '🇰🇷'
        },
    ];

    // Filter by role
    const [roleFilter, setRoleFilter] = useState('all');
    const roles = ['all', 'IGL', 'Entry', 'Support', 'Anchor', 'Fragger', 'Sniper'];

    const filteredMembers = roleFilter === 'all' 
        ? teamMembers 
        : teamMembers.filter(member => member.role.includes(roleFilter));

    // Open member detail modal
    const openMemberDetail = (member) => {
        setSelectedMember(member);
        document.body.style.overflow = 'hidden';
    };

    // Close member detail modal
    const closeMemberDetail = () => {
        setSelectedMember(null);
        document.body.style.overflow = 'auto';
    };

    return (
        <section id="home-team" className="home-team">
            <div className="container">
                {/* Section Header */}
                <div className="section-header">
                    <span className="section-badge" style={{ 
                        background: `linear-gradient(135deg, ${COLOR_CODE_1}, ${COLOR_CODE_2})`
                    }}>
                        Our Squad
                    </span>
                    <h2 className="section-title">
                        <span style={{ color: COLOR_CODE_1 }}>Team</span> Roster
                    </h2>
                    <p className="section-subtitle">
                        Meet the warriors of {TEAM_NAME}
                    </p>
                </div>

                {/* Role Filter */}
                <div className="team-filters">
                    {roles.map((role) => (
                        <button
                            key={role}
                            className={`role-filter-btn ${roleFilter === role ? 'active' : ''}`}
                            onClick={() => setRoleFilter(role)}
                            style={{
                                borderColor: roleFilter === role ? COLOR_CODE_1 : 'var(--border-color-secondary)',
                                color: roleFilter === role ? COLOR_CODE_1 : 'var(--font-color-secondary)'
                            }}
                        >
                            {role === 'all' ? 'All' : role}
                        </button>
                    ))}
                </div>

                {/* Team Grid */}
                <div className="team-grid">
                    {filteredMembers.map((member) => (
                        <div 
                            key={member.id} 
                            className="team-card"
                            onClick={() => openMemberDetail(member)}
                        >
                            <div className="team-card-image-wrapper">
                                <img 
                                    src={member.image} 
                                    alt={member.name}
                                    className="team-card-image"
                                    loading="lazy"
                                />
                                <div className="team-card-status-badge" style={{
                                    background: `linear-gradient(135deg, ${COLOR_CODE_1}, ${COLOR_CODE_2})`
                                }}>
                                    <span className="status-dot"></span>
                                    Active
                                </div>
                                <div className="team-card-overlay" style={{
                                    background: `linear-gradient(135deg, ${COLOR_CODE_1}99, ${COLOR_CODE_2}99)`
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
                                    {/* <span className="team-card-country">{member.country}</span> */}
                                    <p className="team-card-role" style={{ color: COLOR_CODE_1 }}>
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

                {/* Join Team CTA */}
                <div className="team-cta" style={{
                    background: `linear-gradient(135deg, ${COLOR_CODE_1}22, ${COLOR_CODE_2}22)`,
                    border: `1px solid ${COLOR_CODE_1}44`
                }}>
                    <div className="team-cta-content">
                        <h3>Join the <span style={{ color: COLOR_CODE_1 }}>Squad</span></h3>
                        <p>Think you have what it takes to join {TEAM_NAME}?</p>
                        <button className="team-cta-btn" style={{
                            background: `linear-gradient(135deg, ${COLOR_CODE_1}, ${COLOR_CODE_2})`,
                            color: '#fff'
                        }}>
                            <i className="bi bi-person-plus"></i> Tryout Now
                        </button>
                    </div>
                </div>

                {/* Member Detail Modal */}
                {selectedMember && (
                    <div className="member-modal" onClick={closeMemberDetail}>
                        <div className="member-modal-content" onClick={(e) => e.stopPropagation()}>
                            <button className="member-modal-close" onClick={closeMemberDetail}>
                                <i className="bi bi-x-lg"></i>
                            </button>
                            
                            <div className="member-modal-grid">
                                <div className="member-modal-image">
                                    <img 
                                        src={selectedMember.image} 
                                        alt={selectedMember.name}
                                    />
                                    <div className="member-modal-status-badge" style={{
                                        background: `linear-gradient(135deg, ${COLOR_CODE_1}, ${COLOR_CODE_2})`
                                    }}>
                                        <span className="status-dot"></span>
                                        Active
                                    </div>
                                </div>
                                <div className="member-modal-info">
                                    <div className="member-modal-header">
                                        <h2 style={{ color: COLOR_CODE_1 }}>{selectedMember.name}</h2>
                                        <span className="member-modal-country">{selectedMember.country}</span>
                                    </div>
                                    <p className="member-modal-realname">{selectedMember.realName}</p>
                                    <p className="member-modal-role" style={{ 
                                        background: `linear-gradient(135deg, ${COLOR_CODE_1}, ${COLOR_CODE_2})`,
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
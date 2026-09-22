// src/home/components/Home_Team.jsx
import React, { useState, useEffect } from 'react';
import { getOrgConfig } from '../../config/org_config';
import { useHomeAPI } from '../../home/Home_API_Context';
import "../assets/css/Home_Team.css";

const getDefaultVisibleCount = () => {
    if (typeof window === 'undefined') return 4;
    const w = window.innerWidth;
    if (w <= 640) return 4;    // mobile  → 2×2
    if (w <= 1024) return 4;   // tablet  → 2×2
    return 4;                  // laptop  → 1×4
};

const Home_Team = () => {
    const { team_name, color_code_1, color_code_2, org_whatsapp } = getOrgConfig();
    const { team, loading, error, refresh } = useHomeAPI();

    const [selectedMember, setSelectedMember] = useState(null);
    const [roleFilter, setRoleFilter] = useState('all');
    const [visibleCount, setVisibleCount] = useState(getDefaultVisibleCount);

    const teamMembers = team ? [...team].reverse() : [];
    const roles = ['all', 'IGL', 'Entry', 'Support', 'Anchor', 'Fragger', 'Sniper'];

    const filteredMembers = roleFilter === 'all'
        ? teamMembers
        : teamMembers.filter(member => member.role.includes(roleFilter));

    // ============================================
    // SLICE — show only visibleCount
    // ============================================
    const visibleMembers = filteredMembers.slice(0, visibleCount);
    const hasMore = filteredMembers.length > visibleCount;
    const hasLess = visibleCount > getDefaultVisibleCount();

    // Build WhatsApp tryout link with a prefilled message
    const whatsappDigits = org_whatsapp
        ? String(org_whatsapp).replace(/[^0-9]/g, '')
        : '';
    const tryoutMessage = encodeURIComponent(
        `Hi ${team_name || 'Team'},\n\nI'd like to try out for the squad. Here's a bit about me:`
    );
    const whatsappTryoutLink = whatsappDigits
        ? `https://wa.me/${whatsappDigits}?text=${tryoutMessage}`
        : null;

    // Recalculate default when viewport crosses a breakpoint
    useEffect(() => {
        const onResize = () => {
            setVisibleCount((prev) => {
                const def = getDefaultVisibleCount();
                return prev <= def ? def : prev;
            });
        };
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);

    // Reset to default when filter changes
    useEffect(() => {
        setVisibleCount(getDefaultVisibleCount());
    }, [roleFilter]);

    const showMore = () => setVisibleCount(filteredMembers.length);

    const showLess = () => {
        setVisibleCount(getDefaultVisibleCount());
        document.getElementById('home-team-section')?.scrollIntoView({ behavior: 'smooth' });
    };

    const openMemberDetail = (member) => {
        setSelectedMember(member);
        document.body.style.overflow = 'hidden';
    };

    const closeMemberDetail = () => {
        setSelectedMember(null);
        document.body.style.overflow = 'auto';
    };

    // Loading — skeleton loader (unchanged)
    if (loading && !team) {
        return (
            <section id="home-team-section" className="home-team-section">
                <div className="container">
                    <div className="section-header">
                        <div className="team-skeleton team-skeleton-badge"></div>
                        <div className="team-skeleton team-skeleton-title"></div>
                        <div className="team-skeleton team-skeleton-subtitle"></div>
                    </div>

                    <div className="team-filters">
                        {roles.map((role) => (
                            <div key={role} className="team-skeleton team-skeleton-filter"></div>
                        ))}
                    </div>

                    <div className="team-grid">
                        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                            <div key={i} className="team-card">
                                <div className="team-card-image-wrapper">
                                    <div className="team-skeleton team-skeleton-image"></div>
                                </div>
                                <div className="team-card-info">
                                    <div className="team-card-header">
                                        <div className="team-skeleton team-skeleton-name"></div>
                                        <div className="team-skeleton team-skeleton-role"></div>
                                    </div>
                                    <div className="team-skeleton team-skeleton-realname"></div>
                                    <div className="team-card-social">
                                        <div className="team-skeleton team-skeleton-social"></div>
                                        <div className="team-skeleton team-skeleton-social"></div>
                                        <div className="team-skeleton team-skeleton-social"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="team-cta">
                        <div className="team-cta-content">
                            <div className="team-skeleton team-skeleton-cta-title"></div>
                            <div className="team-skeleton team-skeleton-cta-text"></div>
                            <div className="team-skeleton team-skeleton-cta-btn"></div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    // Error (unchanged)
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
                    {visibleMembers.map((member) => (
                        <div
                            key={member.id}
                            className="team-card"
                            onClick={() => openMemberDetail(member)}
                            style={{
                                '--card-accent': color_code_1,
                                '--card-accent-soft': `${color_code_1}22`,
                            }}
                        >
                            <div className="team-card-image-wrapper">
                                <img
                                    src={member.image}
                                    alt={member.name}
                                    className="team-card-image"
                                    loading="lazy"
                                />
                                <div className="team-card-status-badge" style={{
                                    background: `linear-gradient(135deg, ${color_code_1}, ${color_code_2})`
                                }}>
                                    <span className="status-dot"></span>
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
                                    {member.instagram && (
                                        <a
                                            href={member.instagram}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="social-link"
                                            style={{ color: '#E4405F' }}
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <i className="bi bi-instagram"></i>
                                        </a>
                                    )}
                                    {member.tiktok && (
                                        <a
                                            href={member.tiktok}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="social-link"
                                            style={{ color: '#000000' }}
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <i className="bi bi-tiktok"></i>
                                        </a>
                                    )}
                                    {member.youtube && (
                                        <a
                                            href={member.youtube}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="social-link"
                                            style={{ color: '#FF0000' }}
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <i className="bi bi-youtube"></i>
                                        </a>
                                    )}
                                    <span className="team-card-view-hint">
                                        View Profile <i className="bi bi-arrow-right"></i>
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ============================================
                    SHOW MORE / SHOW LESS
                   ============================================ */}
                {(hasMore || hasLess) && (
                    <div className="team-actions">
                        {hasMore && (
                            <button
                                className="team-view-btn team-view-more"
                                onClick={showMore}
                                style={{ '--btn-accent': color_code_1 }}
                            >
                                <i className="bi bi-plus-circle"></i>
                                Show More ({filteredMembers.length - visibleCount} remaining)
                            </button>
                        )}
                        {hasLess && (
                            <button
                                className="team-view-btn team-view-less"
                                onClick={showLess}
                                style={{ '--btn-accent': color_code_1 }}
                            >
                                <i className="bi bi-dash-circle"></i>
                                Show Less
                            </button>
                        )}
                    </div>
                )}

                <div className="team-cta" style={{
                    background: `linear-gradient(135deg, ${color_code_1}22, ${color_code_2}22)`,
                    border: `1px solid ${color_code_1}44`
                }}>
                    <div className="team-cta-content">
                        <h3>Join the <span style={{ color: color_code_1 }}>Squad</span></h3>
                        <p>Think you have what it takes to join {team_name}?</p>

                        {whatsappTryoutLink ? (
                            <a
                                href={whatsappTryoutLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="team-cta-btn"
                                style={{
                                    background: `linear-gradient(135deg, ${color_code_1}, ${color_code_2})`,
                                    color: 'white'
                                }}
                            >
                                <i className="bi bi-whatsapp"></i> Tryout Now
                            </a>
                        ) : (
                            <button
                                className="team-cta-btn"
                                style={{
                                    background: `linear-gradient(135deg, ${color_code_1}, ${color_code_2})`,
                                    color: 'white'
                                }}
                            >
                                <i className="bi bi-person-plus"></i> Tryout Now
                            </button>
                        )}
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
                                        {selectedMember.instagram && (
                                            <a href={selectedMember.instagram} target="_blank" rel="noopener noreferrer" className="modal-social-link" style={{ background: '#E4405F' }}>
                                                <i className="bi bi-instagram"></i> Instagram
                                            </a>
                                        )}
                                        {selectedMember.tiktok && (
                                            <a href={selectedMember.tiktok} target="_blank" rel="noopener noreferrer" className="modal-social-link" style={{ background: '#000000' }}>
                                                <i className="bi bi-tiktok"></i> TikTok
                                            </a>
                                        )}
                                        {selectedMember.youtube && (
                                            <a href={selectedMember.youtube} target="_blank" rel="noopener noreferrer" className="modal-social-link" style={{ background: '#FF0000' }}>
                                                <i className="bi bi-youtube"></i> YouTube
                                            </a>
                                        )}
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
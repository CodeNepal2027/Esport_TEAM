// src/home/components/Home_Contact.jsx
import React, { useState } from 'react';
import { getOrgConfig } from '../../config/org_config';
import "../assets/css/Home_Contact.css";

const Home_Contact = ({ loading = false }) => {
    const {
        team_tag,
        team_name,
        color_code_1,
        color_code_2,
        org_email,
        org_phone_1,
        org_phone_2,
        org_whatsapp,
        org_address,
        org_country,
        org_working_day,
        org_working_hour,
        org_youtube_link,
        org_tiktok_link,
        org_instagram_link,
        org_discord_link,
        org_twitter_link,
    } = getOrgConfig();

    const [copied, setCopied] = useState(false);

    const handleCopyEmail = async (e) => {
        e.preventDefault();
        if (!org_email) return;
        try {
            await navigator.clipboard.writeText(org_email);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            window.getSelection()?.selectAllChildren(e.currentTarget);
        }
    };

    const whatsappDigits = org_whatsapp
        ? org_whatsapp.replace(/[^0-9]/g, '')
        : '';

    const hasAnyContact = Boolean(
        org_email ||
        org_whatsapp ||
        org_phone_1 ||
        org_phone_2 ||
        org_address ||
        org_country ||
        org_working_day ||
        org_working_hour
    );

    const hasAnySocial = Boolean(
        org_youtube_link ||
        org_tiktok_link ||
        org_instagram_link ||
        org_discord_link ||
        org_twitter_link
    );

    // ============================================
    // SKELETON — only when explicitly loading
    // ============================================
    if (loading === true) {
        return (
            <section id="home-contact-section" className="home-contact-section">
                <div className="container">
                    <div className="section-header">
                        <div className="contact-skeleton contact-skeleton-badge"></div>
                        <div className="contact-skeleton contact-skeleton-title"></div>
                        <div className="contact-skeleton contact-skeleton-subtitle"></div>
                    </div>

                    <div className="contact-actions-grid">
                        {[0, 1, 2].map((i) => (
                            <div key={i} className="contact-action-card">
                                <div className="contact-skeleton contact-skeleton-icon"></div>
                                <div className="contact-skeleton contact-skeleton-info-title"></div>
                                <div className="contact-skeleton contact-skeleton-info-text"></div>
                                <div className="contact-skeleton contact-skeleton-info-sub"></div>
                            </div>
                        ))}
                    </div>

                    <div className="contact-details-grid">
                        {[0, 1].map((i) => (
                            <div key={i} className="contact-detail-card">
                                <div className="contact-skeleton contact-skeleton-icon"></div>
                                <div className="contact-skeleton contact-skeleton-info-title"></div>
                                <div className="contact-skeleton contact-skeleton-info-text"></div>
                            </div>
                        ))}
                    </div>

                    <div className="contact-social-strip">
                        <div className="contact-skeleton contact-skeleton-social-title"></div>
                        <div className="social-links">
                            {[0, 1, 2, 3, 4].map((i) => (
                                <div key={i} className="contact-skeleton contact-skeleton-social-icon"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    // ============================================
    // REAL CONTENT
    // ============================================
    return (
        <section id="home-contact-section" className="home-contact-section">
            <div className="container">
                {/* Section Header */}
                <div className="section-header">
                    <span className="section-badge" style={{
                        background: `linear-gradient(135deg, ${color_code_1 || '#FF0000'}, ${color_code_2 || '#111111'})`
                    }}>
                        Get In Touch
                    </span>
                    <h2 className="section-title">
                        Let's <span style={{ color: color_code_1 || '#FF0000' }}>Connect</span>
                    </h2>
                    <p className="section-subtitle">
                        Reach out to {team_name || 'us'} — we usually reply within 24 hours
                    </p>
                </div>

                {/* ============================================
                    PRIMARY CTA CARDS — Email / WhatsApp / Call
                   ============================================ */}
                {hasAnyContact && (
                    <div className="contact-actions-grid">
                        {/* Email */}
                        {org_email && (
                            <div
                                className="contact-action-card"
                                style={{
                                    '--card-accent': color_code_1 || '#FF0000',
                                    '--card-accent-soft': `${color_code_1 || '#FF0000'}22`,
                                }}
                            >
                                <span className="contact-card-accent-bar"></span>

                                <div className="contact-action-icon" style={{
                                    background: `linear-gradient(135deg, ${color_code_1 || '#FF0000'}, ${color_code_2 || '#111111'})`
                                }}>
                                    <i className="bi bi-envelope-fill"></i>
                                </div>

                                <div className="contact-action-body">
                                    <h3 className="contact-action-title">Email Us</h3>
                                    <p className="contact-action-value">{org_email}</p>
                                    <p className="contact-action-hint">We'll respond within 24 hours</p>
                                </div>

                                <div className="contact-action-footer">
                                    <a
                                        href={`mailto:${org_email}`}
                                        className="contact-action-btn"
                                        style={{ '--btn-accent': color_code_1 || '#FF0000' }}
                                    >
                                        Send Email <i className="bi bi-arrow-right"></i>
                                    </a>
                                    <button
                                        type="button"
                                        className="contact-copy-btn"
                                        onClick={handleCopyEmail}
                                        title="Copy email"
                                        style={{ '--btn-accent': color_code_1 || '#FF0000' }}
                                    >
                                        <i className={`bi ${copied ? 'bi-check2' : 'bi-clipboard'}`}></i>
                                        {copied ? 'Copied' : 'Copy'}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* WhatsApp */}
                        {org_whatsapp && (
                            <div
                                className="contact-action-card"
                                style={{
                                    '--card-accent': '#25D366',
                                    '--card-accent-soft': '#25D36622',
                                }}
                            >
                                <span className="contact-card-accent-bar"></span>

                                <div className="contact-action-icon" style={{
                                    background: 'linear-gradient(135deg, #25D366, #128C7E)'
                                }}>
                                    <i className="bi bi-whatsapp"></i>
                                </div>

                                <div className="contact-action-body">
                                    <h3 className="contact-action-title">WhatsApp</h3>
                                    <p className="contact-action-value">{org_whatsapp}</p>
                                    <p className="contact-action-hint">Fastest way to reach the team</p>
                                </div>

                                <div className="contact-action-footer">
                                    <a
                                        href={`https://wa.me/${whatsappDigits}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="contact-action-btn"
                                        style={{ '--btn-accent': '#25D366' }}
                                    >
                                        Chat Now <i className="bi bi-arrow-right"></i>
                                    </a>
                                </div>
                            </div>
                        )}

                        {/* Call */}
                        {(org_phone_1 || org_phone_2) && (
                            <div
                                className="contact-action-card"
                                style={{
                                    '--card-accent': color_code_2 || '#111111',
                                    '--card-accent-soft': `${color_code_2 || '#111111'}22`,
                                }}
                            >
                                <span className="contact-card-accent-bar"></span>

                                <div className="contact-action-icon" style={{
                                    background: `linear-gradient(135deg, ${color_code_2 || '#111111'}, ${color_code_1 || '#FF0000'})`
                                }}>
                                    <i className="bi bi-telephone-fill"></i>
                                </div>

                                <div className="contact-action-body">
                                    <h3 className="contact-action-title">Call Us</h3>
                                    {org_phone_1 && (
                                        <p className="contact-action-value">{org_phone_1}</p>
                                    )}
                                    {org_phone_2 && (
                                        <p className="contact-action-value">{org_phone_2}</p>
                                    )}
                                    <p className="contact-action-hint">Available during working hours</p>
                                </div>

                                <div className="contact-action-footer">
                                    {org_phone_1 && (
                                        <a
                                            href={`tel:${org_phone_1}`}
                                            className="contact-action-btn"
                                            style={{ '--btn-accent': color_code_1 || '#FF0000' }}
                                        >
                                            <i className="bi bi-telephone"></i> Call
                                        </a>
                                    )}
                                    {org_phone_2 && !org_phone_1 && (
                                        <a
                                            href={`tel:${org_phone_2}`}
                                            className="contact-action-btn"
                                            style={{ '--btn-accent': color_code_1 || '#FF0000' }}
                                        >
                                            <i className="bi bi-telephone"></i> Call
                                        </a>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* ============================================
                    DETAILS — Location + Hours
                   ============================================ */}
                {(org_address || org_country || org_working_day || org_working_hour) && (
                    <div className="contact-details-grid">
                        {(org_address || org_country) && (
                            <div className="contact-detail-card">
                                <div className="contact-detail-icon" style={{ color: color_code_1 || '#FF0000' }}>
                                    <i className="bi bi-geo-alt-fill"></i>
                                </div>
                                <div className="contact-detail-body">
                                    <h4>Location</h4>
                                    <p>
                                        {org_address}
                                        {org_address && org_country ? ', ' : ''}
                                        {org_country}
                                    </p>
                                    <span>Visit us anytime</span>
                                </div>
                            </div>
                        )}

                        {(org_working_day || org_working_hour) && (
                            <div className="contact-detail-card">
                                <div className="contact-detail-icon" style={{ color: color_code_1 || '#FF0000' }}>
                                    <i className="bi bi-clock-fill"></i>
                                </div>
                                <div className="contact-detail-body">
                                    <h4>Working Hours</h4>
                                    <p>{org_working_hour}</p>
                                    <span>{org_working_day}</span>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* ============================================
                    SOCIAL STRIP
                   ============================================ */}
                {hasAnySocial && (
                    <div className="contact-social-strip">
                        <h4>
                            Follow <span style={{ color: color_code_1 || '#FF0000' }}>{team_tag || 'Us'}</span>
                        </h4>
                        <div className="social-links">
                            {org_twitter_link && (
                                <a
                                    href={org_twitter_link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="social-icon"
                                    style={{ '--social-color': '#1DA1F2' }}
                                    title="Twitter"
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
                                    style={{ '--social-color': '#E4405F' }}
                                    title="Instagram"
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
                                    style={{ '--social-color': '#FF0000' }}
                                    title="YouTube"
                                >
                                    <i className="bi bi-youtube"></i>
                                </a>
                            )}
                            {org_discord_link && (
                                <a
                                    href={org_discord_link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="social-icon"
                                    style={{ '--social-color': '#5865F2' }}
                                    title="Discord"
                                >
                                    <i className="bi bi-discord"></i>
                                </a>
                            )}
                            {org_tiktok_link && (
                                <a
                                    href={org_tiktok_link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="social-icon"
                                    style={{ '--social-color': '#000000' }}
                                    title="TikTok"
                                >
                                    <i className="bi bi-tiktok"></i>
                                </a>
                            )}
                        </div>
                    </div>
                )}

                {/* Debug fallback: if nothing renders, show a note */}
                {!hasAnyContact && !hasAnySocial && (
                    <p style={{
                        textAlign: 'center',
                        color: 'var(--font-color-muted)',
                        padding: '24px'
                    }}>
                        Contact information is being updated. Please check back soon.
                    </p>
                )}
            </div>
        </section>
    );
};

export default Home_Contact;
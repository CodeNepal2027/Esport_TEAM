// src/home/components/Home_Event.jsx
import React, { useState, useEffect } from 'react';
import { getOrgConfig } from '../../config/org_config';
import { useHomeAPI } from '../../home/Home_API_Context';
import "../assets/css/Home_Event.css";

// ============================================
// DEFAULT VISIBLE COUNT
// laptop : 4 (1 row)
// tablet : 4 (2×2)
// mobile : 4 (2×2)
// ============================================
const getDefaultVisibleCount = () => {
    if (typeof window === 'undefined') return 4;
    const w = window.innerWidth;
    if (w <= 640) return 4;
    if (w <= 1024) return 4;
    return 4;
};

// ============================================
// DATE HELPERS — auto-detect status
// Handles:
//   "Dec 15-20, 2026"  → start Dec 15, end Dec 20
//   "Nov 02, 2026"     → start Nov 02, end Nov 02
//   "Dec 15, 2026 - Dec 20, 2026" → start/end explicit
// Returns { start: Date, end: Date } or null
// ============================================
const parseEventRange = (dateStr) => {
    if (!dateStr) return null;

    const cleaned = String(dateStr).trim();

    // Explicit full range: "MMM DD, YYYY - MMM DD, YYYY"
    const fullRange = cleaned.match(
        /^([A-Za-z]+)\s+(\d{1,2}),\s*(\d{4})\s*-\s*([A-Za-z]+)\s+(\d{1,2}),\s*(\d{4})$/
    );
    if (fullRange) {
        const [, sm, sd, sy, em, ed, ey] = fullRange;
        const start = new Date(`${sm} ${sd}, ${sy}`);
        const end = new Date(`${em} ${ed}, ${ey}`);
        if (isNaN(start.getTime()) || isNaN(end.getTime())) return null;
        return { start, end };
    }

    // Short range in same month: "MMM DD-DD, YYYY"
    const shortRange = cleaned.match(
        /^([A-Za-z]+)\s+(\d{1,2})\s*-\s*(\d{1,2}),\s*(\d{4})$/
    );
    if (shortRange) {
        const [, month, startDay, endDay, year] = shortRange;
        const start = new Date(`${month} ${startDay}, ${year}`);
        const end = new Date(`${month} ${endDay}, ${year}`);
        if (isNaN(start.getTime()) || isNaN(end.getTime())) return null;
        return { start, end };
    }

    // Single: "MMM DD, YYYY"
    const single = cleaned.match(
        /^([A-Za-z]+)\s+(\d{1,2}),\s*(\d{4})$/
    );
    if (single) {
        const d = new Date(cleaned);
        if (isNaN(d.getTime())) return null;
        return { start: d, end: d };
    }

    // Fallback
    const d = new Date(cleaned);
    if (isNaN(d.getTime())) return null;
    return { start: d, end: d };
};

// ============================================
// AUTO STATUS
//   now < start         → upcoming
//   start ≤ now ≤ end   → ongoing
//   now > end           → completed
//   no valid date       → null (keep original)
// ============================================
const getAutoStatus = (event) => {
    const range = parseEventRange(event?.date);
    if (!range) return null;

    const now = Date.now();

    const startMs = new Date(range.start).setHours(0, 0, 0, 0);
    const endMs = new Date(range.end).setHours(23, 59, 59, 999);

    if (now < startMs) return 'upcoming';
    if (now > endMs) return 'completed';
    return 'ongoing';
};

const Home_Event = () => {
    const { team_name, color_code_1, color_code_2 } = getOrgConfig();
    const { events, loading, error, refresh } = useHomeAPI();

    const [selectedEvent, setSelectedEvent] = useState(null);
    const [statusFilter, setStatusFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [visibleCount, setVisibleCount] = useState(getDefaultVisibleCount);

    // ============================================
    // Build list: reverse (newest first) + auto-status override
    // ============================================
    const allEvents = events
        ? [...events]
              .reverse()
              .map((event) => {
                  const auto = getAutoStatus(event);
                  return auto ? { ...event, status: auto } : event;
              })
        : [];

    const statuses = ['all', 'upcoming', 'ongoing', 'completed'];
    const categories = ['all', 'tournament', 'qualifier', 'fan_meet', 'community', 'showmatch', 'expo'];

    const filteredEvents = allEvents.filter(event => {
        const statusMatch = statusFilter === 'all' || event.status === statusFilter;
        const categoryMatch = categoryFilter === 'all' || event.category === categoryFilter;
        return statusMatch && categoryMatch;
    });

    // ============================================
    // VISIBLE SLICE
    // ============================================
    const visibleEvents = filteredEvents.slice(0, visibleCount);
    const hasMore = filteredEvents.length > visibleCount;
    const hasLess = visibleCount > getDefaultVisibleCount();

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

    // Reset to default when a filter changes
    useEffect(() => {
        setVisibleCount(getDefaultVisibleCount());
    }, [statusFilter, categoryFilter]);

    const showMore = () => setVisibleCount(filteredEvents.length);
    const showLess = () => {
        setVisibleCount(getDefaultVisibleCount());
        document.getElementById('home-event-section')?.scrollIntoView({ behavior: 'smooth' });
    };

    const getStatusLabel = (status) => ({
        'upcoming': 'Upcoming',
        'ongoing': 'Ongoing',
        'completed': 'Completed'
    }[status] || status);

    const getStatusColor = (status) => ({
        'upcoming': color_code_2,
        'ongoing': '#FFA500',
        'completed': '#888'
    }[status] || '#888');

    const getCategoryLabel = (cat) => ({
        'tournament': 'Tournament',
        'qualifier': 'Qualifier',
        'fan_meet': 'Fan Meet',
        'community': 'Community',
        'showmatch': 'Showmatch',
        'expo': 'Expo'
    }[cat] || cat);

    const openEventDetail = (event) => {
        setSelectedEvent(event);
        document.body.style.overflow = 'hidden';
    };

    const closeEventDetail = () => {
        setSelectedEvent(null);
        document.body.style.overflow = 'auto';
    };

    // Loading — skeleton loader
    if (loading && !events) {
        return (
            <section id="home-event-section" className="home-event-section">
                <div className="container">
                    <div className="section-header">
                        <div className="event-skeleton event-skeleton-badge"></div>
                        <div className="event-skeleton event-skeleton-title"></div>
                        <div className="event-skeleton event-skeleton-subtitle"></div>
                    </div>

                    <div className="event-filters">
                        <div className="filter-group">
                            <div className="event-skeleton event-skeleton-filter-label"></div>
                            {statuses.map((status) => (
                                <div key={status} className="event-skeleton event-skeleton-filter"></div>
                            ))}
                        </div>
                        <div className="filter-group">
                            <div className="event-skeleton event-skeleton-filter-label"></div>
                            {categories.map((cat) => (
                                <div key={cat} className="event-skeleton event-skeleton-filter"></div>
                            ))}
                        </div>
                    </div>

                    <div className="event-grid">
                        {[0, 1, 2, 3].map((i) => (
                            <div key={i} className="event-card">
                                <div className="event-image-wrapper">
                                    <div className="event-skeleton event-skeleton-image"></div>
                                </div>
                                <div className="event-info">
                                    <div className="event-skeleton event-skeleton-event-title"></div>
                                    <div className="event-skeleton event-skeleton-event-title event-skeleton-event-title-short"></div>
                                    <div className="event-skeleton event-skeleton-desc"></div>
                                    <div className="event-meta">
                                        <div className="event-skeleton event-skeleton-meta"></div>
                                        <div className="event-skeleton event-skeleton-meta"></div>
                                    </div>
                                    <div className="event-footer">
                                        <div className="event-skeleton event-skeleton-prize"></div>
                                        <div className="event-skeleton event-skeleton-tag"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (error && !events) {
        return (
            <section id="home-event-section" className="home-event-section">
                <div className="container">
                    <div className="section-error">
                        <p>Failed to load events</p>
                        <button onClick={refresh} style={{ background: color_code_1, color: '#fff' }}>Retry</button>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section id="home-event-section" className="home-event-section">
            <div className="container">
                <div className="section-header">
                    <span className="section-badge" style={{
                        background: `linear-gradient(135deg, ${color_code_1}, ${color_code_2})`
                    }}>
                        Upcoming & Past
                    </span>
                    <h2 className="section-title">
                        <span style={{ color: color_code_1 }}>Events</span> & Tournaments
                    </h2>
                    <p className="section-subtitle">
                        Stay updated with all {team_name} events and tournaments
                    </p>
                </div>

                <div className="event-filters">
                    <div className="filter-group">
                        <span className="filter-label">Status:</span>
                        {statuses.map((status) => (
                            <button
                                key={status}
                                className={`filter-btn ${statusFilter === status ? 'active' : ''}`}
                                onClick={() => setStatusFilter(status)}
                                style={{
                                    borderColor: statusFilter === status ? color_code_1 : 'var(--border-color-secondary)',
                                    color: statusFilter === status ? color_code_1 : 'var(--font-color-secondary)'
                                }}
                            >
                                {status === 'all' ? 'All' : getStatusLabel(status)}
                            </button>
                        ))}
                    </div>

                    <div className="filter-group">
                        <span className="filter-label">Category:</span>
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                className={`filter-btn ${categoryFilter === cat ? 'active' : ''}`}
                                onClick={() => setCategoryFilter(cat)}
                                style={{
                                    borderColor: categoryFilter === cat ? color_code_1 : 'var(--border-color-secondary)',
                                    color: categoryFilter === cat ? color_code_1 : 'var(--font-color-secondary)'
                                }}
                            >
                                {cat === 'all' ? 'All' : getCategoryLabel(cat)}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="event-grid">
                    {visibleEvents.length > 0 ? (
                        visibleEvents.map((event) => (
                            <div
                                key={event.id}
                                className="event-card"
                                onClick={() => openEventDetail(event)}
                                style={{
                                    '--card-accent': color_code_1,
                                    '--card-accent-soft': `${color_code_1}22`,
                                    border: `2px solid ${color_code_1}22`
                                }}
                            >
                                <div className="event-image-wrapper">
                                    <img src={event.image} alt={event.title} className="event-image" loading="lazy" />
                                    {/* Rank-style top accent */}
                                    <span className="event-card-accent-bar"></span>
                                    <div className="event-status-badge" style={{
                                        background: getStatusColor(event.status),
                                        color: '#fff'
                                    }}>
                                        {getStatusLabel(event.status)}
                                    </div>
                                    {/* Hover overlay hint */}
                                    <div className="event-card-overlay" style={{
                                        background: `linear-gradient(135deg, ${color_code_1}99, ${color_code_2}99)`
                                    }}>
                                        <div className="event-card-overlay-content">
                                            <i className="bi bi-info-circle" style={{ color: '#fff' }}></i>
                                            <span>View Details</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="event-info">
                                    <h3 className="event-title">{event.title}</h3>
                                    {/* Short single-line preview — full text shown in modal */}
                                    <p className="event-description">
                                        {event.description?.length > 45
                                            ? event.description.substring(0, 45).trim() + '…'
                                            : event.description}
                                    </p>
                                    <div className="event-meta">
                                        <span className="event-date">
                                            <i className="bi bi-calendar3"></i> {event.date}
                                        </span>
                                        <span className="event-location">
                                            <i className="bi bi-geo-alt"></i> {event.location}
                                        </span>
                                    </div>
                                    <div className="event-footer">
                                        <span className="event-prize" style={{ color: color_code_1 }}>
                                            <i className="bi bi-trophy"></i> {event.prizePool}
                                        </span>
                                        <span className="event-category-tag" style={{
                                            background: `linear-gradient(135deg, ${color_code_1}, ${color_code_2})`,
                                            color: '#fff'
                                        }}>
                                            {getCategoryLabel(event.category)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="event-empty">
                            <i className="bi bi-calendar2-event" style={{ color: color_code_1 }}></i>
                            <p>No events found matching your filters.</p>
                        </div>
                    )}
                </div>

                {/* ============================================
                    SHOW MORE / SHOW LESS
                   ============================================ */}
                {(hasMore || hasLess) && (
                    <div className="event-actions">
                        {hasMore && (
                            <button
                                className="event-view-btn event-view-more"
                                onClick={showMore}
                                style={{ '--btn-accent': color_code_1 }}
                            >
                                <i className="bi bi-plus-circle"></i>
                                Show More ({filteredEvents.length - visibleCount} remaining)
                            </button>
                        )}
                        {hasLess && (
                            <button
                                className="event-view-btn event-view-less"
                                onClick={showLess}
                                style={{ '--btn-accent': color_code_1 }}
                            >
                                <i className="bi bi-dash-circle"></i>
                                Show Less
                            </button>
                        )}
                    </div>
                )}

                {selectedEvent && (
                    <div className="event-modal" onClick={closeEventDetail}>
                        <div className="event-modal-content" onClick={(e) => e.stopPropagation()}>
                            <button className="event-modal-close" onClick={closeEventDetail}>
                                <i className="bi bi-x-lg"></i>
                            </button>

                            <div className="event-modal-image">
                                <img src={selectedEvent.image} alt={selectedEvent.title} />
                                <div className="event-modal-status" style={{ background: getStatusColor(selectedEvent.status) }}>
                                    {getStatusLabel(selectedEvent.status)}
                                </div>
                            </div>

                            <div className="event-modal-info">
                                <h2 style={{ color: color_code_1 }}>{selectedEvent.title}</h2>
                                {/* Full description shown here */}
                                <p className="event-modal-description">{selectedEvent.description}</p>

                                <div className="event-modal-details">
                                    <div className="event-modal-detail">
                                        <i className="bi bi-calendar3" style={{ color: color_code_1 }}></i>
                                        <div>
                                            <span className="detail-label">Date</span>
                                            <span className="detail-value">{selectedEvent.date}</span>
                                        </div>
                                    </div>
                                    <div className="event-modal-detail">
                                        <i className="bi bi-geo-alt" style={{ color: color_code_1 }}></i>
                                        <div>
                                            <span className="detail-label">Location</span>
                                            <span className="detail-value">{selectedEvent.location}</span>
                                        </div>
                                    </div>
                                    <div className="event-modal-detail">
                                        <i className="bi bi-trophy" style={{ color: color_code_1 }}></i>
                                        <div>
                                            <span className="detail-label">Prize Pool</span>
                                            <span className="detail-value">{selectedEvent.prizePool}</span>
                                        </div>
                                    </div>
                                    <div className="event-modal-detail">
                                        <i className="bi bi-tag" style={{ color: color_code_1 }}></i>
                                        <div>
                                            <span className="detail-label">Category</span>
                                            <span className="detail-value">{getCategoryLabel(selectedEvent.category)}</span>
                                        </div>
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

export default Home_Event;
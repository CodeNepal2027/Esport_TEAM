// src/routes/components/Home_Event.jsx
import React, { useState } from 'react';
import env_export from '../../config/env_export';
import "../assets/css/Home_Event.css";

const Home_Event = () => {
    const { 
        TEAM_TAG, 
        TEAM_NAME, 
        COLOR_CODE_1, 
        COLOR_CODE_2 
    } = env_export;

    const [selectedEvent, setSelectedEvent] = useState(null);

    // Events data
    const events = [
        {
            id: 1,
            title: 'World Championship 2026',
            description: 'The biggest esports tournament of the year featuring top teams from around the world competing for the championship title.',
            image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=500&fit=crop',
            date: 'Dec 15-20, 2026',
            location: 'Seoul, South Korea',
            prizePool: '$2,000,000',
            status: 'upcoming',
            category: 'tournament'
        },
        {
            id: 2,
            title: 'Regional Qualifiers',
            description: 'Regional qualifiers to determine which teams will advance to the World Championship. Hosted across multiple regions.',
            image: 'https://images.unsplash.com/photo-1511882150382-421056c89033?w=800&h=500&fit=crop',
            date: 'Nov 10-25, 2026',
            location: 'Multiple Regions',
            prizePool: '$500,000',
            status: 'ongoing',
            category: 'qualifier'
        },
        {
            id: 3,
            title: 'Fan Fest 2026',
            description: 'A massive fan gathering with meet & greet sessions, merchandise stalls, and live matches. Come meet your favorite players!',
            image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=500&fit=crop',
            date: 'Dec 18, 2026',
            location: 'Seoul, South Korea',
            prizePool: 'Free Entry',
            status: 'upcoming',
            category: 'fan_meet'
        },
        {
            id: 4,
            title: 'Winter Showdown',
            description: 'Annual winter tournament featuring the top 8 teams battling it out in a double-elimination format.',
            image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=500&fit=crop',
            date: 'Jan 5-10, 2027',
            location: 'London, UK',
            prizePool: '$1,000,000',
            status: 'upcoming',
            category: 'tournament'
        },
        {
            id: 5,
            title: 'Spring Championship',
            description: 'The spring championship marks the beginning of the competitive season with intense matches and rising talents.',
            image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&h=500&fit=crop',
            date: 'Mar 1-10, 2026',
            location: 'Los Angeles, USA',
            prizePool: '$750,000',
            status: 'completed',
            category: 'tournament'
        },
        {
            id: 6,
            title: 'Community Cup',
            description: 'Community-driven tournament where amateur teams get a chance to compete against professional players.',
            image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=500&fit=crop',
            date: 'Oct 5-8, 2026',
            location: 'Berlin, Germany',
            prizePool: '$100,000',
            status: 'completed',
            category: 'community'
        },
        {
            id: 7,
            title: 'Showmatch All-Stars',
            description: 'Celebrity showmatch featuring popular streamers and content creators competing for charity.',
            image: 'https://images.unsplash.com/photo-1517594422361-5eeb8ae275a9?w=800&h=500&fit=crop',
            date: 'Nov 28, 2026',
            location: 'Online',
            prizePool: 'Charity',
            status: 'ongoing',
            category: 'showmatch'
        },
        {
            id: 8,
            title: 'Summer Clash',
            description: 'Summer tournament with the biggest prize pool of the year, featuring the top 16 teams worldwide.',
            image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&h=500&fit=crop',
            date: 'Jul 15-25, 2026',
            location: 'Tokyo, Japan',
            prizePool: '$3,000,000',
            status: 'completed',
            category: 'tournament'
        },
        {
            id: 9,
            title: 'Gaming Expo 2026',
            description: 'Annual gaming expo where teams showcase their skills, new products are unveiled, and fans connect.',
            image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=500&fit=crop',
            date: 'Sep 20-22, 2026',
            location: 'New York, USA',
            prizePool: 'Free Entry',
            status: 'upcoming',
            category: 'expo'
        },
    ];

    // Filter states
    const [statusFilter, setStatusFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('all');

    const statuses = ['all', 'upcoming', 'ongoing', 'completed'];
    const categories = ['all', 'tournament', 'qualifier', 'fan_meet', 'community', 'showmatch', 'expo'];

    const filteredEvents = events.filter(event => {
        const statusMatch = statusFilter === 'all' || event.status === statusFilter;
        const categoryMatch = categoryFilter === 'all' || event.category === categoryFilter;
        return statusMatch && categoryMatch;
    });

    const getStatusLabel = (status) => {
        const labels = {
            'upcoming': 'Upcoming',
            'ongoing': 'Ongoing',
            'completed': 'Completed'
        };
        return labels[status] || status;
    };

    const getStatusColor = (status) => {
        const colors = {
            'upcoming': COLOR_CODE_2,
            'ongoing': '#FFA500',
            'completed': '#888'
        };
        return colors[status] || '#888';
    };

    const getCategoryLabel = (cat) => {
        const labels = {
            'tournament': 'Tournament',
            'qualifier': 'Qualifier',
            'fan_meet': 'Fan Meet',
            'community': 'Community',
            'showmatch': 'Showmatch',
            'expo': 'Expo'
        };
        return labels[cat] || cat;
    };

    // Open event modal
    const openEventDetail = (event) => {
        setSelectedEvent(event);
        document.body.style.overflow = 'hidden';
    };

    // Close event modal
    const closeEventDetail = () => {
        setSelectedEvent(null);
        document.body.style.overflow = 'auto';
    };

    return (
        <section id="home-event" className="home-event">
            <div className="container">
                {/* Section Header */}
                <div className="section-header">
                    <span className="section-badge" style={{ 
                        background: `linear-gradient(135deg, ${COLOR_CODE_1}, ${COLOR_CODE_2})`
                    }}>
                        Upcoming & Past
                    </span>
                    <h2 className="section-title">
                        <span style={{ color: COLOR_CODE_1 }}>Events</span> & Tournaments
                    </h2>
                    <p className="section-subtitle">
                        Stay updated with all {TEAM_NAME} events and tournaments
                    </p>
                </div>

                {/* Filters */}
                <div className="event-filters">
                    <div className="filter-group">
                        <span className="filter-label">Status:</span>
                        {statuses.map((status) => (
                            <button
                                key={status}
                                className={`filter-btn ${statusFilter === status ? 'active' : ''}`}
                                onClick={() => setStatusFilter(status)}
                                style={{
                                    borderColor: statusFilter === status ? COLOR_CODE_1 : 'var(--border-color-secondary)',
                                    color: statusFilter === status ? COLOR_CODE_1 : 'var(--font-color-secondary)'
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
                                    borderColor: categoryFilter === cat ? COLOR_CODE_1 : 'var(--border-color-secondary)',
                                    color: categoryFilter === cat ? COLOR_CODE_1 : 'var(--font-color-secondary)'
                                }}
                            >
                                {cat === 'all' ? 'All' : getCategoryLabel(cat)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Event Grid */}
                <div className="event-grid">
                    {filteredEvents.length > 0 ? (
                        filteredEvents.map((event) => (
                            <div 
                                key={event.id} 
                                className="event-card"
                                onClick={() => openEventDetail(event)}
                                style={{
                                    border: `2px solid ${COLOR_CODE_1}22`
                                }}
                            >
                                <div className="event-image-wrapper">
                                    <img 
                                        src={event.image} 
                                        alt={event.title}
                                        className="event-image"
                                        loading="lazy"
                                    />
                                    <div className="event-status-badge" style={{
                                        background: getStatusColor(event.status),
                                        color: event.status === 'completed' ? '#fff' : '#fff'
                                    }}>
                                        {getStatusLabel(event.status)}
                                    </div>
                                </div>
                                <div className="event-info">
                                    <h3 className="event-title">{event.title}</h3>
                                    <p className="event-description">
                                        {event.description.length > 60 
                                            ? event.description.substring(0, 60) + '...' 
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
                                        <span className="event-prize" style={{ color: COLOR_CODE_1 }}>
                                            <i className="bi bi-trophy"></i> {event.prizePool}
                                        </span>
                                        <span className="event-category-tag" style={{
                                            background: `linear-gradient(135deg, ${COLOR_CODE_1}, ${COLOR_CODE_2})`,
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
                            <i className="bi bi-calendar2-event" style={{ color: COLOR_CODE_1 }}></i>
                            <p>No events found matching your filters.</p>
                        </div>
                    )}
                </div>

                {/* Event Detail Modal */}
                {selectedEvent && (
                    <div className="event-modal" onClick={closeEventDetail}>
                        <div className="event-modal-content" onClick={(e) => e.stopPropagation()}>
                            <button className="event-modal-close" onClick={closeEventDetail}>
                                <i className="bi bi-x-lg"></i>
                            </button>
                            
                            <div className="event-modal-image">
                                <img 
                                    src={selectedEvent.image} 
                                    alt={selectedEvent.title}
                                />
                                <div className="event-modal-status" style={{
                                    background: getStatusColor(selectedEvent.status)
                                }}>
                                    {getStatusLabel(selectedEvent.status)}
                                </div>
                            </div>
                            
                            <div className="event-modal-info">
                                <h2 style={{ color: COLOR_CODE_1 }}>{selectedEvent.title}</h2>
                                <p className="event-modal-description">{selectedEvent.description}</p>
                                
                                <div className="event-modal-details">
                                    <div className="event-modal-detail">
                                        <i className="bi bi-calendar3" style={{ color: COLOR_CODE_1 }}></i>
                                        <div>
                                            <span className="detail-label">Date</span>
                                            <span className="detail-value">{selectedEvent.date}</span>
                                        </div>
                                    </div>
                                    <div className="event-modal-detail">
                                        <i className="bi bi-geo-alt" style={{ color: COLOR_CODE_1 }}></i>
                                        <div>
                                            <span className="detail-label">Location</span>
                                            <span className="detail-value">{selectedEvent.location}</span>
                                        </div>
                                    </div>
                                    <div className="event-modal-detail">
                                        <i className="bi bi-trophy" style={{ color: COLOR_CODE_1 }}></i>
                                        <div>
                                            <span className="detail-label">Prize Pool</span>
                                            <span className="detail-value">{selectedEvent.prizePool}</span>
                                        </div>
                                    </div>
                                    <div className="event-modal-detail">
                                        <i className="bi bi-tag" style={{ color: COLOR_CODE_1 }}></i>
                                        <div>
                                            <span className="detail-label">Category</span>
                                            <span className="detail-value">{getCategoryLabel(selectedEvent.category)}</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <button className="event-modal-btn" style={{
                                    background: `linear-gradient(135deg, ${COLOR_CODE_1}, ${COLOR_CODE_2})`,
                                    color: '#fff'
                                }}>
                                    <i className="bi bi-ticket"></i> Get Tickets
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Home_Event;
// // src/home/components/Home_Event.jsx
// import React, { useState } from 'react';
// import { getOrgConfig } from '../../config/org_config';
// import { useHomeAPI } from '../../home/Home_API_Context';
// import "../assets/css/Home_Event.css";

// const Home_Event = () => {
//     const { team_name, color_code_1, color_code_2 } = getOrgConfig();
//     const { events, loading, error, refresh } = useHomeAPI();

//     const [selectedEvent, setSelectedEvent] = useState(null);
//     const [statusFilter, setStatusFilter] = useState('all');
//     const [categoryFilter, setCategoryFilter] = useState('all');

//     const allEvents = events || [];
//     const statuses = ['all', 'upcoming', 'ongoing', 'completed'];
//     const categories = ['all', 'tournament', 'qualifier', 'fan_meet', 'community', 'showmatch', 'expo'];

//     const filteredEvents = allEvents.filter(event => {
//         const statusMatch = statusFilter === 'all' || event.status === statusFilter;
//         const categoryMatch = categoryFilter === 'all' || event.category === categoryFilter;
//         return statusMatch && categoryMatch;
//     });

//     const getStatusLabel = (status) => ({
//         'upcoming': 'Upcoming',
//         'ongoing': 'Ongoing',
//         'completed': 'Completed'
//     }[status] || status);

//     const getStatusColor = (status) => ({
//         'upcoming': color_code_2,
//         'ongoing': '#FFA500',
//         'completed': '#888'
//     }[status] || '#888');

//     const getCategoryLabel = (cat) => ({
//         'tournament': 'Tournament',
//         'qualifier': 'Qualifier',
//         'fan_meet': 'Fan Meet',
//         'community': 'Community',
//         'showmatch': 'Showmatch',
//         'expo': 'Expo'
//     }[cat] || cat);

//     const openEventDetail = (event) => {
//         setSelectedEvent(event);
//         document.body.style.overflow = 'hidden';
//     };

//     const closeEventDetail = () => {
//         setSelectedEvent(null);
//         document.body.style.overflow = 'auto';
//     };

//     // Loading
//     if (loading && !events) {
//         return (
//             <section id="home-event-section" className="home-event-section">
//                 <div className="container">
//                     <div className="section-loading">
//                         <div className="loading-spinner" style={{ borderColor: color_code_1 }}></div>
//                         <p>Loading events...</p>
//                     </div>
//                 </div>
//             </section>
//         );
//     }

//     // Error
//     if (error && !events) {
//         return (
//             <section id="home-event-section" className="home-event-section">
//                 <div className="container">
//                     <div className="section-error">
//                         <p>Failed to load events</p>
//                         <button onClick={refresh} style={{ background: color_code_1, color: '#fff' }}>Retry</button>
//                     </div>
//                 </div>
//             </section>
//         );
//     }

//     return (
//         <section id="home-event-section" className="home-event-section">
//             <div className="container">
//                 <div className="section-header">
//                     <span className="section-badge" style={{
//                         background: `linear-gradient(135deg, ${color_code_1}, ${color_code_2})`
//                     }}>
//                         Upcoming & Past
//                     </span>
//                     <h2 className="section-title">
//                         <span style={{ color: color_code_1 }}>Events</span> & Tournaments
//                     </h2>
//                     <p className="section-subtitle">
//                         Stay updated with all {team_name} events and tournaments
//                     </p>
//                 </div>

//                 <div className="event-filters">
//                     <div className="filter-group">
//                         <span className="filter-label">Status:</span>
//                         {statuses.map((status) => (
//                             <button
//                                 key={status}
//                                 className={`filter-btn ${statusFilter === status ? 'active' : ''}`}
//                                 onClick={() => setStatusFilter(status)}
//                                 style={{
//                                     borderColor: statusFilter === status ? color_code_1 : 'var(--border-color-secondary)',
//                                     color: statusFilter === status ? color_code_1 : 'var(--font-color-secondary)'
//                                 }}
//                             >
//                                 {status === 'all' ? 'All' : getStatusLabel(status)}
//                             </button>
//                         ))}
//                     </div>

//                     <div className="filter-group">
//                         <span className="filter-label">Category:</span>
//                         {categories.map((cat) => (
//                             <button
//                                 key={cat}
//                                 className={`filter-btn ${categoryFilter === cat ? 'active' : ''}`}
//                                 onClick={() => setCategoryFilter(cat)}
//                                 style={{
//                                     borderColor: categoryFilter === cat ? color_code_1 : 'var(--border-color-secondary)',
//                                     color: categoryFilter === cat ? color_code_1 : 'var(--font-color-secondary)'
//                                 }}
//                             >
//                                 {cat === 'all' ? 'All' : getCategoryLabel(cat)}
//                             </button>
//                         ))}
//                     </div>
//                 </div>

//                 <div className="event-grid">
//                     {filteredEvents.length > 0 ? (
//                         filteredEvents.map((event) => (
//                             <div
//                                 key={event.id}
//                                 className="event-card"
//                                 onClick={() => openEventDetail(event)}
//                                 style={{ border: `2px solid ${color_code_1}22` }}
//                             >
//                                 <div className="event-image-wrapper">
//                                     <img src={event.image} alt={event.title} className="event-image" loading="lazy" />
//                                     <div className="event-status-badge" style={{
//                                         background: getStatusColor(event.status),
//                                         color: '#fff'
//                                     }}>
//                                         {getStatusLabel(event.status)}
//                                     </div>
//                                 </div>
//                                 <div className="event-info">
//                                     <h3 className="event-title">{event.title}</h3>
//                                     <p className="event-description">
//                                         {event.description.length > 60
//                                             ? event.description.substring(0, 60) + '...'
//                                             : event.description}
//                                     </p>
//                                     <div className="event-meta">
//                                         <span className="event-date">
//                                             <i className="bi bi-calendar3"></i> {event.date}
//                                         </span>
//                                         <span className="event-location">
//                                             <i className="bi bi-geo-alt"></i> {event.location}
//                                         </span>
//                                     </div>
//                                     <div className="event-footer">
//                                         <span className="event-prize" style={{ color: color_code_1 }}>
//                                             <i className="bi bi-trophy"></i> {event.prizePool}
//                                         </span>
//                                         <span className="event-category-tag" style={{
//                                             background: `linear-gradient(135deg, ${color_code_1}, ${color_code_2})`,
//                                             color: '#fff'
//                                         }}>
//                                             {getCategoryLabel(event.category)}
//                                         </span>
//                                     </div>
//                                 </div>
//                             </div>
//                         ))
//                     ) : (
//                         <div className="event-empty">
//                             <i className="bi bi-calendar2-event" style={{ color: color_code_1 }}></i>
//                             <p>No events found matching your filters.</p>
//                         </div>
//                     )}
//                 </div>

//                 {selectedEvent && (
//                     <div className="event-modal" onClick={closeEventDetail}>
//                         <div className="event-modal-content" onClick={(e) => e.stopPropagation()}>
//                             <button className="event-modal-close" onClick={closeEventDetail}>
//                                 <i className="bi bi-x-lg"></i>
//                             </button>

//                             <div className="event-modal-image">
//                                 <img src={selectedEvent.image} alt={selectedEvent.title} />
//                                 <div className="event-modal-status" style={{ background: getStatusColor(selectedEvent.status) }}>
//                                     {getStatusLabel(selectedEvent.status)}
//                                 </div>
//                             </div>

//                             <div className="event-modal-info">
//                                 <h2 style={{ color: color_code_1 }}>{selectedEvent.title}</h2>
//                                 <p className="event-modal-description">{selectedEvent.description}</p>

//                                 <div className="event-modal-details">
//                                     <div className="event-modal-detail">
//                                         <i className="bi bi-calendar3" style={{ color: color_code_1 }}></i>
//                                         <div>
//                                             <span className="detail-label">Date</span>
//                                             <span className="detail-value">{selectedEvent.date}</span>
//                                         </div>
//                                     </div>
//                                     <div className="event-modal-detail">
//                                         <i className="bi bi-geo-alt" style={{ color: color_code_1 }}></i>
//                                         <div>
//                                             <span className="detail-label">Location</span>
//                                             <span className="detail-value">{selectedEvent.location}</span>
//                                         </div>
//                                     </div>
//                                     <div className="event-modal-detail">
//                                         <i className="bi bi-trophy" style={{ color: color_code_1 }}></i>
//                                         <div>
//                                             <span className="detail-label">Prize Pool</span>
//                                             <span className="detail-value">{selectedEvent.prizePool}</span>
//                                         </div>
//                                     </div>
//                                     <div className="event-modal-detail">
//                                         <i className="bi bi-tag" style={{ color: color_code_1 }}></i>
//                                         <div>
//                                             <span className="detail-label">Category</span>
//                                             <span className="detail-value">{getCategoryLabel(selectedEvent.category)}</span>
//                                         </div>
//                                     </div>
//                                 </div>

//                                 <button className="event-modal-btn" style={{
//                                     background: `linear-gradient(135deg, ${color_code_1}, ${color_code_2})`,
//                                     color: '#fff'
//                                 }}>
//                                     <i className="bi bi-ticket"></i> Get Tickets
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 )}
//             </div>
//         </section>
//     );
// };

// export default Home_Event;




// =============== [ New Updated code with SKELETON LOADER ] ============
// src/home/components/Home_Event.jsx
import React, { useState } from 'react';
import { getOrgConfig } from '../../config/org_config';
import { useHomeAPI } from '../../home/Home_API_Context';
import "../assets/css/Home_Event.css";

const Home_Event = () => {
    const { team_name, color_code_1, color_code_2 } = getOrgConfig();
    const { events, loading, error, refresh } = useHomeAPI();

    const [selectedEvent, setSelectedEvent] = useState(null);
    const [statusFilter, setStatusFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('all');

    const allEvents = events || [];
    const statuses = ['all', 'upcoming', 'ongoing', 'completed'];
    const categories = ['all', 'tournament', 'qualifier', 'fan_meet', 'community', 'showmatch', 'expo'];

    const filteredEvents = allEvents.filter(event => {
        const statusMatch = statusFilter === 'all' || event.status === statusFilter;
        const categoryMatch = categoryFilter === 'all' || event.category === categoryFilter;
        return statusMatch && categoryMatch;
    });

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
                    {/* Section Header Skeleton */}
                    <div className="section-header">
                        <div className="event-skeleton event-skeleton-badge"></div>
                        <div className="event-skeleton event-skeleton-title"></div>
                        <div className="event-skeleton event-skeleton-subtitle"></div>
                    </div>

                    {/* Filters Skeleton — Status row */}
                    <div className="event-filters">
                        <div className="filter-group">
                            <div className="event-skeleton event-skeleton-filter-label"></div>
                            {statuses.map((status) => (
                                <div key={status} className="event-skeleton event-skeleton-filter"></div>
                            ))}
                        </div>

                        {/* Filters Skeleton — Category row */}
                        <div className="filter-group">
                            <div className="event-skeleton event-skeleton-filter-label"></div>
                            {categories.map((cat) => (
                                <div key={cat} className="event-skeleton event-skeleton-filter"></div>
                            ))}
                        </div>
                    </div>

                    {/* Event Grid Skeleton */}
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
                                    <div className="event-skeleton event-skeleton-desc event-skeleton-desc-short"></div>
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

    // Error
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
                    {filteredEvents.length > 0 ? (
                        filteredEvents.map((event) => (
                            <div
                                key={event.id}
                                className="event-card"
                                onClick={() => openEventDetail(event)}
                                style={{ border: `2px solid ${color_code_1}22` }}
                            >
                                <div className="event-image-wrapper">
                                    <img src={event.image} alt={event.title} className="event-image" loading="lazy" />
                                    <div className="event-status-badge" style={{
                                        background: getStatusColor(event.status),
                                        color: '#fff'
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

                                <button className="event-modal-btn" style={{
                                    background: `linear-gradient(135deg, ${color_code_1}, ${color_code_2})`,
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
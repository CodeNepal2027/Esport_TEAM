// src/routes/components/Home_Video.jsx
import React, { useState, useEffect } from 'react';
import env_export from '../../config/env_export';
import "../assets/css/Home_Video.css";

const Home_Video = () => {
    const { 
        TEAM_TAG, 
        TEAM_NAME, 
        COLOR_CODE_1, 
        COLOR_CODE_2 
    } = env_export;

    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [categoryFilter, setCategoryFilter] = useState('all');

    // YouTube API Key - Get from Google Cloud Console
    const YOUTUBE_API_KEY = 'YOUR_YOUTUBE_API_KEY_HERE';

    // Default videos (only URL and category)
    const defaultVideos = [
        {
            id: 1,
            youtube_url: 'https://youtu.be/sHtBOMbBLZM?si=nAkLX1rnXfX3XI7z',
            category: 'highlights'
        },
        {
            id: 2,
            youtube_url: 'https://youtu.be/9bZkp7q19f0',
            category: 'training'
        },
        {
            id: 3,
            youtube_url: 'https://youtu.be/kJQP7kiw5Fk',
            category: 'interviews'
        },
        {
            id: 4,
            youtube_url: 'https://youtu.be/fJ9rUzIMcZQ',
            category: 'highlights'
        },
        {
            id: 5,
            youtube_url: 'https://youtu.be/VYOjWnS4cMY',
            category: 'analysis'
        },
        {
            id: 6,
            youtube_url: 'https://youtu.be/XqZsoesa55w',
            category: 'events'
        }
    ];

    // Extract YouTube ID from URL
    const extractYoutubeId = (url) => {
        const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[7].length === 11) ? match[7] : null;
    };

    // Fetch video metadata from YouTube API (including description)
    const fetchYouTubeData = async (videoId) => {
        if (!YOUTUBE_API_KEY || YOUTUBE_API_KEY === 'YOUR_YOUTUBE_API_KEY_HERE') {
            // Fallback: use oEmbed API (no API key required)
            try {
                const response = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`);
                const data = await response.json();
                return {
                    title: data.title,
                    description: data.author_name || 'No description available',
                    thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
                    date: new Date().toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric' 
                    }),
                    views: 'N/A'
                };
            } catch {
                return null;
            }
        }

        try {
            const response = await fetch(
                `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${YOUTUBE_API_KEY}&part=snippet,statistics`
            );
            
            if (!response.ok) {
                throw new Error('Failed to fetch video data');
            }

            const data = await response.json();
            
            if (data.items && data.items.length > 0) {
                const item = data.items[0];
                const viewCount = parseInt(item.statistics.viewCount);
                let views = viewCount.toLocaleString();
                if (viewCount >= 1000000) {
                    views = (viewCount / 1000000).toFixed(1) + 'M';
                } else if (viewCount >= 1000) {
                    views = (viewCount / 1000).toFixed(1) + 'K';
                }
                
                return {
                    title: item.snippet.title,
                    description: item.snippet.description || 'No description available',
                    thumbnail: item.snippet.thumbnails.maxres?.url || 
                               item.snippet.thumbnails.high?.url || 
                               `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
                    date: new Date(item.snippet.publishedAt).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric' 
                    }),
                    views: views
                };
            }
            return null;
        } catch (error) {
            console.error('Error fetching video metadata:', error);
            // Fallback: use oEmbed
            try {
                const response = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`);
                const data = await response.json();
                return {
                    title: data.title,
                    description: data.author_name || 'No description available',
                    thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
                    date: new Date().toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric' 
                    }),
                    views: 'N/A'
                };
            } catch {
                return null;
            }
        }
    };

    // Initialize with default videos
    useEffect(() => {
        const fetchDefaultVideos = async () => {
            setLoading(true);
            const updatedVideos = await Promise.all(
                defaultVideos.map(async (video, index) => {
                    const videoId = extractYoutubeId(video.youtube_url);
                    if (videoId) {
                        const data = await fetchYouTubeData(videoId);
                        if (data) {
                            return {
                                ...video,
                                id: index + 1,
                                title: data.title,
                                description: data.description || 'No description available',
                                thumbnail: data.thumbnail,
                                date: data.date,
                                views: data.views
                            };
                        }
                    }
                    return {
                        ...video,
                        id: index + 1,
                        title: 'YouTube Video',
                        description: 'No description available',
                        thumbnail: `https://img.youtube.com/vi/${extractYoutubeId(video.youtube_url)}/maxresdefault.jpg`,
                        date: new Date().toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric', 
                            year: 'numeric' 
                        }),
                        views: 'N/A'
                    };
                })
            );
            setVideos(updatedVideos);
            setLoading(false);
        };

        fetchDefaultVideos();
    }, []);

    // Filter categories
    const categories = ['all', 'highlights', 'training', 'interviews', 'analysis', 'events'];
    const filteredVideos = categoryFilter === 'all' 
        ? videos 
        : videos.filter(video => video.category === categoryFilter);

    const getCategoryLabel = (cat) => {
        const labels = {
            'all': 'All',
            'highlights': 'Highlights',
            'training': 'Training',
            'interviews': 'Interviews',
            'analysis': 'Analysis',
            'events': 'Events'
        };
        return labels[cat] || cat;
    };

    // Open video modal
    const openVideo = (video) => {
        setSelectedVideo(video);
        document.body.style.overflow = 'hidden';
    };

    // Close video modal
    const closeVideo = () => {
        setSelectedVideo(null);
        document.body.style.overflow = 'auto';
    };

    if (loading) {
        return (
            <section id="home-video" className="home-video">
                <div className="container">
                    <div className="section-header">
                        <span className="section-badge" style={{ 
                            background: `linear-gradient(135deg, ${COLOR_CODE_1}, ${COLOR_CODE_2})`
                        }}>
                            Watch Us
                        </span>
                        <h2 className="section-title">
                            <span style={{ color: COLOR_CODE_1 }}>Latest</span> Videos
                        </h2>
                    </div>
                    <div className="video-loading">
                        <div className="loading-spinner" style={{ borderColor: COLOR_CODE_1 }}></div>
                        <p>Loading videos...</p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section id="home-video" className="home-video">
            <div className="container">
                {/* Section Header */}
                <div className="section-header">
                    <span className="section-badge" style={{ 
                        background: `linear-gradient(135deg, ${COLOR_CODE_1}, ${COLOR_CODE_2})`
                    }}>
                        Watch Us
                    </span>
                    <h2 className="section-title">
                        <span style={{ color: COLOR_CODE_1 }}>Latest</span> Videos
                    </h2>
                    <p className="section-subtitle">
                        Catch all the action from {TEAM_NAME}
                    </p>
                </div>

                {/* Category Filters */}
                <div className="video-filters">
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
                            {getCategoryLabel(cat)}
                        </button>
                    ))}
                </div>

                {/* Video Grid */}
                <div className="video-grid">
                    {filteredVideos.length > 0 ? (
                        filteredVideos.map((video) => (
                            <div 
                                key={video.id} 
                                className="video-card"
                                style={{
                                    border: `2px solid ${COLOR_CODE_1}22`
                                }}
                            >
                                <div className="video-thumbnail-wrapper" onClick={() => openVideo(video)}>
                                    <img 
                                        src={video.thumbnail} 
                                        alt={video.title}
                                        className="video-thumbnail"
                                        loading="lazy"
                                        onError={(e) => {
                                            const videoId = extractYoutubeId(video.youtube_url);
                                            e.target.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
                                        }}
                                    />
                                    <div className="video-play-overlay" style={{
                                        background: `linear-gradient(135deg, ${COLOR_CODE_1}99, ${COLOR_CODE_2}99)`
                                    }}>
                                        <div className="play-button">
                                            <i className="bi bi-play-circle-fill" style={{ color: '#fff' }}></i>
                                        </div>
                                    </div>
                                </div>
                                <div className="video-info">
                                    <h3 className="video-title">{video.title}</h3>
                                    <p className="video-description">
                                        {video.description?.length > 40 
                                            ? video.description.substring(0, 40) + '...' 
                                            : video.description || 'No description available'}
                                    </p>
                                    <div className="video-meta">
                                        <span className="video-category-tag" style={{
                                            background: `linear-gradient(135deg, ${COLOR_CODE_1}, ${COLOR_CODE_2})`,
                                            color: '#fff'
                                        }}>
                                            {getCategoryLabel(video.category)}
                                        </span>
                                        <span className="video-date">
                                            <i className="bi bi-calendar3"></i> {video.date}
                                        </span>
                                        <span className="video-views">
                                            <i className="bi bi-eye"></i> {video.views}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="video-empty">
                            <i className="bi bi-youtube" style={{ color: COLOR_CODE_1 }}></i>
                            <p>No videos found in this category.</p>
                        </div>
                    )}
                </div>

                {/* Video Modal with YouTube Embed */}
                {selectedVideo && (
                    <div className="video-modal" onClick={closeVideo}>
                        <div className="video-modal-content" onClick={(e) => e.stopPropagation()}>
                            <button className="video-modal-close" onClick={closeVideo}>
                                <i className="bi bi-x-lg"></i>
                            </button>
                            
                            <div className="video-embed-wrapper">
                                <iframe
                                    src={`https://www.youtube.com/embed/${extractYoutubeId(selectedVideo.youtube_url)}?autoplay=1&rel=0&modestbranding=1`}
                                    title={selectedVideo.title}
                                    className="video-iframe"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    frameBorder="0"
                                ></iframe>
                            </div>
                            
                            <div className="video-modal-info">
                                <h3 style={{ color: COLOR_CODE_1 }}>{selectedVideo.title}</h3>
                                <p className="video-modal-description">{selectedVideo.description || 'No description available'}</p>
                                <div className="video-modal-meta">
                                    <span className="video-modal-category" style={{
                                        background: `linear-gradient(135deg, ${COLOR_CODE_1}, ${COLOR_CODE_2})`,
                                        color: '#fff'
                                    }}>
                                        {getCategoryLabel(selectedVideo.category)}
                                    </span>
                                    <span className="video-modal-date">
                                        <i className="bi bi-calendar3"></i> {selectedVideo.date}
                                    </span>
                                    <span className="video-modal-views">
                                        <i className="bi bi-eye"></i> {selectedVideo.views} views
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Home_Video;
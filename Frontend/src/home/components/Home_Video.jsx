// // src/home/components/Home_Video.jsx
// import React, { useState, useEffect } from 'react';
// import { getOrgConfig } from '../../config/org_config';
// import { useHomeAPI } from '../../home/Home_API_Context';
// import "../assets/css/Home_Video.css";

// const Home_Video = () => {
//     const { team_name, color_code_1, color_code_2 } = getOrgConfig();
//     const { videos: rawVideos, loading, error, refresh } = useHomeAPI();

//     const [videos, setVideos] = useState([]);
//     const [selectedVideo, setSelectedVideo] = useState(null);
//     const [categoryFilter, setCategoryFilter] = useState('all');
//     const [hydrating, setHydrating] = useState(true);

//     const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY || '';

//     const extractYoutubeId = (url) => {
//         const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
//         const match = url.match(regExp);
//         return (match && match[7].length === 11) ? match[7] : null;
//     };

//     const fetchYouTubeData = async (videoId) => {
//         // Try YouTube Data API first if key exists
//         if (YOUTUBE_API_KEY) {
//             try {
//                 const res = await fetch(
//                     `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${YOUTUBE_API_KEY}&part=snippet,statistics`
//                 );
//                 if (res.ok) {
//                     const data = await res.json();
//                     if (data.items?.length) {
//                         const item = data.items[0];
//                         const viewCount = parseInt(item.statistics.viewCount);
//                         let views = viewCount.toLocaleString();
//                         if (viewCount >= 1000000) views = (viewCount / 1000000).toFixed(1) + 'M';
//                         else if (viewCount >= 1000) views = (viewCount / 1000).toFixed(1) + 'K';

//                         return {
//                             title: item.snippet.title,
//                             description: item.snippet.description || 'No description available',
//                             thumbnail: item.snippet.thumbnails.maxres?.url ||
//                                 item.snippet.thumbnails.high?.url ||
//                                 `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
//                             date: new Date(item.snippet.publishedAt).toLocaleDateString('en-US', {
//                                 month: 'short', day: 'numeric', year: 'numeric'
//                             }),
//                             views
//                         };
//                     }
//                 }
//             } catch (e) { /* fall through */ }
//         }

//         // Fallback: oEmbed
//         try {
//             const res = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`);
//             const data = await res.json();
//             return {
//                 title: data.title,
//                 description: data.author_name || 'No description available',
//                 thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
//                 date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
//                 views: 'N/A'
//             };
//         } catch {
//             return null;
//         }
//     };

//     // Hydrate YouTube metadata for raw videos
//     useEffect(() => {
//         if (!rawVideos?.length) {
//             setHydrating(false);
//             return;
//         }

//         let cancelled = false;

//         (async () => {
//             setHydrating(true);
//             const hydrated = await Promise.all(
//                 rawVideos.map(async (video, index) => {
//                     const videoId = extractYoutubeId(video.youtube_url);
//                     if (!videoId) return { ...video, id: index + 1, title: 'Video', description: '', thumbnail: '', date: '', views: 'N/A' };

//                     const data = await fetchYouTubeData(videoId);
//                     if (data) {
//                         return { ...video, id: index + 1, ...data };
//                     }
//                     return {
//                         ...video,
//                         id: index + 1,
//                         title: 'YouTube Video',
//                         description: 'No description available',
//                         thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
//                         date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
//                         views: 'N/A'
//                     };
//                 })
//             );
//             if (!cancelled) {
//                 setVideos(hydrated);
//                 setHydrating(false);
//             }
//         })();

//         return () => { cancelled = true; };
//     }, [rawVideos]);

//     const categories = ['all', 'highlights', 'training', 'interviews', 'analysis', 'events'];
//     const filteredVideos = categoryFilter === 'all'
//         ? videos
//         : videos.filter(v => v.category === categoryFilter);

//     const getCategoryLabel = (cat) => ({
//         'all': 'All', 'highlights': 'Highlights', 'training': 'Training',
//         'interviews': 'Interviews', 'analysis': 'Analysis', 'events': 'Events'
//     }[cat] || cat);

//     const openVideo = (video) => {
//         setSelectedVideo(video);
//         document.body.style.overflow = 'hidden';
//     };

//     const closeVideo = () => {
//         setSelectedVideo(null);
//         document.body.style.overflow = 'auto';
//     };

//     // Loading
//     if ((loading || hydrating) && !videos.length) {
//         return (
//             <section id="home-video-section" className="home-video-section">
//                 <div className="container">
//                     <div className="section-header">
//                         <span className="section-badge" style={{
//                             background: `linear-gradient(135deg, ${color_code_1}, ${color_code_2})`
//                         }}>
//                             Watch Us
//                         </span>
//                         <h2 className="section-title">
//                             <span style={{ color: color_code_1 }}>Latest</span> Videos
//                         </h2>
//                     </div>
//                     <div className="video-loading">
//                         <div className="loading-spinner" style={{ borderColor: color_code_1 }}></div>
//                         <p>Loading videos...</p>
//                     </div>
//                 </div>
//             </section>
//         );
//     }

//     // Error
//     if (error && !videos.length) {
//         return (
//             <section id="home-video-section" className="home-video-section">
//                 <div className="container">
//                     <div className="section-error">
//                         <p>Failed to load videos</p>
//                         <button onClick={refresh} style={{ background: color_code_1, color: '#fff' }}>Retry</button>
//                     </div>
//                 </div>
//             </section>
//         );
//     }

//     return (
//         <section id="home-video-section" className="home-video-section">
//             <div className="container">
//                 <div className="section-header">
//                     <span className="section-badge" style={{
//                         background: `linear-gradient(135deg, ${color_code_1}, ${color_code_2})`
//                     }}>
//                         Watch Us
//                     </span>
//                     <h2 className="section-title">
//                         <span style={{ color: color_code_1 }}>Latest</span> Videos
//                     </h2>
//                     <p className="section-subtitle">
//                         Catch all the action from {team_name}
//                     </p>
//                 </div>

//                 <div className="video-filters">
//                     {categories.map((cat) => (
//                         <button
//                             key={cat}
//                             className={`filter-btn ${categoryFilter === cat ? 'active' : ''}`}
//                             onClick={() => setCategoryFilter(cat)}
//                             style={{
//                                 borderColor: categoryFilter === cat ? color_code_1 : 'var(--border-color-secondary)',
//                                 color: categoryFilter === cat ? color_code_1 : 'var(--font-color-secondary)'
//                             }}
//                         >
//                             {getCategoryLabel(cat)}
//                         </button>
//                     ))}
//                 </div>

//                 <div className="video-grid">
//                     {filteredVideos.length > 0 ? (
//                         filteredVideos.map((video) => (
//                             <div key={video.id} className="video-card" style={{ border: `2px solid ${color_code_1}22` }}>
//                                 <div className="video-thumbnail-wrapper" onClick={() => openVideo(video)}>
//                                     <img
//                                         src={video.thumbnail}
//                                         alt={video.title}
//                                         className="video-thumbnail"
//                                         loading="lazy"
//                                         onError={(e) => {
//                                             const videoId = extractYoutubeId(video.youtube_url);
//                                             e.target.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
//                                         }}
//                                     />
//                                     <div className="video-play-overlay" style={{
//                                         background: `linear-gradient(135deg, ${color_code_1}99, ${color_code_2}99)`
//                                     }}>
//                                         <div className="play-button">
//                                             <i className="bi bi-play-circle-fill" style={{ color: '#fff' }}></i>
//                                         </div>
//                                     </div>
//                                 </div>
//                                 <div className="video-info">
//                                     <h3 className="video-title">{video.title}</h3>
//                                     <p className="video-description">
//                                         {video.description?.length > 40
//                                             ? video.description.substring(0, 40) + '...'
//                                             : video.description || 'No description available'}
//                                     </p>
//                                     <div className="video-meta">
//                                         <span className="video-category-tag" style={{
//                                             background: `linear-gradient(135deg, ${color_code_1}, ${color_code_2})`,
//                                             color: '#fff'
//                                         }}>
//                                             {getCategoryLabel(video.category)}
//                                         </span>
//                                         <span className="video-date">
//                                             <i className="bi bi-calendar3"></i> {video.date}
//                                         </span>
//                                         <span className="video-views">
//                                             <i className="bi bi-eye"></i> {video.views}
//                                         </span>
//                                     </div>
//                                 </div>
//                             </div>
//                         ))
//                     ) : (
//                         <div className="video-empty">
//                             <i className="bi bi-youtube" style={{ color: color_code_1 }}></i>
//                             <p>No videos found in this category.</p>
//                         </div>
//                     )}
//                 </div>

//                 {selectedVideo && (
//                     <div className="video-modal" onClick={closeVideo}>
//                         <div className="video-modal-content" onClick={(e) => e.stopPropagation()}>
//                             <button className="video-modal-close" onClick={closeVideo}>
//                                 <i className="bi bi-x-lg"></i>
//                             </button>

//                             <div className="video-embed-wrapper">
//                                 <iframe
//                                     src={`https://www.youtube.com/embed/${extractYoutubeId(selectedVideo.youtube_url)}?autoplay=1&rel=0&modestbranding=1`}
//                                     title={selectedVideo.title}
//                                     className="video-iframe"
//                                     allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//                                     allowFullScreen
//                                     frameBorder="0"
//                                 ></iframe>
//                             </div>

//                             <div className="video-modal-info">
//                                 <h3 style={{ color: color_code_1 }}>{selectedVideo.title}</h3>
//                                 <p className="video-modal-description">{selectedVideo.description || 'No description available'}</p>
//                                 <div className="video-modal-meta">
//                                     <span className="video-modal-category" style={{
//                                         background: `linear-gradient(135deg, ${color_code_1}, ${color_code_2})`,
//                                         color: '#fff'
//                                     }}>
//                                         {getCategoryLabel(selectedVideo.category)}
//                                     </span>
//                                     <span className="video-modal-date">
//                                         <i className="bi bi-calendar3"></i> {selectedVideo.date}
//                                     </span>
//                                     <span className="video-modal-views">
//                                         <i className="bi bi-eye"></i> {selectedVideo.views} views
//                                     </span>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 )}
//             </div>
//         </section>
//     );
// };

// export default Home_Video;




// =============== [ New updated code with SKELETON LOADER ] =============
// src/home/components/Home_Video.jsx
import React, { useState, useEffect } from 'react';
import { getOrgConfig } from '../../config/org_config';
import { useHomeAPI } from '../../home/Home_API_Context';
import "../assets/css/Home_Video.css";

const Home_Video = () => {
    const { team_name, color_code_1, color_code_2 } = getOrgConfig();
    const { videos: rawVideos, loading, error, refresh } = useHomeAPI();

    const [videos, setVideos] = useState([]);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [hydrating, setHydrating] = useState(true);

    const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY || '';

    const extractYoutubeId = (url) => {
        const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[7].length === 11) ? match[7] : null;
    };

    const fetchYouTubeData = async (videoId) => {
        // Try YouTube Data API first if key exists
        if (YOUTUBE_API_KEY) {
            try {
                const res = await fetch(
                    `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${YOUTUBE_API_KEY}&part=snippet,statistics`
                );
                if (res.ok) {
                    const data = await res.json();
                    if (data.items?.length) {
                        const item = data.items[0];
                        const viewCount = parseInt(item.statistics.viewCount);
                        let views = viewCount.toLocaleString();
                        if (viewCount >= 1000000) views = (viewCount / 1000000).toFixed(1) + 'M';
                        else if (viewCount >= 1000) views = (viewCount / 1000).toFixed(1) + 'K';

                        return {
                            title: item.snippet.title,
                            description: item.snippet.description || 'No description available',
                            thumbnail: item.snippet.thumbnails.maxres?.url ||
                                item.snippet.thumbnails.high?.url ||
                                `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
                            date: new Date(item.snippet.publishedAt).toLocaleDateString('en-US', {
                                month: 'short', day: 'numeric', year: 'numeric'
                            }),
                            views
                        };
                    }
                }
            } catch (e) { /* fall through */ }
        }

        // Fallback: oEmbed
        try {
            const res = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`);
            const data = await res.json();
            return {
                title: data.title,
                description: data.author_name || 'No description available',
                thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
                date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                views: 'N/A'
            };
        } catch {
            return null;
        }
    };

    // Hydrate YouTube metadata for raw videos
    useEffect(() => {
        if (!rawVideos?.length) {
            setHydrating(false);
            return;
        }

        let cancelled = false;

        (async () => {
            setHydrating(true);
            const hydrated = await Promise.all(
                rawVideos.map(async (video, index) => {
                    const videoId = extractYoutubeId(video.youtube_url);
                    if (!videoId) return { ...video, id: index + 1, title: 'Video', description: '', thumbnail: '', date: '', views: 'N/A' };

                    const data = await fetchYouTubeData(videoId);
                    if (data) {
                        return { ...video, id: index + 1, ...data };
                    }
                    return {
                        ...video,
                        id: index + 1,
                        title: 'YouTube Video',
                        description: 'No description available',
                        thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
                        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                        views: 'N/A'
                    };
                })
            );
            if (!cancelled) {
                setVideos(hydrated);
                setHydrating(false);
            }
        })();

        return () => { cancelled = true; };
    }, [rawVideos]);

    const categories = ['all', 'highlights', 'training', 'interviews', 'analysis', 'events'];
    const filteredVideos = categoryFilter === 'all'
        ? videos
        : videos.filter(v => v.category === categoryFilter);

    const getCategoryLabel = (cat) => ({
        'all': 'All', 'highlights': 'Highlights', 'training': 'Training',
        'interviews': 'Interviews', 'analysis': 'Analysis', 'events': 'Events'
    }[cat] || cat);

    const openVideo = (video) => {
        setSelectedVideo(video);
        document.body.style.overflow = 'hidden';
    };

    const closeVideo = () => {
        setSelectedVideo(null);
        document.body.style.overflow = 'auto';
    };

    // Loading — skeleton loader
    if ((loading || hydrating) && !videos.length) {
        return (
            <section id="home-video-section" className="home-video-section">
                <div className="container">
                    {/* Section Header Skeleton */}
                    <div className="section-header">
                        <div className="video-skeleton video-skeleton-badge"></div>
                        <div className="video-skeleton video-skeleton-title"></div>
                        <div className="video-skeleton video-skeleton-subtitle"></div>
                    </div>

                    {/* Category Filters Skeleton */}
                    <div className="video-filters">
                        {categories.map((cat) => (
                            <div key={cat} className="video-skeleton video-skeleton-filter"></div>
                        ))}
                    </div>

                    {/* Video Grid Skeleton */}
                    <div className="video-grid">
                        {[0, 1, 2, 3].map((i) => (
                            <div key={i} className="video-card">
                                <div className="video-thumbnail-wrapper">
                                    <div className="video-skeleton video-skeleton-thumbnail"></div>
                                </div>
                                <div className="video-info">
                                    <div className="video-skeleton video-skeleton-video-title"></div>
                                    <div className="video-skeleton video-skeleton-video-title video-skeleton-video-title-short"></div>
                                    <div className="video-skeleton video-skeleton-desc"></div>
                                    <div className="video-skeleton video-skeleton-desc video-skeleton-desc-short"></div>
                                    <div className="video-meta">
                                        <div className="video-skeleton video-skeleton-tag"></div>
                                        <div className="video-skeleton video-skeleton-meta"></div>
                                        <div className="video-skeleton video-skeleton-meta"></div>
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
    if (error && !videos.length) {
        return (
            <section id="home-video-section" className="home-video-section">
                <div className="container">
                    <div className="section-error">
                        <p>Failed to load videos</p>
                        <button onClick={refresh} style={{ background: color_code_1, color: '#fff' }}>Retry</button>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section id="home-video-section" className="home-video-section">
            <div className="container">
                <div className="section-header">
                    <span className="section-badge" style={{
                        background: `linear-gradient(135deg, ${color_code_1}, ${color_code_2})`
                    }}>
                        Watch Us
                    </span>
                    <h2 className="section-title">
                        <span style={{ color: color_code_1 }}>Latest</span> Videos
                    </h2>
                    <p className="section-subtitle">
                        Catch all the action from {team_name}
                    </p>
                </div>

                <div className="video-filters">
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
                            {getCategoryLabel(cat)}
                        </button>
                    ))}
                </div>

                <div className="video-grid">
                    {filteredVideos.length > 0 ? (
                        filteredVideos.map((video) => (
                            <div key={video.id} className="video-card" style={{ border: `2px solid ${color_code_1}22` }}>
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
                                        background: `linear-gradient(135deg, ${color_code_1}99, ${color_code_2}99)`
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
                                            background: `linear-gradient(135deg, ${color_code_1}, ${color_code_2})`,
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
                            <i className="bi bi-youtube" style={{ color: color_code_1 }}></i>
                            <p>No videos found in this category.</p>
                        </div>
                    )}
                </div>

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
                                <h3 style={{ color: color_code_1 }}>{selectedVideo.title}</h3>
                                <p className="video-modal-description">{selectedVideo.description || 'No description available'}</p>
                                <div className="video-modal-meta">
                                    <span className="video-modal-category" style={{
                                        background: `linear-gradient(135deg, ${color_code_1}, ${color_code_2})`,
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
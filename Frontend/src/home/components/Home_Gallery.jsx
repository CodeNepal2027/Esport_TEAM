// // src/home/components/Home_Gallery.jsx
// import React, { useState, useRef, useEffect } from 'react';
// import { getOrgConfig } from '../../config/org_config';
// import { useHomeAPI } from '../../home/Home_API_Context';
// import "../assets/css/Home_Gallery.css";

// const Home_Gallery = () => {
//     const { team_name, color_code_1, color_code_2 } = getOrgConfig();
//     const { gallery, loading, error, refresh } = useHomeAPI();

//     const getColumnsPerRow = () => {
//         if (typeof window === 'undefined') return 4;
//         const width = window.innerWidth;
//         if (width <= 480) return 2;
//         if (width <= 768) return 3;
//         if (width <= 1024) return 4;
//         return 4;
//     };

//     const getInitialCount = () => getColumnsPerRow() * 3;

//     const [selectedImage, setSelectedImage] = useState(null);
//     const [filter, setFilter] = useState('all');
//     const [columnsPerRow, setColumnsPerRow] = useState(getColumnsPerRow());
//     const [initialCount, setInitialCount] = useState(getInitialCount());
//     const [visibleCount, setVisibleCount] = useState(getInitialCount());
//     const [touchStartX, setTouchStartX] = useState(0);
//     const [touchEndX, setTouchEndX] = useState(0);
//     const galleryRef = useRef(null);

//     const galleryImages = gallery || [];

//     const categories = [
//         { id: 'all', label: 'All' },
//         { id: 'matches', label: 'Matches' },
//         { id: 'training', label: 'Training' },
//         { id: 'team', label: 'Team' },
//         { id: 'events', label: 'Events' },
//     ];

//     useEffect(() => {
//         const handleResize = () => {
//             const newColumns = getColumnsPerRow();
//             const newInitial = newColumns * 3;
//             setColumnsPerRow(newColumns);
//             setInitialCount(newInitial);
//             setVisibleCount(prev => (prev <= initialCount ? newInitial : prev));
//         };
//         window.addEventListener('resize', handleResize);
//         return () => window.removeEventListener('resize', handleResize);
//     }, [initialCount]);

//     const filteredImages = filter === 'all'
//         ? galleryImages
//         : galleryImages.filter(img => img.category === filter);

//     const visibleImages = filteredImages.slice(0, visibleCount);
//     const hasMore = visibleCount < filteredImages.length;
//     const hasLess = visibleCount > initialCount;

//     const loadMore = () => {
//         const additionalRows = columnsPerRow * 3;
//         setVisibleCount(prev => Math.min(prev + additionalRows, filteredImages.length));
//     };

//     const loadLess = () => {
//         setVisibleCount(initialCount);
//         document.getElementById('home-gallery-section')?.scrollIntoView({ behavior: 'smooth' });
//     };

//     const handleFilterChange = (categoryId) => {
//         setFilter(categoryId);
//         setVisibleCount(initialCount);
//     };

//     const handleTouchStart = (e) => setTouchStartX(e.touches[0].clientX);
//     const handleTouchMove = (e) => setTouchEndX(e.touches[0].clientX);
//     const handleTouchEnd = () => {
//         if (selectedImage && touchStartX - touchEndX > 50) nextImage();
//         else if (selectedImage && touchEndX - touchStartX > 50) prevImage();
//         setTouchStartX(0);
//         setTouchEndX(0);
//     };

//     const openLightbox = (image) => {
//         setSelectedImage(image);
//         document.body.style.overflow = 'hidden';
//     };

//     const closeLightbox = () => {
//         setSelectedImage(null);
//         document.body.style.overflow = 'auto';
//     };

//     const nextImage = () => {
//         const currentIndex = filteredImages.findIndex(img => img.id === selectedImage.id);
//         setSelectedImage(filteredImages[(currentIndex + 1) % filteredImages.length]);
//     };

//     const prevImage = () => {
//         const currentIndex = filteredImages.findIndex(img => img.id === selectedImage.id);
//         setSelectedImage(filteredImages[(currentIndex - 1 + filteredImages.length) % filteredImages.length]);
//     };

//     const getGridSpan = (aspectRatio) => {
//         if (!aspectRatio) return 'span-landscape';
//         const [w, h] = aspectRatio.split('/').map(Number);
//         if (isNaN(w) || isNaN(h)) return 'span-landscape';
//         const ratio = w / h;
//         if (ratio > 1.8) return 'span-wide';
//         if (ratio < 0.7) return 'span-portrait';
//         if (ratio >= 0.9 && ratio <= 1.1) return 'span-square';
//         return 'span-landscape';
//     };

//     // Loading
//     if (loading && !gallery) {
//         return (
//             <section id="home-gallery-section" className="home-gallery-section">
//                 <div className="container">
//                     <div className="section-loading">
//                         <div className="loading-spinner" style={{ borderColor: color_code_1 }}></div>
//                         <p>Loading gallery...</p>
//                     </div>
//                 </div>
//             </section>
//         );
//     }

//     // Error
//     if (error && !gallery) {
//         return (
//             <section id="home-gallery-section" className="home-gallery-section">
//                 <div className="container">
//                     <div className="section-error">
//                         <p>Failed to load gallery</p>
//                         <button onClick={refresh} style={{ background: color_code_1, color: '#fff' }}>Retry</button>
//                     </div>
//                 </div>
//             </section>
//         );
//     }

//     return (
//         <section id="home-gallery-section" className="home-gallery-section">
//             <div className="container">
//                 <div className="section-header">
//                     <span className="section-badge" style={{
//                         background: `linear-gradient(135deg, ${color_code_1}, ${color_code_2})`
//                     }}>
//                         Our Moments
//                     </span>
//                     <h2 className="section-title">
//                         <span style={{ color: color_code_1 }}>Photo</span> Gallery
//                     </h2>
//                     <p className="section-subtitle">
//                         Capturing the best moments of {team_name}
//                     </p>
//                 </div>

//                 <div className="gallery-controls">
//                     <div className="gallery-filters">
//                         {categories.map((cat) => (
//                             <button
//                                 key={cat.id}
//                                 className={`filter-btn ${filter === cat.id ? 'active' : ''}`}
//                                 onClick={() => handleFilterChange(cat.id)}
//                                 style={{
//                                     borderColor: filter === cat.id ? color_code_1 : 'var(--border-color-secondary)',
//                                     color: filter === cat.id ? color_code_1 : 'var(--font-color-secondary)'
//                                 }}
//                             >
//                                 {cat.label}
//                             </button>
//                         ))}
//                     </div>
//                 </div>

//                 <div className="gallery-grid" ref={galleryRef}>
//                     {visibleImages.map((image) => {
//                         const aspectRatio = image.aspect_ratio || '4/3';
//                         return (
//                             <div
//                                 key={image.id}
//                                 className={`gallery-item ${getGridSpan(aspectRatio)}`}
//                                 onClick={() => openLightbox(image)}
//                                 style={{
//                                     border: `2px solid ${color_code_1}22`,
//                                     aspectRatio: aspectRatio
//                                 }}
//                             >
//                                 <div className="gallery-image-wrapper">
//                                     <img src={image.image} alt={image.title} className="gallery-image" loading="lazy" />
//                                     <div className="gallery-overlay" style={{
//                                         background: `linear-gradient(135deg, ${color_code_1}99, ${color_code_2}99)`
//                                     }}>
//                                         <div className="gallery-overlay-content">
//                                             <i className="bi bi-search" style={{ color: '#fff' }}></i>
//                                             <h4>{image.title}</h4>
//                                             <span className="gallery-category">{image.category}</span>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         );
//                     })}
//                 </div>

//                 <div className="gallery-actions">
//                     {hasMore && (
//                         <button className="view-more-btn" onClick={loadMore} style={{
//                             border: `2px solid ${color_code_1}`,
//                             color: color_code_1
//                         }}>
//                             <i className="bi bi-plus-circle"></i> View More ({filteredImages.length - visibleCount} remaining)
//                         </button>
//                     )}

//                     {hasLess && (
//                         <button className="view-less-btn" onClick={loadLess} style={{
//                             border: `2px solid ${color_code_1}`,
//                             color: color_code_1
//                         }}>
//                             <i className="bi bi-dash-circle"></i> View Less
//                         </button>
//                     )}
//                 </div>

//                 {selectedImage && (
//                     <div className="lightbox" onClick={closeLightbox}
//                         onTouchStart={handleTouchStart}
//                         onTouchMove={handleTouchMove}
//                         onTouchEnd={handleTouchEnd}
//                     >
//                         <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
//                             <button className="lightbox-close" onClick={closeLightbox}>
//                                 <i className="bi bi-x-lg"></i>
//                             </button>

//                             <button className="lightbox-nav lightbox-prev" onClick={prevImage}>
//                                 <i className="bi bi-chevron-left"></i>
//                             </button>

//                             <div className="lightbox-image-wrapper">
//                                 <img
//                                     src={selectedImage.image}
//                                     alt={selectedImage.title}
//                                     className="lightbox-image"
//                                     style={{
//                                         aspectRatio: selectedImage.aspect_ratio || '4/3',
//                                         maxHeight: '70vh',
//                                         width: '100%',
//                                         height: 'auto',
//                                         objectFit: 'contain'
//                                     }}
//                                 />
//                             </div>

//                             <button className="lightbox-nav lightbox-next" onClick={nextImage}>
//                                 <i className="bi bi-chevron-right"></i>
//                             </button>

//                             <div className="lightbox-info">
//                                 <h3 style={{ color: color_code_1 }}>{selectedImage.title}</h3>
//                                 <p>{selectedImage.description}</p>
//                                 <span className="lightbox-category" style={{
//                                     background: `linear-gradient(135deg, ${color_code_1}, ${color_code_2})`
//                                 }}>
//                                     {selectedImage.category}
//                                 </span>
//                             </div>
//                         </div>
//                     </div>
//                 )}
//             </div>
//         </section>
//     );
// };

// export default Home_Gallery;




// ============== [ New updated code with SKELETON LOADER ] =============
// src/home/components/Home_Gallery.jsx
import React, { useState, useRef, useEffect } from 'react';
import { getOrgConfig } from '../../config/org_config';
import { useHomeAPI } from '../../home/Home_API_Context';
import "../assets/css/Home_Gallery.css";

const Home_Gallery = () => {
    const { team_name, color_code_1, color_code_2 } = getOrgConfig();
    const { gallery, loading, error, refresh } = useHomeAPI();

    const getColumnsPerRow = () => {
        if (typeof window === 'undefined') return 4;
        const width = window.innerWidth;
        if (width <= 480) return 2;
        if (width <= 768) return 3;
        if (width <= 1024) return 4;
        return 4;
    };

    const getInitialCount = () => getColumnsPerRow() * 3;

    const [selectedImage, setSelectedImage] = useState(null);
    const [filter, setFilter] = useState('all');
    const [columnsPerRow, setColumnsPerRow] = useState(getColumnsPerRow());
    const [initialCount, setInitialCount] = useState(getInitialCount());
    const [visibleCount, setVisibleCount] = useState(getInitialCount());
    const [touchStartX, setTouchStartX] = useState(0);
    const [touchEndX, setTouchEndX] = useState(0);
    const galleryRef = useRef(null);

    const galleryImages = gallery || [];

    const categories = [
        { id: 'all', label: 'All' },
        { id: 'matches', label: 'Matches' },
        { id: 'training', label: 'Training' },
        { id: 'team', label: 'Team' },
        { id: 'events', label: 'Events' },
    ];

    useEffect(() => {
        const handleResize = () => {
            const newColumns = getColumnsPerRow();
            const newInitial = newColumns * 3;
            setColumnsPerRow(newColumns);
            setInitialCount(newInitial);
            setVisibleCount(prev => (prev <= initialCount ? newInitial : prev));
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [initialCount]);

    const filteredImages = filter === 'all'
        ? galleryImages
        : galleryImages.filter(img => img.category === filter);

    const visibleImages = filteredImages.slice(0, visibleCount);
    const hasMore = visibleCount < filteredImages.length;
    const hasLess = visibleCount > initialCount;

    const loadMore = () => {
        const additionalRows = columnsPerRow * 3;
        setVisibleCount(prev => Math.min(prev + additionalRows, filteredImages.length));
    };

    const loadLess = () => {
        setVisibleCount(initialCount);
        document.getElementById('home-gallery-section')?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleFilterChange = (categoryId) => {
        setFilter(categoryId);
        setVisibleCount(initialCount);
    };

    const handleTouchStart = (e) => setTouchStartX(e.touches[0].clientX);
    const handleTouchMove = (e) => setTouchEndX(e.touches[0].clientX);
    const handleTouchEnd = () => {
        if (selectedImage && touchStartX - touchEndX > 50) nextImage();
        else if (selectedImage && touchEndX - touchStartX > 50) prevImage();
        setTouchStartX(0);
        setTouchEndX(0);
    };

    const openLightbox = (image) => {
        setSelectedImage(image);
        document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
        setSelectedImage(null);
        document.body.style.overflow = 'auto';
    };

    const nextImage = () => {
        const currentIndex = filteredImages.findIndex(img => img.id === selectedImage.id);
        setSelectedImage(filteredImages[(currentIndex + 1) % filteredImages.length]);
    };

    const prevImage = () => {
        const currentIndex = filteredImages.findIndex(img => img.id === selectedImage.id);
        setSelectedImage(filteredImages[(currentIndex - 1 + filteredImages.length) % filteredImages.length]);
    };

    const getGridSpan = (aspectRatio) => {
        if (!aspectRatio) return 'span-landscape';
        const [w, h] = aspectRatio.split('/').map(Number);
        if (isNaN(w) || isNaN(h)) return 'span-landscape';
        const ratio = w / h;
        if (ratio > 1.8) return 'span-wide';
        if (ratio < 0.7) return 'span-portrait';
        if (ratio >= 0.9 && ratio <= 1.1) return 'span-square';
        return 'span-landscape';
    };

    // Loading — skeleton loader
    if (loading && !gallery) {
        return (
            <section id="home-gallery-section" className="home-gallery-section">
                <div className="container">
                    {/* Section Header Skeleton */}
                    <div className="section-header">
                        <div className="gallery-skeleton gallery-skeleton-badge"></div>
                        <div className="gallery-skeleton gallery-skeleton-title"></div>
                        <div className="gallery-skeleton gallery-skeleton-subtitle"></div>
                    </div>

                    {/* Filter Buttons Skeleton */}
                    <div className="gallery-controls">
                        <div className="gallery-filters">
                            {categories.map((cat) => (
                                <div key={cat.id} className="gallery-skeleton gallery-skeleton-filter"></div>
                            ))}
                        </div>
                    </div>

                    {/* Gallery Grid Skeleton */}
                    <div className="gallery-grid">
                        {[...Array(initialCount)].map((_, i) => (
                            <div
                                key={i}
                                className="gallery-item"
                                style={{ aspectRatio: '4/3' }}
                            >
                                <div className="gallery-skeleton gallery-skeleton-image"></div>
                            </div>
                        ))}
                    </div>

                    {/* View More Button Skeleton */}
                    <div className="gallery-actions">
                        <div className="gallery-skeleton gallery-skeleton-view-btn"></div>
                    </div>
                </div>
            </section>
        );
    }

    // Error
    if (error && !gallery) {
        return (
            <section id="home-gallery-section" className="home-gallery-section">
                <div className="container">
                    <div className="section-error">
                        <p>Failed to load gallery</p>
                        <button onClick={refresh} style={{ background: color_code_1, color: '#fff' }}>Retry</button>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section id="home-gallery-section" className="home-gallery-section">
            <div className="container">
                <div className="section-header">
                    <span className="section-badge" style={{
                        background: `linear-gradient(135deg, ${color_code_1}, ${color_code_2})`
                    }}>
                        Our Moments
                    </span>
                    <h2 className="section-title">
                        <span style={{ color: color_code_1 }}>Photo</span> Gallery
                    </h2>
                    <p className="section-subtitle">
                        Capturing the best moments of {team_name}
                    </p>
                </div>

                <div className="gallery-controls">
                    <div className="gallery-filters">
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                className={`filter-btn ${filter === cat.id ? 'active' : ''}`}
                                onClick={() => handleFilterChange(cat.id)}
                                style={{
                                    borderColor: filter === cat.id ? color_code_1 : 'var(--border-color-secondary)',
                                    color: filter === cat.id ? color_code_1 : 'var(--font-color-secondary)'
                                }}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="gallery-grid" ref={galleryRef}>
                    {visibleImages.map((image) => {
                        const aspectRatio = image.aspect_ratio || '4/3';
                        return (
                            <div
                                key={image.id}
                                className={`gallery-item ${getGridSpan(aspectRatio)}`}
                                onClick={() => openLightbox(image)}
                                style={{
                                    border: `2px solid ${color_code_1}22`,
                                    aspectRatio: aspectRatio
                                }}
                            >
                                <div className="gallery-image-wrapper">
                                    <img src={image.image} alt={image.title} className="gallery-image" loading="lazy" />
                                    <div className="gallery-overlay" style={{
                                        background: `linear-gradient(135deg, ${color_code_1}99, ${color_code_2}99)`
                                    }}>
                                        <div className="gallery-overlay-content">
                                            <i className="bi bi-search" style={{ color: '#fff' }}></i>
                                            <h4>{image.title}</h4>
                                            <span className="gallery-category">{image.category}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="gallery-actions">
                    {hasMore && (
                        <button className="view-more-btn" onClick={loadMore} style={{
                            border: `2px solid ${color_code_1}`,
                            color: color_code_1
                        }}>
                            <i className="bi bi-plus-circle"></i> View More ({filteredImages.length - visibleCount} remaining)
                        </button>
                    )}

                    {hasLess && (
                        <button className="view-less-btn" onClick={loadLess} style={{
                            border: `2px solid ${color_code_1}`,
                            color: color_code_1
                        }}>
                            <i className="bi bi-dash-circle"></i> View Less
                        </button>
                    )}
                </div>

                {selectedImage && (
                    <div className="lightbox" onClick={closeLightbox}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                    >
                        <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
                            <button className="lightbox-close" onClick={closeLightbox}>
                                <i className="bi bi-x-lg"></i>
                            </button>

                            <button className="lightbox-nav lightbox-prev" onClick={prevImage}>
                                <i className="bi bi-chevron-left"></i>
                            </button>

                            <div className="lightbox-image-wrapper">
                                <img
                                    src={selectedImage.image}
                                    alt={selectedImage.title}
                                    className="lightbox-image"
                                    style={{
                                        aspectRatio: selectedImage.aspect_ratio || '4/3',
                                        maxHeight: '70vh',
                                        width: '100%',
                                        height: 'auto',
                                        objectFit: 'contain'
                                    }}
                                />
                            </div>

                            <button className="lightbox-nav lightbox-next" onClick={nextImage}>
                                <i className="bi bi-chevron-right"></i>
                            </button>

                            <div className="lightbox-info">
                                <h3 style={{ color: color_code_1 }}>{selectedImage.title}</h3>
                                <p>{selectedImage.description}</p>
                                <span className="lightbox-category" style={{
                                    background: `linear-gradient(135deg, ${color_code_1}, ${color_code_2})`
                                }}>
                                    {selectedImage.category}
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Home_Gallery;
// src/routes/components/Home_Gallery.jsx
import React, { useState, useRef, useEffect } from 'react';
import env_export from '../../config/env_export';
import "../assets/css/Home_Gallery.css";

const Home_Gallery = () => {
    const { 
        TEAM_TAG, 
        TEAM_NAME, 
        COLOR_CODE_1, 
        COLOR_CODE_2 
    } = env_export;

    // Get number of columns based on screen size (matches CSS grid)
    const getColumnsPerRow = () => {
        if (typeof window === 'undefined') return 4;
        const width = window.innerWidth;
        if (width <= 480) return 2;   // Mobile: 2 columns
        if (width <= 768) return 3;   // Tablet: 3 columns
        if (width <= 1024) return 4;  // iPad: 4 columns
        return 4;                      // Laptop/Desktop: 4 columns
    };

    // Get count for 3 rows based on screen size
    const getInitialCount = () => {
        return getColumnsPerRow() * 3; // 3 rows
    };

    const [selectedImage, setSelectedImage] = useState(null);
    const [filter, setFilter] = useState('all');
    const [columnsPerRow, setColumnsPerRow] = useState(getColumnsPerRow());
    const [initialCount, setInitialCount] = useState(getInitialCount());
    const [visibleCount, setVisibleCount] = useState(getInitialCount());
    const [touchStartX, setTouchStartX] = useState(0);
    const [touchEndX, setTouchEndX] = useState(0);
    const galleryRef = useRef(null);

    // Gallery images data with different aspect ratios
    const galleryImages = [
        {
            id: 1,
            title: 'Team Victory',
            category: 'matches',
            image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=600&fit=crop',
            description: 'Our team celebrating championship victory',
            aspect_ratio: '1/1'
        },
        {
            id: 2,
            title: 'Training Session',
            category: 'training',
            image: 'https://images.unsplash.com/photo-1511882150382-421056c89033?w=600&h=800&fit=crop',
            description: 'Intense training session at the bootcamp',
            aspect_ratio: '3/4'
        },
        {
            id: 3,
            title: 'Tournament Finals',
            category: 'matches',
            image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=600&fit=crop',
            description: 'Grand finals at the esports arena',
            aspect_ratio: '16/9'
        },
        {
            id: 4,
            title: 'Team Photo',
            category: 'team',
            image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&h=800&fit=crop',
            description: 'Official team photo 2026',
            aspect_ratio: '3/4'
        },
        {
            id: 5,
            title: 'Practice Room',
            category: 'training',
            image: 'https://images.unsplash.com/photo-1517594422361-5eeb8ae275a9?w=800&h=400&fit=crop',
            description: 'State-of-the-art practice facility',
            aspect_ratio: '21/9'
        },
        {
            id: 6,
            title: 'Fan Meetup',
            category: 'events',
            image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&h=600&fit=crop',
            description: 'Meeting our amazing fans',
            aspect_ratio: '4/3'
        },
        {
            id: 7,
            title: 'Team Dinner',
            category: 'team',
            image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=800&fit=crop',
            description: 'Team bonding dinner',
            aspect_ratio: '3/4'
        },
        {
            id: 8,
            title: 'Tournament Arena',
            category: 'events',
            image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&h=400&fit=crop',
            description: 'The esports arena during finals',
            aspect_ratio: '21/9'
        },
        {
            id: 9,
            title: 'Gear Setup',
            category: 'training',
            image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&h=800&fit=crop',
            description: 'Professional gaming gear setup',
            aspect_ratio: '3/4'
        },
        {
            id: 10,
            title: 'Championship Trophy',
            category: 'matches',
            image: 'https://images.unsplash.com/photo-1511882150382-421056c89033?w=800&h=600&fit=crop',
            description: 'Lifting the championship trophy',
            aspect_ratio: '1/1'
        },
        {
            id: 11,
            title: 'Bootcamp Day',
            category: 'training',
            image: 'https://images.unsplash.com/photo-1517594422361-5eeb8ae275a9?w=800&h=400&fit=crop',
            description: 'Day at the bootcamp facility',
            aspect_ratio: '21/9'
        },
        {
            id: 12,
            title: 'Victory Celebration',
            category: 'matches',
            image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&h=600&fit=crop',
            description: 'Celebrating victory with fans',
            aspect_ratio: '16/9'
        },
        {
            id: 13,
            title: 'Team Strategy',
            category: 'team',
            image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&h=800&fit=crop',
            description: 'Planning strategies together',
            aspect_ratio: '3/4'
        },
        {
            id: 14,
            title: 'Esports Arena',
            category: 'events',
            image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&h=400&fit=crop',
            description: 'The massive esports arena',
            aspect_ratio: '21/9'
        },
        {
            id: 15,
            title: 'Player Focus',
            category: 'training',
            image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&h=800&fit=crop',
            description: 'Player in deep focus',
            aspect_ratio: '3/4'
        },
        {
            id: 16,
            title: 'New Champion',
            category: 'matches',
            image: 'https://images.unsplash.com/photo-1511882150382-421056c89033?w=800&h=800&fit=crop',
            description: 'New champion crowned',
            aspect_ratio: '1/1'
        },
        {
            id: 17,
            title: 'Team Celebration',
            category: 'team',
            image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=500&fit=crop',
            description: 'Team celebration after victory',
            aspect_ratio: '16/10'
        },
        {
            id: 18,
            title: 'Gaming Setup',
            category: 'training',
            image: 'https://images.unsplash.com/photo-1517594422361-5eeb8ae275a9?w=600&h=600&fit=crop',
            description: 'Professional gaming setup',
            aspect_ratio: '1/1'
        },
        {
            id: 19,
            title: 'Fan Celebration',
            category: 'events',
            image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&h=600&fit=crop',
            description: 'Fans celebrating with the team',
            aspect_ratio: '4/3'
        },
        {
            id: 20,
            title: 'Team Meeting',
            category: 'team',
            image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=450&fit=crop',
            description: 'Strategic team meeting',
            aspect_ratio: '16/9'
        },
    ];

    // Filter categories
    const categories = [
        { id: 'all', label: 'All' },
        { id: 'matches', label: 'Matches' },
        { id: 'training', label: 'Training' },
        { id: 'team', label: 'Team' },
        { id: 'events', label: 'Events' },
    ];

    // Handle resize for responsive row count
    useEffect(() => {
        const handleResize = () => {
            const newColumns = getColumnsPerRow();
            const newInitial = newColumns * 3; // 3 rows
            setColumnsPerRow(newColumns);
            setInitialCount(newInitial);
            // If user hasn't loaded more than initial, update visible count
            setVisibleCount(prev => {
                if (prev <= initialCount) {
                    return newInitial;
                }
                return prev;
            });
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [initialCount]);

    // Filter images based on selected category
    const filteredImages = filter === 'all' 
        ? galleryImages 
        : galleryImages.filter(img => img.category === filter);

    // Get visible images
    const visibleImages = filteredImages.slice(0, visibleCount);
    const hasMore = visibleCount < filteredImages.length;
    const hasLess = visibleCount > initialCount;

    // Load more images (3 more rows)
    const loadMore = () => {
        const additionalRows = columnsPerRow * 3; // 3 more rows
        setVisibleCount(prev => Math.min(prev + additionalRows, filteredImages.length));
    };

    // Load less images (reset to initial 3 rows)
    const loadLess = () => {
        setVisibleCount(initialCount);
        const gallerySection = document.getElementById('home-gallery-section');
        if (gallerySection) {
            gallerySection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // Reset visible count when filter changes
    const handleFilterChange = (categoryId) => {
        setFilter(categoryId);
        setVisibleCount(initialCount);
    };

    // Touch handlers for mobile swipe
    const handleTouchStart = (e) => {
        setTouchStartX(e.touches[0].clientX);
    };

    const handleTouchMove = (e) => {
        setTouchEndX(e.touches[0].clientX);
    };

    const handleTouchEnd = () => {
        if (selectedImage && touchStartX - touchEndX > 50) {
            nextImage();
        } else if (selectedImage && touchEndX - touchStartX > 50) {
            prevImage();
        }
        setTouchStartX(0);
        setTouchEndX(0);
    };

    // Open lightbox
    const openLightbox = (image) => {
        setSelectedImage(image);
        document.body.style.overflow = 'hidden';
    };

    // Close lightbox
    const closeLightbox = () => {
        setSelectedImage(null);
        document.body.style.overflow = 'auto';
    };

    // Next/Prev image
    const nextImage = () => {
        const currentIndex = filteredImages.findIndex(img => img.id === selectedImage.id);
        const nextIndex = (currentIndex + 1) % filteredImages.length;
        setSelectedImage(filteredImages[nextIndex]);
    };

    const prevImage = () => {
        const currentIndex = filteredImages.findIndex(img => img.id === selectedImage.id);
        const prevIndex = (currentIndex - 1 + filteredImages.length) % filteredImages.length;
        setSelectedImage(filteredImages[prevIndex]);
    };

    // Get grid span based on aspect ratio
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

    return (
        <section id="home-gallery-section" className="home-gallery-section">
            <div className="container">
                {/* Section Header */}
                <div className="section-header">
                    <span className="section-badge" style={{ 
                        background: `linear-gradient(135deg, ${COLOR_CODE_1}, ${COLOR_CODE_2})`
                    }}>
                        Our Moments
                    </span>
                    <h2 className="section-title">
                        <span style={{ color: COLOR_CODE_1 }}>Photo</span> Gallery
                    </h2>
                    <p className="section-subtitle">
                        Capturing the best moments of {TEAM_NAME}
                    </p>
                </div>

                {/* Filter Buttons */}
                <div className="gallery-controls">
                    <div className="gallery-filters">
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                className={`filter-btn ${filter === cat.id ? 'active' : ''}`}
                                onClick={() => handleFilterChange(cat.id)}
                                style={{
                                    borderColor: filter === cat.id ? COLOR_CODE_1 : 'var(--border-color-secondary)',
                                    color: filter === cat.id ? COLOR_CODE_1 : 'var(--font-color-secondary)'
                                }}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Gallery Grid */}
                <div className="gallery-grid" ref={galleryRef}>
                    {visibleImages.map((image) => {
                        const aspectRatio = image.aspect_ratio || '4/3';
                        return (
                            <div 
                                key={image.id} 
                                className={`gallery-item ${getGridSpan(aspectRatio)}`}
                                onClick={() => openLightbox(image)}
                                style={{
                                    border: `2px solid ${COLOR_CODE_1}22`,
                                    aspectRatio: aspectRatio
                                }}
                            >
                                <div className="gallery-image-wrapper">
                                    <img 
                                        src={image.image} 
                                        alt={image.title}
                                        className="gallery-image"
                                        loading="lazy"
                                    />
                                    <div className="gallery-overlay" style={{
                                        background: `linear-gradient(135deg, ${COLOR_CODE_1}99, ${COLOR_CODE_2}99)`
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

                {/* View More / View Less Buttons */}
                <div className="gallery-actions">
                    {hasMore && (
                        <button 
                            className="view-more-btn"
                            onClick={loadMore}
                            style={{
                                border: `2px solid ${COLOR_CODE_1}`,
                                color: COLOR_CODE_1
                            }}
                        >
                            <i className="bi bi-plus-circle"></i> View More ({filteredImages.length - visibleCount} remaining)
                        </button>
                    )}
                    
                    {hasLess && (
                        <button 
                            className="view-less-btn"
                            onClick={loadLess}
                            style={{
                                border: `2px solid ${COLOR_CODE_1}`,
                                color: COLOR_CODE_1
                            }}
                        >
                            <i className="bi bi-dash-circle"></i> View Less
                        </button>
                    )}
                </div>

                {/* Lightbox Modal with Touch Support */}
                {selectedImage && (
                    <div 
                        className="lightbox" 
                        onClick={closeLightbox}
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
                                <h3 style={{ color: COLOR_CODE_1 }}>{selectedImage.title}</h3>
                                <p>{selectedImage.description}</p>
                                <span className="lightbox-category" style={{
                                    background: `linear-gradient(135deg, ${COLOR_CODE_1}, ${COLOR_CODE_2})`
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
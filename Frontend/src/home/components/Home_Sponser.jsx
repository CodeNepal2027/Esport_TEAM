// // src/home/components/Home_Sponser.jsx
// import React, { useRef } from 'react';
// import { getOrgConfig } from '../../config/org_config';
// import { useHomeAPI } from '../../home/Home_API_Context';
// import "../assets/css/Home_Sponser.css";

// const Home_Sponser = () => {
//     const { color_code_1, color_code_2 } = getOrgConfig();
//     const { sponsors, loading, error, refresh } = useHomeAPI();

//     const scrollRef = useRef(null);
//     const items = sponsors || [];
//     const doubledSponsors = items.length > 0 ? [...items, ...items] : [];

//     const scrollLeft = () => {
//         if (scrollRef.current) {
//             scrollRef.current.scrollBy({ left: -200, behavior: 'smooth' });
//         }
//     };

//     const scrollRight = () => {
//         if (scrollRef.current) {
//             scrollRef.current.scrollBy({ left: 200, behavior: 'smooth' });
//         }
//     };

//     // Loading
//     if (loading && !sponsors) {
//         return (
//             <section id="home-sponser-section" className="home-sponser-section">
//                 <div className="container">
//                     <div className="section-header">
//                         <span className="section-badge" style={{
//                             background: `linear-gradient(135deg, ${color_code_1}, ${color_code_2})`
//                         }}>
//                             Our Partners
//                         </span>
//                         <h2 className="section-title">
//                             <span style={{ color: color_code_1 }}>Trusted</span> Sponsors
//                         </h2>
//                     </div>
//                     <div className="sponsor-loading">
//                         <div className="loading-spinner" style={{ borderColor: color_code_1 }}></div>
//                         <p>Loading sponsors...</p>
//                     </div>
//                 </div>
//             </section>
//         );
//     }

//     // Error
//     if (error && !sponsors) {
//         return (
//             <section id="home-sponser-section" className="home-sponser-section">
//                 <div className="container">
//                     <div className="section-error">
//                         <p>Failed to load sponsors</p>
//                         <button onClick={refresh} style={{ background: color_code_1, color: '#fff' }}>Retry</button>
//                     </div>
//                 </div>
//             </section>
//         );
//     }

//     return (
//         <section id="home-sponser-section" className="home-sponser-section">
//             <div className="container">
//                 <div className="section-header">
//                     <span className="section-badge" style={{
//                         background: `linear-gradient(135deg, ${color_code_1}, ${color_code_2})`
//                     }}>
//                         Our Partners
//                     </span>
//                     <h2 className="section-title">
//                         <span style={{ color: color_code_1 }}>Trusted</span> Sponsors
//                     </h2>
//                     <p className="section-subtitle">
//                         Proudly supported by industry leaders who believe in our vision
//                     </p>
//                 </div>

//                 {items.length > 0 ? (
//                     <div className="sponsor-carousel-wrapper">
//                         <button className="carousel-btn carousel-btn-left" onClick={scrollLeft} style={{
//                             background: `linear-gradient(135deg, ${color_code_1}, ${color_code_2})`
//                         }}>
//                             <i className="bi bi-arrow-left-circle"></i>
//                         </button>

//                         <div className="sponsor-carousel" ref={scrollRef}>
//                             <div className="sponsor-track">
//                                 {doubledSponsors.map((sponsor, index) => (
//                                     <div key={`${sponsor.id}-${index}`} className="sponsor-item">
//                                         <div className="sponsor-logo-wrapper">
//                                             {sponsor.logo ? (
//                                                 <img
//                                                     src={sponsor.logo}
//                                                     alt={sponsor.name}
//                                                     className="sponsor-logo"
//                                                     loading="lazy"
//                                                     onError={(e) => {
//                                                         e.target.style.display = 'none';
//                                                         const fallback = document.createElement('span');
//                                                         fallback.className = 'sponsor-fallback';
//                                                         fallback.textContent = sponsor.name;
//                                                         fallback.style.color = color_code_1;
//                                                         e.target.parentElement.appendChild(fallback);
//                                                     }}
//                                                 />
//                                             ) : (
//                                                 <span className="sponsor-fallback" style={{ color: color_code_1 }}>
//                                                     {sponsor.name}
//                                                 </span>
//                                             )}
//                                         </div>
//                                     </div>
//                                 ))}
//                             </div>
//                         </div>

//                         <button className="carousel-btn carousel-btn-right" onClick={scrollRight} style={{
//                             background: `linear-gradient(135deg, ${color_code_1}, ${color_code_2})`
//                         }}>
//                             <i className="bi bi-arrow-right-circle"></i>
//                         </button>
//                     </div>
//                 ) : (
//                     <div className="sponsor-empty">
//                         <p>No sponsors available at the moment.</p>
//                     </div>
//                 )}

//                 <div className="sponsor-cta" style={{
//                     background: `linear-gradient(135deg, ${color_code_1}22, ${color_code_2}22)`,
//                     border: `1px solid ${color_code_1}44`
//                 }}>
//                     <div className="cta-content">
//                         <h3>Become a <span style={{ color: color_code_1 }}>Partner</span></h3>
//                         <p>Join our growing family of sponsors and partners</p>
//                         <button className="cta-btn" style={{
//                             background: `linear-gradient(135deg, ${color_code_1}, ${color_code_2})`,
//                             color: '#fff'
//                         }}>
//                             <i className="bi bi-people"></i> Partner With Us
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         </section>
//     );
// };

// export default Home_Sponser;



// ============= [ New Updated code with SKELETON LOADER ] ==============
// src/home/components/Home_Sponser.jsx
import React, { useRef } from 'react';
import { getOrgConfig } from '../../config/org_config';
import { useHomeAPI } from '../../home/Home_API_Context';
import "../assets/css/Home_Sponser.css";

const Home_Sponser = () => {
    const { color_code_1, color_code_2 } = getOrgConfig();
    const { sponsors, loading, error, refresh } = useHomeAPI();

    const scrollRef = useRef(null);
    const items = sponsors || [];
    const doubledSponsors = items.length > 0 ? [...items, ...items] : [];

    const scrollLeft = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: -200, behavior: 'smooth' });
        }
    };

    const scrollRight = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: 200, behavior: 'smooth' });
        }
    };

    // Loading — skeleton loader
    if (loading && !sponsors) {
        return (
            <section id="home-sponser-section" className="home-sponser-section">
                <div className="container">
                    {/* Section Header Skeleton */}
                    <div className="section-header">
                        <div className="sponsor-skeleton sponsor-skeleton-badge"></div>
                        <div className="sponsor-skeleton sponsor-skeleton-title"></div>
                        <div className="sponsor-skeleton sponsor-skeleton-subtitle"></div>
                    </div>

                    {/* Sponsor Carousel Skeleton */}
                    <div className="sponsor-carousel-wrapper">
                        <div className="sponsor-skeleton sponsor-skeleton-carousel-btn"></div>

                        <div className="sponsor-carousel">
                            <div className="sponsor-track sponsor-track-skeleton">
                                {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                                    <div key={i} className="sponsor-item">
                                        <div className="sponsor-skeleton sponsor-skeleton-logo"></div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="sponsor-skeleton sponsor-skeleton-carousel-btn"></div>
                    </div>

                    {/* CTA Skeleton */}
                    <div className="sponsor-cta">
                        <div className="cta-content">
                            <div className="sponsor-skeleton sponsor-skeleton-cta-title"></div>
                            <div className="sponsor-skeleton sponsor-skeleton-cta-text"></div>
                            <div className="sponsor-skeleton sponsor-skeleton-cta-btn"></div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    // Error
    if (error && !sponsors) {
        return (
            <section id="home-sponser-section" className="home-sponser-section">
                <div className="container">
                    <div className="section-error">
                        <p>Failed to load sponsors</p>
                        <button onClick={refresh} style={{ background: color_code_1, color: '#fff' }}>Retry</button>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section id="home-sponser-section" className="home-sponser-section">
            <div className="container">
                <div className="section-header">
                    <span className="section-badge" style={{
                        background: `linear-gradient(135deg, ${color_code_1}, ${color_code_2})`
                    }}>
                        Our Partners
                    </span>
                    <h2 className="section-title">
                        <span style={{ color: color_code_1 }}>Trusted</span> Sponsors
                    </h2>
                    <p className="section-subtitle">
                        Proudly supported by industry leaders who believe in our vision
                    </p>
                </div>

                {items.length > 0 ? (
                    <div className="sponsor-carousel-wrapper">
                        <button className="carousel-btn carousel-btn-left" onClick={scrollLeft} style={{
                            background: `linear-gradient(135deg, ${color_code_1}, ${color_code_2})`
                        }}>
                            <i className="bi bi-arrow-left-circle"></i>
                        </button>

                        <div className="sponsor-carousel" ref={scrollRef}>
                            <div className="sponsor-track">
                                {doubledSponsors.map((sponsor, index) => (
                                    <div key={`${sponsor.id}-${index}`} className="sponsor-item">
                                        <div className="sponsor-logo-wrapper">
                                            {sponsor.logo ? (
                                                <img
                                                    src={sponsor.logo}
                                                    alt={sponsor.name}
                                                    className="sponsor-logo"
                                                    loading="lazy"
                                                    onError={(e) => {
                                                        e.target.style.display = 'none';
                                                        const fallback = document.createElement('span');
                                                        fallback.className = 'sponsor-fallback';
                                                        fallback.textContent = sponsor.name;
                                                        fallback.style.color = color_code_1;
                                                        e.target.parentElement.appendChild(fallback);
                                                    }}
                                                />
                                            ) : (
                                                <span className="sponsor-fallback" style={{ color: color_code_1 }}>
                                                    {sponsor.name}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <button className="carousel-btn carousel-btn-right" onClick={scrollRight} style={{
                            background: `linear-gradient(135deg, ${color_code_1}, ${color_code_2})`
                        }}>
                            <i className="bi bi-arrow-right-circle"></i>
                        </button>
                    </div>
                ) : (
                    <div className="sponsor-empty">
                        <p>No sponsors available at the moment.</p>
                    </div>
                )}

                <div className="sponsor-cta" style={{
                    background: `linear-gradient(135deg, ${color_code_1}22, ${color_code_2}22)`,
                    border: `1px solid ${color_code_1}44`
                }}>
                    <div className="cta-content">
                        <h3>Become a <span style={{ color: color_code_1 }}>Partner</span></h3>
                        <p>Join our growing family of sponsors and partners</p>
                        <button className="cta-btn" style={{
                            background: `linear-gradient(135deg, ${color_code_1}, ${color_code_2})`,
                            color: '#fff'
                        }}>
                            <i className="bi bi-people"></i> Partner With Us
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Home_Sponser;
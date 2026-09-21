// // src/home/components/Home_Contact.jsx
// import React, { useState } from 'react';
// import { getOrgConfig } from '../../config/org_config';
// import "../assets/css/Home_Contact.css";

// const Home_Contact = () => {
//     const { 
//         team_tag,
//         team_name,
//         color_code_1,
//         color_code_2,
//         org_email,
//         org_phone_1,
//         org_phone_2,
//         org_whatsapp,
//         org_address,
//         org_country,
//         org_working_day,
//         org_working_hour,
//         org_youtube_link,
//         org_tiktok_link,
//         org_instagram_link,
//         org_discord_link,
//         org_twitter_link,
//     } = getOrgConfig();

//     const [formData, setFormData] = useState({
//         name: '',
//         email: '',
//         subject: '',
//         message: ''
//     });

//     const [formStatus, setFormStatus] = useState(null);

//     const handleChange = (e) => {
//         setFormData({
//             ...formData,
//             [e.target.name]: e.target.value
//         });
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         setFormStatus('success');
//         setTimeout(() => {
//             setFormStatus(null);
//             setFormData({ name: '', email: '', subject: '', message: '' });
//         }, 3000);
//     };

//     return (
//         <section id="home-contact-section" className="home-contact-section">
//             <div className="container">
//                 {/* Section Header */}
//                 <div className="section-header">
//                     <span className="section-badge" style={{ 
//                         background: `linear-gradient(135deg, ${color_code_1}, ${color_code_2})`
//                     }}>
//                         Get In Touch
//                     </span>
//                     <h2 className="section-title">
//                         Let's <span style={{ color: color_code_1 }}>Connect</span>
//                     </h2>
//                     <p className="section-subtitle">
//                         Have questions or want to collaborate? Reach out to {team_name}
//                     </p>
//                 </div>

//                 <div className="contact-grid">
//                     {/* Left Side - Contact Info */}
//                     <div className="contact-left">
//                         <div className="contact-info-card" style={{
//                             background: `linear-gradient(135deg, ${color_code_1}22, ${color_code_2}22)`,
//                             border: `1px solid ${color_code_1}44`
//                         }}>
//                             {/* Email */}
//                             {org_email && (
//                                 <div className="info-item">
//                                     <div className="info-icon">
//                                         <i className="bi bi-envelope"></i>
//                                     </div>
//                                     <div className="info-text">
//                                         <h4>Email</h4>
//                                         <p>
//                                             <a href={`mailto:${org_email}`} className="info-link">
//                                                 {org_email}
//                                             </a>
//                                         </p>
//                                         <span>We'll respond within 24 hours</span>
//                                     </div>
//                                 </div>
//                             )}

//                             {/* Location */}
//                             {(org_address || org_country) && (
//                                 <div className="info-item">
//                                     <div className="info-icon">
//                                         <i className="bi bi-geo-alt"></i>
//                                     </div>
//                                     <div className="info-text">
//                                         <h4>Location</h4>
//                                         <p>{org_address}{org_address && org_country ? ', ' : ''}{org_country}</p>
//                                         <span>Visit us anytime</span>
//                                     </div>
//                                 </div>
//                             )}

//                             {/* Phone */}
//                             {(org_phone_1 || org_phone_2) && (
//                                 <div className="info-item">
//                                     <div className="info-icon">
//                                         <i className="bi bi-phone"></i>
//                                     </div>
//                                     <div className="info-text">
//                                         <h4>Phone</h4>
//                                         {org_phone_1 && (
//                                             <p>
//                                                 <a href={`tel:${org_phone_1}`} className="info-link">
//                                                     {org_phone_1}
//                                                 </a>
//                                             </p>
//                                         )}
//                                         {org_phone_2 && (
//                                             <p>
//                                                 <a href={`tel:${org_phone_2}`} className="info-link">
//                                                     {org_phone_2}
//                                                 </a>
//                                             </p>
//                                         )}
//                                         <span>Give us a call</span>
//                                     </div>
//                                 </div>
//                             )}

//                             {/* WhatsApp */}
//                             {org_whatsapp && (
//                                 <div className="info-item">
//                                     <div className="info-icon">
//                                         <i className="bi bi-whatsapp"></i>
//                                     </div>
//                                     <div className="info-text">
//                                         <h4>WhatsApp</h4>
//                                         <p>
//                                             <a 
//                                                 href={`https://wa.me/${org_whatsapp.replace(/[^0-9]/g, '')}`} 
//                                                 target="_blank" 
//                                                 rel="noopener noreferrer"
//                                                 className="info-link"
//                                             >
//                                                 {org_whatsapp}
//                                             </a>
//                                         </p>
//                                         <span>Chat with us</span>
//                                     </div>
//                                 </div>
//                             )}

//                             {/* Working Hours */}
//                             {(org_working_day || org_working_hour) && (
//                                 <div className="info-item">
//                                     <div className="info-icon">
//                                         <i className="bi bi-clock"></i>
//                                     </div>
//                                     <div className="info-text">
//                                         <h4>Working Hours</h4>
//                                         <p>{org_working_hour}</p>
//                                         <span>{org_working_day}</span>
//                                     </div>
//                                 </div>
//                             )}
//                         </div>

//                         {/* Social Links */}
//                         {(org_youtube_link || org_tiktok_link || org_instagram_link || org_discord_link || org_twitter_link) && (
//                             <div className="contact-social">
//                                 <h4>Follow <span style={{ color: color_code_1 }}>{team_tag}</span></h4>
//                                 <div className="social-links">
//                                     {org_twitter_link && (
//                                         <a 
//                                             href={org_twitter_link} 
//                                             target="_blank" 
//                                             rel="noopener noreferrer"
//                                             className="social-icon"
//                                         >
//                                             <i className="bi bi-twitter"></i>
//                                         </a>
//                                     )}
//                                     {org_instagram_link && (
//                                         <a 
//                                             href={org_instagram_link} 
//                                             target="_blank" 
//                                             rel="noopener noreferrer"
//                                             className="social-icon"
//                                         >
//                                             <i className="bi bi-instagram"></i>
//                                         </a>
//                                     )}
//                                     {org_youtube_link && (
//                                         <a 
//                                             href={org_youtube_link} 
//                                             target="_blank" 
//                                             rel="noopener noreferrer"
//                                             className="social-icon"
//                                         >
//                                             <i className="bi bi-youtube"></i>
//                                         </a>
//                                     )}
//                                     {org_discord_link && (
//                                         <a 
//                                             href={org_discord_link} 
//                                             target="_blank" 
//                                             rel="noopener noreferrer"
//                                             className="social-icon"
//                                         >
//                                             <i className="bi bi-discord"></i>
//                                         </a>
//                                     )}
//                                     {org_tiktok_link && (
//                                         <a 
//                                             href={org_tiktok_link} 
//                                             target="_blank" 
//                                             rel="noopener noreferrer"
//                                             className="social-icon"
//                                         >
//                                             <i className="bi bi-tiktok"></i>
//                                         </a>
//                                     )}
//                                 </div>
//                             </div>
//                         )}
//                     </div>

//                     {/* Right Side - Contact Form */}
//                     <div className="contact-right">
//                         <div className="contact-form" style={{
//                             border: `1px solid ${color_code_1}44`,
//                             background: `linear-gradient(135deg, ${color_code_1}11, ${color_code_2}11)`
//                         }}>
//                             <div className="form-header">
//                                 <h3>Send Us a <span style={{ color: color_code_1 }}>Message</span></h3>
//                                 <p>We'd love to hear from you</p>
//                             </div>

//                             <form onSubmit={handleSubmit}>
//                                 <div className="form-row">
//                                     <div className="form-group">
//                                         <label>
//                                             <i className="bi bi-person" style={{ color: color_code_1 }}></i>
//                                             Your Name
//                                         </label>
//                                         <input
//                                             type="text"
//                                             name="name"
//                                             placeholder="John Doe"
//                                             value={formData.name}
//                                             onChange={handleChange}
//                                             required
//                                             style={{
//                                                 border: `1px solid ${color_code_1}44`,
//                                                 background: 'var(--bg-color-primary)',
//                                                 color: 'var(--font-color-primary)'
//                                             }}
//                                         />
//                                     </div>

//                                     <div className="form-group">
//                                         <label>
//                                             <i className="bi bi-envelope" style={{ color: color_code_1 }}></i>
//                                             Email Address
//                                         </label>
//                                         <input
//                                             type="email"
//                                             name="email"
//                                             placeholder="john@example.com"
//                                             value={formData.email}
//                                             onChange={handleChange}
//                                             required
//                                             style={{
//                                                 border: `1px solid ${color_code_1}44`,
//                                                 background: 'var(--bg-color-primary)',
//                                                 color: 'var(--font-color-primary)'
//                                             }}
//                                         />
//                                     </div>
//                                 </div>

//                                 <div className="form-group">
//                                     <label>
//                                         <i className="bi bi-tag" style={{ color: color_code_1 }}></i>
//                                         Subject
//                                     </label>
//                                     <input
//                                         type="text"
//                                         name="subject"
//                                         placeholder="What's this about?"
//                                         value={formData.subject}
//                                         onChange={handleChange}
//                                         required
//                                         style={{
//                                             border: `1px solid ${color_code_1}44`,
//                                             background: 'var(--bg-color-primary)',
//                                             color: 'var(--font-color-primary)'
//                                         }}
//                                     />
//                                 </div>

//                                 <div className="form-group">
//                                     <label>
//                                         <i className="bi bi-chat" style={{ color: color_code_1 }}></i>
//                                         Message
//                                     </label>
//                                     <textarea
//                                         name="message"
//                                         rows="4"
//                                         placeholder="Write your message here..."
//                                         value={formData.message}
//                                         onChange={handleChange}
//                                         required
//                                         style={{
//                                             border: `1px solid ${color_code_1}44`,
//                                             background: 'var(--bg-color-primary)',
//                                             color: 'var(--font-color-primary)',
//                                             resize: 'vertical'
//                                         }}
//                                     ></textarea>
//                                 </div>

//                                 <button 
//                                     type="submit" 
//                                     className="submit-btn"
//                                     style={{
//                                         background: `linear-gradient(135deg, ${color_code_1}, ${color_code_2})`,
//                                         color: '#fff'
//                                     }}
//                                 >
//                                     <i className="bi bi-send"></i> Send Message
//                                     <span className="btn-arrow">→</span>
//                                 </button>

//                                 {formStatus === 'success' && (
//                                     <div className="form-success" style={{ color: color_code_2 }}>
//                                         <i className="bi bi-check-circle-fill"></i> 
//                                         Message sent successfully! We'll get back to you soon.
//                                     </div>
//                                 )}
//                             </form>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </section>
//     );
// };

// export default Home_Contact;





// ============== [ New Updated code with SKELETON LOADER ] ==================
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

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const [formStatus, setFormStatus] = useState(null);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setFormStatus('success');
        setTimeout(() => {
            setFormStatus(null);
            setFormData({ name: '', email: '', subject: '', message: '' });
        }, 3000);
    };

    // Skeleton — only when explicitly told to load
    if (loading) {
        return (
            <section id="home-contact-section" className="home-contact-section">
                <div className="container">
                    {/* Section Header Skeleton */}
                    <div className="section-header">
                        <div className="contact-skeleton contact-skeleton-badge"></div>
                        <div className="contact-skeleton contact-skeleton-title"></div>
                        <div className="contact-skeleton contact-skeleton-subtitle"></div>
                    </div>

                    <div className="contact-grid">
                        {/* Left — info cards skeleton */}
                        <div className="contact-left">
                            <div className="contact-info-card">
                                {[0].map((i) => (
                                    <div key={i} className="info-item">
                                        <div className="contact-skeleton contact-skeleton-icon"></div>
                                        <div className="info-text">
                                            <div className="contact-skeleton contact-skeleton-info-title"></div>
                                            <div className="contact-skeleton contact-skeleton-info-text"></div>
                                            <div className="contact-skeleton contact-skeleton-info-sub"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="contact-social">
                                <div className="contact-skeleton contact-skeleton-social-title"></div>
                                <div className="social-links">
                                    {[0, 1, 2, 3, 4].map((i) => (
                                        <div key={i} className="contact-skeleton contact-skeleton-social-icon"></div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right — form skeleton */}
                        <div className="contact-right">
                            <div className="contact-form">
                                <div className="form-header">
                                    <div className="contact-skeleton contact-skeleton-form-title"></div>
                                    <div className="contact-skeleton contact-skeleton-form-sub"></div>
                                </div>

                                <div className="form-row">
                                    {[0, 1].map((i) => (
                                        <div key={i} className="form-group">
                                            <div className="contact-skeleton contact-skeleton-label"></div>
                                            <div className="contact-skeleton contact-skeleton-input"></div>
                                        </div>
                                    ))}
                                </div>

                                {[0, 1].map((i) => (
                                    <div key={i} className="form-group">
                                        <div className="contact-skeleton contact-skeleton-label"></div>
                                        <div className="contact-skeleton contact-skeleton-input"></div>
                                    </div>
                                ))}

                                <div className="form-group">
                                    <div className="contact-skeleton contact-skeleton-label"></div>
                                    <div className="contact-skeleton contact-skeleton-textarea"></div>
                                </div>

                                <div className="contact-skeleton contact-skeleton-submit"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section id="home-contact-section" className="home-contact-section">
            <div className="container">
                 {/* Section Header */}
                <div className="section-header">
                    <span className="section-badge" style={{ 
                        background: `linear-gradient(135deg, ${color_code_1}, ${color_code_2})`
                    }}>
                        Get In Touch
                    </span>
                    <h2 className="section-title">
                        Let's <span style={{ color: color_code_1 }}>Connect</span>
                    </h2>
                    <p className="section-subtitle">
                        Have questions or want to collaborate? Reach out to {team_name}
                    </p>
                </div>

                <div className="contact-grid">
                    {/* Left Side - Contact Info */}
                    <div className="contact-left">
                        <div className="contact-info-card" style={{
                            background: `linear-gradient(135deg, ${color_code_1}22, ${color_code_2}22)`,
                            border: `1px solid ${color_code_1}44`
                        }}>
                            {/* Email */}
                            {org_email && (
                                <div className="info-item">
                                    <div className="info-icon">
                                        <i className="bi bi-envelope"></i>
                                    </div>
                                    <div className="info-text">
                                        <h4>Email</h4>
                                        <p>
                                            <a href={`mailto:${org_email}`} className="info-link">
                                                {org_email}
                                            </a>
                                        </p>
                                        <span>We'll respond within 24 hours</span>
                                    </div>
                                </div>
                            )}

                            {/* Location */}
                            {(org_address || org_country) && (
                                <div className="info-item">
                                    <div className="info-icon">
                                        <i className="bi bi-geo-alt"></i>
                                    </div>
                                    <div className="info-text">
                                        <h4>Location</h4>
                                        <p>{org_address}{org_address && org_country ? ', ' : ''}{org_country}</p>
                                        <span>Visit us anytime</span>
                                    </div>
                                </div>
                            )}

                            {/* Phone */}
                            {(org_phone_1 || org_phone_2) && (
                                <div className="info-item">
                                    <div className="info-icon">
                                        <i className="bi bi-phone"></i>
                                    </div>
                                    <div className="info-text">
                                        <h4>Phone</h4>
                                        {org_phone_1 && (
                                            <p>
                                                <a href={`tel:${org_phone_1}`} className="info-link">
                                                    {org_phone_1}
                                                </a>
                                            </p>
                                        )}
                                        {org_phone_2 && (
                                            <p>
                                                <a href={`tel:${org_phone_2}`} className="info-link">
                                                    {org_phone_2}
                                                </a>
                                            </p>
                                        )}
                                        <span>Give us a call</span>
                                    </div>
                                </div>
                            )}

                            {/* WhatsApp */}
                            {org_whatsapp && (
                                <div className="info-item">
                                    <div className="info-icon">
                                        <i className="bi bi-whatsapp"></i>
                                    </div>
                                    <div className="info-text">
                                        <h4>WhatsApp</h4>
                                        <p>
                                            <a 
                                                href={`https://wa.me/${org_whatsapp.replace(/[^0-9]/g, '')}`} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="info-link"
                                            >
                                                {org_whatsapp}
                                            </a>
                                        </p>
                                        <span>Chat with us</span>
                                    </div>
                                </div>
                            )}

                            {/* Working Hours */}
                            {(org_working_day || org_working_hour) && (
                                <div className="info-item">
                                    <div className="info-icon">
                                        <i className="bi bi-clock"></i>
                                    </div>
                                    <div className="info-text">
                                        <h4>Working Hours</h4>
                                        <p>{org_working_hour}</p>
                                        <span>{org_working_day}</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Social Links */}
                        {(org_youtube_link || org_tiktok_link || org_instagram_link || org_discord_link || org_twitter_link) && (
                            <div className="contact-social">
                                <h4>Follow <span style={{ color: color_code_1 }}>{team_tag}</span></h4>
                                <div className="social-links">
                                    {org_twitter_link && (
                                        <a 
                                            href={org_twitter_link} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="social-icon"
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
                                        >
                                            <i className="bi bi-tiktok"></i>
                                        </a>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Side - Contact Form */}
                    <div className="contact-right">
                        <div className="contact-form" style={{
                            border: `1px solid ${color_code_1}44`,
                            background: `linear-gradient(135deg, ${color_code_1}11, ${color_code_2}11)`
                        }}>
                            <div className="form-header">
                                <h3>Send Us a <span style={{ color: color_code_1 }}>Message</span></h3>
                                <p>We'd love to hear from you</p>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>
                                            <i className="bi bi-person" style={{ color: color_code_1 }}></i>
                                            Your Name
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            placeholder="John Doe"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            style={{
                                                border: `1px solid ${color_code_1}44`,
                                                background: 'var(--bg-color-primary)',
                                                color: 'var(--font-color-primary)'
                                            }}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>
                                            <i className="bi bi-envelope" style={{ color: color_code_1 }}></i>
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            placeholder="john@example.com"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            style={{
                                                border: `1px solid ${color_code_1}44`,
                                                background: 'var(--bg-color-primary)',
                                                color: 'var(--font-color-primary)'
                                            }}
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>
                                        <i className="bi bi-tag" style={{ color: color_code_1 }}></i>
                                        Subject
                                    </label>
                                    <input
                                        type="text"
                                        name="subject"
                                        placeholder="What's this about?"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        required
                                        style={{
                                            border: `1px solid ${color_code_1}44`,
                                            background: 'var(--bg-color-primary)',
                                            color: 'var(--font-color-primary)'
                                        }}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>
                                        <i className="bi bi-chat" style={{ color: color_code_1 }}></i>
                                        Message
                                    </label>
                                    <textarea
                                        name="message"
                                        rows="4"
                                        placeholder="Write your message here..."
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        style={{
                                            border: `1px solid ${color_code_1}44`,
                                            background: 'var(--bg-color-primary)',
                                            color: 'var(--font-color-primary)',
                                            resize: 'vertical'
                                        }}
                                    ></textarea>
                                </div>

                                <button 
                                    type="submit" 
                                    className="submit-btn"
                                    style={{
                                        background: `linear-gradient(135deg, ${color_code_1}, ${color_code_2})`,
                                        color: '#fff'
                                    }}
                                >
                                    <i className="bi bi-send"></i> Send Message
                                    <span className="btn-arrow">→</span>
                                </button>

                                {formStatus === 'success' && (
                                    <div className="form-success" style={{ color: color_code_2 }}>
                                        <i className="bi bi-check-circle-fill"></i> 
                                        Message sent successfully! We'll get back to you soon.
                                    </div>
                                )}
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Home_Contact;
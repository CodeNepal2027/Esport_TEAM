// src/routes/components/Home_Contact.jsx
import React, { useState } from 'react';
import env_export from '../../config/env_export';
import "../assets/css/Home_Contact.css";

const Home_Contact = () => {
    const { 
        TEAM_TAG, 
        TEAM_NAME, 
        COLOR_CODE_1, 
        COLOR_CODE_2 
    } = env_export;

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

    return (
        <section id="home-contact-section" className="home-contact-section">
            <div className="container">
                {/* Section Header */}
                <div className="section-header">
                    <span className="section-badge" style={{ 
                        background: `linear-gradient(135deg, ${COLOR_CODE_1}, ${COLOR_CODE_2})`
                    }}>
                        Get In Touch
                    </span>
                    <h2 className="section-title">
                        Let's <span style={{ color: COLOR_CODE_1 }}>Connect</span>
                    </h2>
                    <p className="section-subtitle">
                        Have questions or want to collaborate? Reach out to {TEAM_NAME}
                    </p>
                </div>

                <div className="contact-grid">
                    {/* Left Side - Contact Info */}
                    <div className="contact-left">
                        <div className="contact-info-card" style={{
                            background: `linear-gradient(135deg, ${COLOR_CODE_1}22, ${COLOR_CODE_2}22)`,
                            border: `1px solid ${COLOR_CODE_1}44`
                        }}>
                            <div className="info-item">
                                <div className="info-icon">
                                    <i className="bi bi-envelope"></i>
                                </div>
                                <div className="info-text">
                                    <h4>Email</h4>
                                    <p>info@t2k.com</p>
                                    <span>We'll respond within 24 hours</span>
                                </div>
                            </div>

                            <div className="info-item">
                                <div className="info-icon">
                                    <i className="bi bi-geo-alt"></i>
                                </div>
                                <div className="info-text">
                                    <h4>Location</h4>
                                    <p>Esports Arena, Seoul</p>
                                    <span>South Korea</span>
                                </div>
                            </div>

                            <div className="info-item">
                                <div className="info-icon">
                                    <i className="bi bi-phone"></i>
                                </div>
                                <div className="info-text">
                                    <h4>Phone</h4>
                                    <p>+82 1234 5678</p>
                                    <span>Mon-Fri 9AM-6PM</span>
                                </div>
                            </div>

                            <div className="info-item">
                                <div className="info-icon">
                                    <i className="bi bi-clock"></i>
                                </div>
                                <div className="info-text">
                                    <h4>Working Hours</h4>
                                    <p>9:00 AM - 6:00 PM</p>
                                    <span>Monday - Friday</span>
                                </div>
                            </div>
                        </div>

                        {/* Social Links */}
                        <div className="contact-social">
                            <h4>Follow <span style={{ color: COLOR_CODE_1 }}>{TEAM_TAG}</span></h4>
                            <div className="social-links">
                                <a href="#" className="social-icon" style={{ color: COLOR_CODE_1 }}>
                                    <i className="bi bi-twitter"></i>
                                </a>
                                <a href="#" className="social-icon" style={{ color: COLOR_CODE_2 }}>
                                    <i className="bi bi-instagram"></i>
                                </a>
                                <a href="#" className="social-icon" style={{ color: '#FF0000' }}>
                                    <i className="bi bi-youtube"></i>
                                </a>
                                <a href="#" className="social-icon" style={{ color: '#9146FF' }}>
                                    <i className="bi bi-twitch"></i>
                                </a>
                                <a href="#" className="social-icon" style={{ color: '#5865F2' }}>
                                    <i className="bi bi-discord"></i>
                                </a>
                                <a href="#" className="social-icon" style={{ color: '#000000' }}>
                                    <i className="bi bi-tiktok"></i>
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Contact Form */}
                    <div className="contact-right">
                        <div className="contact-form" style={{
                            border: `1px solid ${COLOR_CODE_1}44`,
                            background: `linear-gradient(135deg, ${COLOR_CODE_1}11, ${COLOR_CODE_2}11)`
                        }}>
                            <div className="form-header">
                                <h3>Send Us a <span style={{ color: COLOR_CODE_1 }}>Message</span></h3>
                                <p>We'd love to hear from you</p>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>
                                            <i className="bi bi-person" style={{ color: COLOR_CODE_1 }}></i>
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
                                                border: `1px solid ${COLOR_CODE_1}44`,
                                                background: 'var(--bg-color-primary)',
                                                color: 'var(--font-color-primary)'
                                            }}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>
                                            <i className="bi bi-envelope" style={{ color: COLOR_CODE_1 }}></i>
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
                                                border: `1px solid ${COLOR_CODE_1}44`,
                                                background: 'var(--bg-color-primary)',
                                                color: 'var(--font-color-primary)'
                                            }}
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>
                                        <i className="bi bi-tag" style={{ color: COLOR_CODE_1 }}></i>
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
                                            border: `1px solid ${COLOR_CODE_1}44`,
                                            background: 'var(--bg-color-primary)',
                                            color: 'var(--font-color-primary)'
                                        }}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>
                                        <i className="bi bi-chat" style={{ color: COLOR_CODE_1 }}></i>
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
                                            border: `1px solid ${COLOR_CODE_1}44`,
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
                                        background: `linear-gradient(135deg, ${COLOR_CODE_1}, ${COLOR_CODE_2})`,
                                        color: '#fff'
                                    }}
                                >
                                    <i className="bi bi-send"></i> Send Message
                                    <span className="btn-arrow">→</span>
                                </button>

                                {formStatus === 'success' && (
                                    <div className="form-success" style={{ color: COLOR_CODE_2 }}>
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
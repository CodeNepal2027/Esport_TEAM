// src/config/env_export.jsx

// ============================================
// BACKEND URLs
// ============================================
export const BACKEND_URL_PRODUCTION = import.meta.env.VITE_BACKEND_URL_PRODUCTION || 'https://myesport.com.np/api';
export const BACKEND_URL_DEVELOPMENT = import.meta.env.VITE_BACKEND_URL_DEVELOPMENT || 'http://127.0.0.1:8000/api';

// ============================================
// POWERED BY (Footer Credit)
// ============================================
export const POWERED_BY_NAME = import.meta.env.VITE_POWERED_BY_NAME || 'Optech';
export const POWERED_BY_LINK = import.meta.env.VITE_POWERED_BY_LINK || '';
export const POWERED_BY_LOGO_URL = import.meta.env.VITE_POWERED_BY_LOGO_URL || '';

// ============================================
// TEAM IDENTITY
// ============================================
export const TEAM_TAG = import.meta.env.VITE_TEAM_TAG || 'ABC';
export const TEAM_NAME = import.meta.env.VITE_TEAM_NAME || 'ABC Esports';
export const TEAM_LOGO_URL = import.meta.env.VITE_TEAM_LOGO_URL || 'https://raw.githubusercontent.com/TrainedToKill/TrainedToKill/main/logo.png';

// ============================================
// TEAM COLORS
// ============================================
export const COLOR_CODE_1 = import.meta.env.VITE_COLOR_CODE_1 || '#FF0000';
export const COLOR_CODE_2 = import.meta.env.VITE_COLOR_CODE_2 || '#00FF00';

// ============================================
// SUBDOMAINS
// ============================================
export const ORG_SHOP = import.meta.env.VITE_ORG_SHOP || '';
export const ORG_ACHIVEMENTS = import.meta.env.VITE_ORG_ACHIVEMENTS || '';

// ============================================
// ORG SOCIAL MEDIA URLs
// ============================================
export const ORG_YOUTUBE_LINK = import.meta.env.VITE_ORG_YOUTUBE_LINK || '';
export const ORG_TIKTOK_LINK = import.meta.env.VITE_ORG_TIKTOK_LINK || '';
export const ORG_INSTAGRAM_LINK = import.meta.env.VITE_ORG_INSTAGRAM_LINK || '';
export const ORG_DISCORD_LINK = import.meta.env.VITE_ORG_DISCORD_LINK || '';
export const ORG_TWITTER_LINK = import.meta.env.VITE_ORG_TWITTER_LINK || '';

// ============================================
// ORG ADDRESSES + CONTACT
// ============================================
export const ORG_COUNTRY = import.meta.env.VITE_ORG_COUNTRY || '';
export const ORG_ADDRESS = import.meta.env.VITE_ORG_ADDRESS || '';
export const ORG_WORKING_DAY = import.meta.env.VITE_ORG_WORKING_DAY || '';
export const ORG_WORKING_HOUR = import.meta.env.VITE_ORG_WORKING_HOUR || '';
export const ORG_EMAIL = import.meta.env.VITE_ORG_EMAIL || '';
export const ORG_WHATSAPP = import.meta.env.VITE_ORG_WHATSAPP || '';
export const ORG_PHONE_1 = import.meta.env.VITE_ORG_PHONE_1 || '';
export const ORG_PHONE_2 = import.meta.env.VITE_ORG_PHONE_2 || '';

// ============================================
// DERIVED / COMPUTED
// ============================================
export const BACKEND_URL = import.meta.env.MODE === 'production' 
    ? BACKEND_URL_PRODUCTION 
    : BACKEND_URL_DEVELOPMENT;

// ============================================
// ENVIRONMENT CHECK
// ============================================
export const IS_PRODUCTION = import.meta.env.MODE === 'production';
export const IS_DEVELOPMENT = import.meta.env.MODE === 'development';
export const APP_ENV = import.meta.env.MODE;

// ============================================
// AUTO-INJECT CSS VARIABLES FROM .env
// ============================================
export const injectThemeColors = () => {
    if (typeof document === 'undefined') return;
    
    const root = document.documentElement;
    
    // Primary highlight color (from COLOR_CODE_1)
    root.style.setProperty('--highlight-color-primary', COLOR_CODE_1);
    root.style.setProperty('--highlight-color-primary-rgb', hexToRgb(COLOR_CODE_1));
    
    // Secondary highlight color (from COLOR_CODE_2)
    root.style.setProperty('--highlight-color-secondary', COLOR_CODE_2);
    root.style.setProperty('--highlight-color-secondary-rgb', hexToRgb(COLOR_CODE_2));
    
    // Also set border highlight
    root.style.setProperty('--border-color-highlight', `${hexToRgb(COLOR_CODE_1, 0.3)}`);
    
    // Set scrollbar thumb
    root.style.setProperty('--scrollbar-thumb', COLOR_CODE_1);
    
    // Set shadow glow
    root.style.setProperty('--shadow-glow', `0 0 40px ${hexToRgb(COLOR_CODE_1, 0.3)}`);
};

// Helper: Convert HEX to RGB
const hexToRgb = (hex, alpha = null) => {
    const cleanHex = hex.replace('#', '');
    const r = parseInt(cleanHex.substring(0, 2), 16);
    const g = parseInt(cleanHex.substring(2, 4), 16);
    const b = parseInt(cleanHex.substring(4, 6), 16);
    
    if (alpha !== null) {
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
    return `${r}, ${g}, ${b}`;
};

// ============================================
// EXPORT ALL AS DEFAULT OBJECT
// ============================================
const env_export = {
    // Backend URLs
    BACKEND_URL_PRODUCTION,
    BACKEND_URL_DEVELOPMENT,
    BACKEND_URL,
    
    // Powered By
    POWERED_BY_NAME,
    POWERED_BY_LINK,
    POWERED_BY_LOGO_URL,
    
    // Team Identity
    TEAM_TAG,
    TEAM_NAME,
    TEAM_LOGO_URL,
    
    // Team Colors
    COLOR_CODE_1,
    COLOR_CODE_2,
    
    // Subdomains
    ORG_SHOP,
    ORG_ACHIVEMENTS,
    
    // Social Media
    ORG_YOUTUBE_LINK,
    ORG_TIKTOK_LINK,
    ORG_INSTAGRAM_LINK,
    ORG_DISCORD_LINK,
    ORG_TWITTER_LINK,
    
    // Contact / Address
    ORG_COUNTRY,
    ORG_ADDRESS,
    ORG_WORKING_DAY,
    ORG_WORKING_HOUR,
    ORG_EMAIL,
    ORG_WHATSAPP,
    ORG_PHONE_1,
    ORG_PHONE_2,
    
    // Environment
    IS_PRODUCTION,
    IS_DEVELOPMENT,
    APP_ENV,
    
    // Helpers
    injectThemeColors,
};

export default env_export;
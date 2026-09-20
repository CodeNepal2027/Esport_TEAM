// src/config/env_export.jsx
// ============================================
// ENV EXPORT — reads from .env and exports
// ============================================

// ============================================
// BACKEND URLs
// ============================================
export const BACKEND_URL_PRODUCTION = import.meta.env.VITE_BACKEND_URL_PRODUCTION || 'https://myesport.com.np/api';
export const BACKEND_URL_DEVELOPMENT = import.meta.env.VITE_BACKEND_URL_DEVELOPMENT || 'http://127.0.0.1:8000/api';

// ============================================
// MASTER DB (Optech Platform)
// ============================================
export const MASTER_API_URL = import.meta.env.VITE_MASTER_API_URL || 'https://api.optech.com.np';
export const DEFAULT_TENANT_SLUG = import.meta.env.VITE_DEFAULT_TENANT_SLUG || 'demo';

// ============================================
// POWERED BY (Footer Credit — Optech itself)
// ============================================
export const POWERED_BY_NAME = import.meta.env.VITE_POWERED_BY_NAME || 'Optech';
export const POWERED_BY_LINK = import.meta.env.VITE_POWERED_BY_LINK || '';
export const POWERED_BY_LOGO_URL = import.meta.env.VITE_POWERED_BY_LOGO_URL || '';

// ============================================
// FALLBACK (Dev / Offline / API failure)
// ============================================
export const FALLBACK_ORG = {
    // Master layer
    slug: 'demo',
    org_domain: 'demo.optech.com.np',
    subscription_tier: 'free',
    feature_flags: {},

    // Tenant layer
    team_tag: import.meta.env.VITE_TEAM_TAG || 'ABCD',
    team_name: import.meta.env.VITE_TEAM_NAME || 'ABCD Esports',
    team_logo_url: import.meta.env.VITE_TEAM_LOGO_URL || '',
    color_code_1: import.meta.env.VITE_COLOR_CODE_1 || '#FF0000',
    color_code_2: import.meta.env.VITE_COLOR_CODE_2 || '#00FF00',

    // Subdomains
    org_shop: import.meta.env.VITE_ORG_SHOP || '',
    org_achievements: import.meta.env.VITE_ORG_ACHIVEMENTS || '',

    // Social
    org_youtube_link: import.meta.env.VITE_ORG_YOUTUBE_LINK || '',
    org_tiktok_link: import.meta.env.VITE_ORG_TIKTOK_LINK || '',
    org_instagram_link: import.meta.env.VITE_ORG_INSTAGRAM_LINK || '',
    org_discord_link: import.meta.env.VITE_ORG_DISCORD_LINK || '',
    org_twitter_link: import.meta.env.VITE_ORG_TWITTER_LINK || '',

    // Contact / Address
    org_country: import.meta.env.VITE_ORG_COUNTRY || '',
    org_address: import.meta.env.VITE_ORG_ADDRESS || '',
    org_working_day: import.meta.env.VITE_ORG_WORKING_DAY || '',
    org_working_hour: import.meta.env.VITE_ORG_WORKING_HOUR || '',
    org_email: import.meta.env.VITE_ORG_EMAIL || '',
    org_whatsapp: import.meta.env.VITE_ORG_WHATSAPP || '',
    org_phone_1: import.meta.env.VITE_ORG_PHONE_1 || '',
    org_phone_2: import.meta.env.VITE_ORG_PHONE_2 || '',
};

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
// HEX → RGB helper
// ============================================
export const hexToRgb = (hex, alpha = null) => {
    const h = hex.replace('#', '');
    const r = parseInt(h.substring(0, 2), 16);
    const g = parseInt(h.substring(2, 4), 16);
    const b = parseInt(h.substring(4, 6), 16);
    return alpha !== null ? `rgba(${r},${g},${b},${alpha})` : `${r},${g},${b}`;
};

// ============================================
// INJECT THEME COLORS INTO :root
// ============================================
export const injectThemeColors = (org) => {
    if (typeof document === 'undefined' || !org) return;
    const root = document.documentElement;

    const primary = org.color_code_1 || FALLBACK_ORG.color_code_1;
    const secondary = org.color_code_2 || FALLBACK_ORG.color_code_2;

    root.style.setProperty('--highlight-color-primary', primary);
    root.style.setProperty('--highlight-color-primary-rgb', hexToRgb(primary));
    root.style.setProperty('--highlight-color-secondary', secondary);
    root.style.setProperty('--highlight-color-secondary-rgb', hexToRgb(secondary));
    root.style.setProperty('--border-color-highlight', hexToRgb(primary, 0.3));
    root.style.setProperty('--shadow-glow', `0 0 40px ${hexToRgb(primary, 0.3)}`);
    root.style.setProperty('--scrollbar-thumb', primary);
};

// ============================================
// DEFAULT EXPORT
// ============================================
const env_export = {
    BACKEND_URL_PRODUCTION,
    BACKEND_URL_DEVELOPMENT,
    BACKEND_URL,
    MASTER_API_URL,
    DEFAULT_TENANT_SLUG,
    POWERED_BY_NAME,
    POWERED_BY_LINK,
    POWERED_BY_LOGO_URL,
    FALLBACK_ORG,
    IS_PRODUCTION,
    IS_DEVELOPMENT,
    APP_ENV,
    hexToRgb,
    injectThemeColors,
};

export default env_export;
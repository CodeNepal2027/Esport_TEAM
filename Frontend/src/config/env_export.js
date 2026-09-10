// src/config/env_export.jsx

// ============================================
// BACKEND URLs
// ============================================
export const BACKEND_URL_PRODUCTION = import.meta.env.VITE_BACKEND_URL_PRODUCTION || 'https://myesport.com.np/api';
export const BACKEND_URL_DEVELOPMENT = import.meta.env.VITE_BACKEND_URL_DEVELOPMENT || 'http://127.0.0.1:8000/api';

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
    BACKEND_URL_PRODUCTION,
    BACKEND_URL_DEVELOPMENT,
    BACKEND_URL,
    TEAM_TAG,
    TEAM_NAME,
    TEAM_LOGO_URL,
    COLOR_CODE_1,
    COLOR_CODE_2,
    IS_PRODUCTION,
    IS_DEVELOPMENT,
    APP_ENV,
    injectThemeColors,
};

export default env_export;
// src/config/env_export.jsx

// ============================================
// BACKEND URLs
// ============================================
export const BACKEND_URL_PRODUCTION = import.meta.env.VITE_BACKEND_URL_PRODUCTION || 'https://myesport.com.np/api';
export const BACKEND_URL_DEVELOPMENT = import.meta.env.VITE_BACKEND_URL_DEVELOPMENT || 'http://127.0.0.1:8000/api';

// ============================================
// TEAM IDENTITY
// ============================================
export const TEAM_TAG = import.meta.env.VITE_TEAM_TAG || 'T2K';
export const TEAM_NAME = import.meta.env.VITE_TEAM_NAME || 'Trained To Kill';
export const TEAM_LOGO_URL = import.meta.env.VITE_TEAM_LOGO_URL || 'https://raw.githubusercontent.com/TrainedToKill/TrainedToKill/main/logo.png';

// ============================================
// TEAM COLORS
// ============================================
export const COLOR_CODE_1 = import.meta.env.VITE_COLOR_CODE_1 || '#FF0000';
export const COLOR_CODE_2 = import.meta.env.VITE_COLOR_CODE_2 || '#313131';

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
// EXPORT ALL AS DEFAULT OBJECT (optional)
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
};

export default env_export;


// <========= USAGE EXAMPLES ==========>
// // Example: Using named exports
// import { TEAM_TAG, TEAM_NAME, COLOR_CODE_1, BACKEND_URL } from '../config/env_export';

// function TeamHeader() {
//     return (
//         <div style={{ color: COLOR_CODE_1 }}>
//             <h1>{TEAM_TAG} - {TEAM_NAME}</h1>
//             <p>API: {BACKEND_URL}</p>
//         </div>
//     );
// }

// // Example: Using default export
// import env_export from '../config/env_export';

// function TeamInfo() {
//     return (
//         <div>
//             <img src={env_export.TEAM_LOGO_URL} alt={env_export.TEAM_NAME} />
//             <p>Environment: {env_export.APP_ENV}</p>
//         </div>
//     );
// }
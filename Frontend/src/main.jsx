// // src/main.jsx
// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import App from './App.jsx';
// import { loadOrgConfig } from './config/org_config';
// import './index.css';

// // Load org data BEFORE rendering
// loadOrgConfig().then(() => {
//     ReactDOM.createRoot(document.getElementById('root')).render(
//         <React.StrictMode>
//             <App />
//         </React.StrictMode>
//     );
// });


// ======= [ NEW UPDATED CODE WITH TITLE AND FAVICON DYNAMIC SWITCH ] =========
// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { loadOrgConfig } from './config/org_config';
import { applyOrgBranding } from './config/org_branding';
import './index.css';

// ============================================
// BOOTSTRAP
// 1. Load org config (resolves tenant, injects colors)
// 2. Apply dynamic <title> + favicon from org
// 3. Render the app
// ============================================
loadOrgConfig()
    .then((org) => {
        applyOrgBranding(org);
    })
    .catch((err) => {
        // loadOrgConfig already falls back to FALLBACK_ORG internally,
        // so this is only for truly unexpected failures.
        console.warn('[main] loadOrgConfig failed:', err);
        applyOrgBranding({ team_name: 'Esports Team' });
    })
    .finally(() => {
        ReactDOM.createRoot(document.getElementById('root')).render(
            <React.StrictMode>
                <App />
            </React.StrictMode>
        );
    });
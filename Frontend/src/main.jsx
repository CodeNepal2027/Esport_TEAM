// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { injectThemeColors } from './config/env_export';
import './index.css';

// Inject theme colors from .env before rendering
injectThemeColors();

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
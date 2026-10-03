// // src/home/Home_API_Provider.jsx
// import React, { useState, useEffect, useCallback, useMemo } from 'react';
// import { 
//         Home_API_Context,
//         Home_API_Fetch
//     } from './Home_Import';

// // ============================================
// // AUTO-REFRESH INTERVAL (e.g., 5 minutes)
// // ============================================
// const AUTO_REFRESH_MS = 5 * 60 * 1000;

// // ============================================
// // PROVIDER
// // ============================================
// const Home_API_Provider = ({ children }) => {
//     const [state, setState] = useState({
//         hero: null,
//         about: null,
//         sponsors: null,
//         gallery: null,
//         team: null,
//         events: null,
//         videos: null,
//     });

//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [lastUpdated, setLastUpdated] = useState(null);

//     // ============================================
//     // LOAD ALL DATA AT ONCE (parallel)
//     // ============================================
//     const loadAll = useCallback(async (force = false) => {
//         try {
//             setLoading(true);
//             setError(null);

//             const [
//                 hero,
//                 about,
//                 sponsors,
//                 gallery,
//                 team,
//                 events,
//                 videos,
//             ] = await Promise.all([
//                 Home_API_Fetch.getHero({ force }),
//                 Home_API_Fetch.getAbout({ force }),
//                 Home_API_Fetch.getSponsors({ force }),
//                 Home_API_Fetch.getGallery(undefined, { force }),
//                 Home_API_Fetch.getTeam({ force }),
//                 Home_API_Fetch.getEvents(undefined, { force }),
//                 Home_API_Fetch.getVideos(undefined, { force }),
//             ]);

//             setState({ hero, about, sponsors, gallery, team, events, videos });
//             setLastUpdated(Date.now());
//         } catch (err) {
//             console.error('[Home_API_Provider] load failed:', err);
//             setError(err.message);
//         } finally {
//             setLoading(false);
//         }
//     }, []);

//     // ============================================
//     // INITIAL LOAD
//     // ============================================
//     useEffect(() => {
//         loadAll();
//     }, [loadAll]);

//     // ============================================
//     // AUTO-REFRESH (background refresh)
//     // ============================================
//     useEffect(() => {
//         if (!AUTO_REFRESH_MS) return;

//         const interval = setInterval(() => {
//             // Silent refresh — no loading spinner
//             loadAll(false).catch(() => {});
//         }, AUTO_REFRESH_MS);

//         return () => clearInterval(interval);
//     }, [loadAll]);

//     // ============================================
//     // REFRESH FUNCTION (manual)
//     // ============================================
//     const refresh = useCallback(() => loadAll(true), [loadAll]);

//     // ============================================
//     // REFRESH A SINGLE SECTION
//     // ============================================
//     const refreshSection = useCallback(async (section) => {
//         try {
//             const loader = {
//                 hero: Home_API_Fetch.getHero,
//                 about: Home_API_Fetch.getAbout,
//                 sponsors: Home_API_Fetch.getSponsors,
//                 gallery: Home_API_Fetch.getGallery,
//                 team: Home_API_Fetch.getTeam,
//                 events: Home_API_Fetch.getEvents,
//                 videos: Home_API_Fetch.getVideos,
//             }[section];

//             if (!loader) throw new Error(`Unknown section: ${section}`);

//             const data = await loader({ force: true });
//             setState(prev => ({ ...prev, [section]: data }));
//         } catch (err) {
//             console.error(`[Home_API_Provider] refresh ${section} failed:`, err);
//         }
//     }, []);

//     // ============================================
//     // MEMOIZED CONTEXT VALUE
//     // ============================================
//     const value = useMemo(() => ({
//         // Data
//         ...state,

//         // Status
//         loading,
//         error,
//         lastUpdated,

//         // Actions
//         refresh,
//         refreshSection,

//         // Direct access to the fetcher (for one-off calls)
//         api: Home_API_Fetch,
//     }), [state, loading, error, lastUpdated, refresh, refreshSection]);

//     return (
//         <Home_API_Context.Provider value={value}>
//             {children}
//         </Home_API_Context.Provider>
//     );
// };

// export default Home_API_Provider;




// ******************** [ New smart cache system ( 2026/10/03 ) ]
// src/home/Home_API_Provider.jsx
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Home_API_Context, Home_API_Fetch } from './Home_Import';

// ============================================
// CONFIG
// ============================================
const SECTIONS = ['hero', 'about', 'sponsors', 'gallery', 'team', 'events', 'videos'];
const AUTO_REFRESH_MS = 5 * 60 * 1000;

const LOADERS = {
    hero:     (opts) => Home_API_Fetch.getHero(opts),
    about:    (opts) => Home_API_Fetch.getAbout(opts),
    sponsors: (opts) => Home_API_Fetch.getSponsors(opts),
    gallery:  (opts) => Home_API_Fetch.getGallery(undefined, opts),
    team:     (opts) => Home_API_Fetch.getTeam(opts),
    events:   (opts) => Home_API_Fetch.getEvents(undefined, opts),
    videos:   (opts) => Home_API_Fetch.getVideos(undefined, opts),
};

// ============================================
// GLOBAL BOOTSTRAP FLAG
// Prevents duplicate loads from StrictMode double-mounts.
// ============================================
const _bootKey = '__HOME_API_PROVIDER_BOOTED__';

const _wasBooted = () => {
    if (typeof window === 'undefined') return false;
    return window[_bootKey] === true;
};

const _markBooted = () => {
    if (typeof window === 'undefined') return;
    window[_bootKey] = true;
};

// ============================================
// PROVIDER
// ============================================
const Home_API_Provider = ({ children }) => {
    const [sections, setSections] = useState(() =>
        Object.fromEntries(SECTIONS.map(s => [s, null]))
    );
    const [status, setStatus] = useState(() =>
        Object.fromEntries(SECTIONS.map(s => [s, { loading: true, error: null }]))
    );
    const [lastUpdated, setLastUpdated] = useState(null);
    const mountedRef = useRef(true);

    useEffect(() => {
        mountedRef.current = true;
        return () => { mountedRef.current = false; };
    }, []);

    const loadSection = useCallback(async (section, opts = {}) => {
        const loader = LOADERS[section];
        if (!loader) return;

        setStatus(prev => ({ ...prev, [section]: { loading: true, error: null } }));

        try {
            const { data, changed } = await loader(opts);
            if (!mountedRef.current) return;

            if (changed) {
                setSections(prev => ({ ...prev, [section]: data }));
            }
            setStatus(prev => ({ ...prev, [section]: { loading: false, error: null } }));
        } catch (err) {
            if (!mountedRef.current) return;
            setStatus(prev => ({ ...prev, [section]: { loading: false, error: err.message } }));
        }
    }, []);

    const loadAll = useCallback(async (opts = {}) => {
        await Promise.allSettled(SECTIONS.map(s => loadSection(s, opts)));
        if (mountedRef.current) setLastUpdated(Date.now());
    }, [loadSection]);

    // ============================================
    // INITIAL LOAD — guarded against StrictMode
    // ============================================
    useEffect(() => {
        if (_wasBooted()) return;
        _markBooted();
        loadAll();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ============================================
    // AUTO-REFRESH — single interval, empty deps
    // ============================================
    useEffect(() => {
        if (!AUTO_REFRESH_MS) return;
        const id = setInterval(() => {
            loadAll({ force: false }).catch(() => {});
        }, AUTO_REFRESH_MS);
        return () => clearInterval(id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ============================================
    // PUBLIC ACTIONS
    // ============================================
    const refresh = useCallback(() => loadAll({ force: true }), [loadAll]);
    const refreshSection = useCallback((s) => loadSection(s, { force: true }), [loadSection]);

    // ============================================
    // CONTEXT VALUE
    // ============================================
    const value = useMemo(() => {
        const anyLoading = SECTIONS.some(s => status[s]?.loading);
        const firstError = SECTIONS.map(s => status[s]?.error).find(Boolean) || null;

        return {
            ...sections,
            loading: anyLoading,
            error: firstError,
            lastUpdated,
            status,
            refresh,
            refreshSection,
            api: Home_API_Fetch,
        };
    }, [sections, status, lastUpdated, refresh, refreshSection]);

    return (
        <Home_API_Context.Provider value={value}>
            {children}
        </Home_API_Context.Provider>
    );
};

export default Home_API_Provider;
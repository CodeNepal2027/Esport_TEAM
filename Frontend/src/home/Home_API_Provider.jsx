// src/home/Home_API_Provider.jsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
        Home_API_Context,
        Home_API_Fetch
    } from './Home_Import';

// ============================================
// AUTO-REFRESH INTERVAL (e.g., 5 minutes)
// ============================================
const AUTO_REFRESH_MS = 5 * 60 * 1000;

// ============================================
// PROVIDER
// ============================================
const Home_API_Provider = ({ children }) => {
    const [state, setState] = useState({
        hero: null,
        about: null,
        sponsors: null,
        gallery: null,
        team: null,
        events: null,
        videos: null,
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(null);

    // ============================================
    // LOAD ALL DATA AT ONCE (parallel)
    // ============================================
    const loadAll = useCallback(async (force = false) => {
        try {
            setLoading(true);
            setError(null);

            const [
                hero,
                about,
                sponsors,
                gallery,
                team,
                events,
                videos,
            ] = await Promise.all([
                Home_API_Fetch.getHero({ force }),
                Home_API_Fetch.getAbout({ force }),
                Home_API_Fetch.getSponsors({ force }),
                Home_API_Fetch.getGallery(undefined, { force }),
                Home_API_Fetch.getTeam({ force }),
                Home_API_Fetch.getEvents(undefined, { force }),
                Home_API_Fetch.getVideos(undefined, { force }),
            ]);

            setState({ hero, about, sponsors, gallery, team, events, videos });
            setLastUpdated(Date.now());
        } catch (err) {
            console.error('[Home_API_Provider] load failed:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    // ============================================
    // INITIAL LOAD
    // ============================================
    useEffect(() => {
        loadAll();
    }, [loadAll]);

    // ============================================
    // AUTO-REFRESH (background refresh)
    // ============================================
    useEffect(() => {
        if (!AUTO_REFRESH_MS) return;

        const interval = setInterval(() => {
            // Silent refresh — no loading spinner
            loadAll(false).catch(() => {});
        }, AUTO_REFRESH_MS);

        return () => clearInterval(interval);
    }, [loadAll]);

    // ============================================
    // REFRESH FUNCTION (manual)
    // ============================================
    const refresh = useCallback(() => loadAll(true), [loadAll]);

    // ============================================
    // REFRESH A SINGLE SECTION
    // ============================================
    const refreshSection = useCallback(async (section) => {
        try {
            const loader = {
                hero: Home_API_Fetch.getHero,
                about: Home_API_Fetch.getAbout,
                sponsors: Home_API_Fetch.getSponsors,
                gallery: Home_API_Fetch.getGallery,
                team: Home_API_Fetch.getTeam,
                events: Home_API_Fetch.getEvents,
                videos: Home_API_Fetch.getVideos,
            }[section];

            if (!loader) throw new Error(`Unknown section: ${section}`);

            const data = await loader({ force: true });
            setState(prev => ({ ...prev, [section]: data }));
        } catch (err) {
            console.error(`[Home_API_Provider] refresh ${section} failed:`, err);
        }
    }, []);

    // ============================================
    // MEMOIZED CONTEXT VALUE
    // ============================================
    const value = useMemo(() => ({
        // Data
        ...state,

        // Status
        loading,
        error,
        lastUpdated,

        // Actions
        refresh,
        refreshSection,

        // Direct access to the fetcher (for one-off calls)
        api: Home_API_Fetch,
    }), [state, loading, error, lastUpdated, refresh, refreshSection]);

    return (
        <Home_API_Context.Provider value={value}>
            {children}
        </Home_API_Context.Provider>
    );
};

export default Home_API_Provider;
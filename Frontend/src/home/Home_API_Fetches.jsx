// src/home/Home_API_Fetch

// ============================================
// HOME API FETCH — real backend + demo fallback
// ============================================
import { getOrgConfig } from '../config/org_config';

// ============================================
// DEMO DATA (used only if backend fails)
// ============================================
const DEMO_CLIENT = {
    hero: {
        slides: [
            { id: 1, image: 'https://english.onlinekhabar.com/wp-content/uploads/2022/11/T2K-PMGC.jpg', title: '#RISE AS ONE', subtitle: 'Welcome to the battlefield', tag: 'SEASON 2026' },
            { id: 2, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKPCIiafmgxRuw56exgZH5mm5UGoLx827IVUUMICRzWg&s=10', title: 'DOMINATE', subtitle: 'Train. Kill. Repeat.', tag: 'TEAM ESPORTS' },
            { id: 3, image: 'https://www.sportspro.com/wp-content/uploads/2023/03/Copy-of-Copy-of-WP-News-story-template-2023-03-08T113813.566.jpg?x70900', title: 'VICTORY AWAITS', subtitle: 'Join the elite squad', tag: 'ESPORT PRO' },
        ],
    },
    about: {
        heading: 'Professional Esports Organization',
        paragraphs: [
            'Dedicated to competitive gaming excellence. Founded with a passion for gaming and a vision to dominate the competitive scene.',
            'Our team consists of highly skilled players who train rigorously to compete at the highest level.',
        ],
        stats: [
            { label: 'Founded', value: '2019' },
            { label: 'Tournaments', value: '50+' },
            { label: 'Win Rate', value: '87%' },
            { label: 'Trophies', value: '12' },
        ],
        mission: 'To dominate the competitive gaming scene while building a community of passionate gamers who share our vision.',
        vision: 'To become a global esports powerhouse, inspiring the next generation of competitive gamers worldwide.',
    },
    sponsors: [
        { id: 1, name: 'adidas', logo: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/20/Adidas_Logo.svg/3840px-Adidas_Logo.svg.png' },
        { id: 2, name: 'Nike', logo: 'https://images.seeklogo.com/logo-png/9/2/nike-logo-png_seeklogo-99478.png' },
    ],
    gallery: [
        { id: 1, title: 'Team Victory', category: 'matches', image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=600&fit=crop', description: 'Our team celebrating championship victory', aspect_ratio: '1/1' },
        { id: 2, title: 'Training Session', category: 'training', image: 'https://images.unsplash.com/photo-1511882150382-421056c89033?w=600&h=800&fit=crop', description: 'Intense training session at the bootcamp', aspect_ratio: '3/4' },
    ],
    team: [
        { id: 1, name: 'Apex', realName: 'John Doe', role: 'IGL (In-Game Leader)', image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=400&fit=crop', instagram: 'https://instagram.com/apex', tiktok: 'https://tiktok.com/@apex', youtube: 'https://youtube.com/@apex', country: '🇺🇸' },
    ],
    events: [
        { id: 1, title: 'World Championship 2026', description: 'The biggest esports tournament of the year.', image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=500&fit=crop', date: 'Dec 15-20, 2026', location: 'Seoul, South Korea', prizePool: '$2,000,000', status: 'upcoming', category: 'tournament' },
    ],
    videos: [
        { id: 1, youtube_url: 'https://youtu.be/sHtBOMbBLZM?si=nAkLX1rnXfX3XI7y', category: 'highlights' },
    ],
};

// ============================================
// SMART CACHE
// ============================================
const cache = new Map();
const inflight = new Map();
const DEFAULT_TTL = 5 * 60 * 1000;

const getCacheKey = (endpoint, params) =>
    params ? `${endpoint}?${JSON.stringify(params)}` : endpoint;

const getFromCache = (key) => {
    const entry = cache.get(key);
    if (!entry) return null;
    if (Date.now() - entry.timestamp > entry.ttl) {
        cache.delete(key);
        return null;
    }
    return entry.data;
};

const setCache = (key, data, ttl = DEFAULT_TTL) => {
    cache.set(key, { data, timestamp: Date.now(), ttl });
};

const clearCache = (key) => {
    if (key) cache.delete(key);
    else cache.clear();
};

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

// ============================================
// ENVIRONMENT
// ============================================
const USE_DEMO = import.meta.env.VITE_USE_DEMO === 'true';
const BACKEND_URL =
    import.meta.env.MODE === 'production'
        ? import.meta.env.VITE_BACKEND_URL_PRODUCTION
        : import.meta.env.VITE_BACKEND_URL_DEVELOPMENT;

// ============================================
// TENANT RESOLUTION — send slug + host every time
// ============================================
function buildTenantParams() {
    const params = new URLSearchParams();

    // 1. Explicit ?tenant= in the URL (dev / preview override)
    const urlTenant = new URLSearchParams(window.location.search).get('tenant');
    if (urlTenant) {
        params.set('slug', urlTenant);
        return params;
    }

    // 2. Config-based slug (org_config already resolved this)
    try {
        const org = getOrgConfig();
        if (org?.slug) {
            params.set('slug', org.slug);
        }
    } catch (_) {}

    // 3. Also send hostname so backend can cross-check
    const host = window.location.hostname
        .toLowerCase()
        .replace(/^www\./, '');
    params.set('host', host);

    return params;
}

// ============================================
// FETCH FROM BACKEND
// ============================================
async function fetchFromBackend(endpoint, params) {
    const url = new URL(`${BACKEND_URL}/${endpoint}`);

    // Attach tenant params (?slug=...&host=...)
    const tenantParams = buildTenantParams();
    tenantParams.forEach((v, k) => url.searchParams.set(k, v));

    // Attach any extra params (e.g., category filters)
    if (params) {
        Object.entries(params).forEach(([k, v]) => {
            if (v !== undefined && v !== null && v !== '') {
                url.searchParams.set(k, v);
            }
        });
    }

    const res = await fetch(url.toString(), {
        headers: {
            'Accept': 'application/json',
            'X-Tenant': tenantParams.get('slug') || '',
        },
    });

    if (!res.ok) {
        throw new Error(`HTTP ${res.status} on ${endpoint}`);
    }

    return res.json();
}

// ============================================
// CORE FETCH — try backend, fall back to demo
// ============================================
const fetchWithCache = async (endpoint, options = {}) => {
    const { params, ttl = DEFAULT_TTL, force = false } = options;
    const key = getCacheKey(endpoint, {
        ...params,
        // Include tenant in cache key so switching tenants invalidates
        __tenant: buildTenantParams().get('slug') || 'default',
    });

    // 1. Cache hit
    if (!force) {
        const cached = getFromCache(key);
        if (cached) {
            console.debug(`[FETCH] cache hit: ${key}`);
            return cached;
        }
    }

    // 2. Dedupe
    if (inflight.has(key)) {
        return inflight.get(key);
    }

    // 3. Fetch
    const promise = (async () => {
        try {
            // If VITE_USE_DEMO=true, skip backend entirely
            if (USE_DEMO) {
                await delay(300);
                if (!(endpoint in DEMO_CLIENT)) {
                    throw new Error(`No demo data for endpoint: ${endpoint}`);
                }
                const data = DEMO_CLIENT[endpoint];
                setCache(key, data, ttl);
                return data;
            }

            // Try the real backend
            try {
                const data = await fetchFromBackend(endpoint, params);

                // Some endpoints return empty objects/arrays when no rows exist.
                // Fall back to demo if the response is "empty".
                const isEmpty =
                    data == null ||
                    (Array.isArray(data) && data.length === 0) ||
                    (typeof data === 'object' &&
                        !Array.isArray(data) &&
                        Object.keys(data).length === 0) ||
                    (typeof data === 'object' &&
                        'slides' in data &&
                        Array.isArray(data.slides) &&
                        data.slides.length === 0);

                if (isEmpty) {
                    console.warn(
                        `[FETCH] backend returned empty for "${endpoint}", using demo`
                    );
                    const fallback = DEMO_CLIENT[endpoint];
                    setCache(key, fallback, ttl);
                    return fallback;
                }

                console.debug(`[FETCH] backend ok: ${key}`);
                setCache(key, data, ttl);
                return data;
            } catch (err) {
                console.warn(
                    `[FETCH] backend failed for "${endpoint}", using demo:`,
                    err.message
                );
                const fallback = DEMO_CLIENT[endpoint];
                setCache(key, fallback, ttl);
                return fallback;
            }
        } finally {
            inflight.delete(key);
        }
    })();

    inflight.set(key, promise);
    return promise;
};

// ============================================
// PUBLIC API
// ============================================
export const Home_API_Fetch = {
    getHero:     (options) => fetchWithCache('hero', options),
    getAbout:    (options) => fetchWithCache('about', options),
    getSponsors: (options) => fetchWithCache('sponsors', options),
    getGallery:  (params, options) => fetchWithCache('gallery', { ...options, params }),
    getTeam:     (options) => fetchWithCache('team', options),
    getEvents:   (params, options) => fetchWithCache('events', { ...options, params }),
    getVideos:   (params, options) => fetchWithCache('videos', { ...options, params }),

    invalidate: (endpoint) => clearCache(endpoint),
    invalidateAll: () => clearCache(),

    prefetch: (endpoint, options) => {
        fetchWithCache(endpoint, options).catch(() => {});
    },
};

export default Home_API_Fetch;
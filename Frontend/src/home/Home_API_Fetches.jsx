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
            { id: 4, image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1600&h=900&fit=crop', title: 'FORGED IN FIRE', subtitle: 'Built for the biggest stage', tag: 'WORLD FINALS' },
            { id: 5, image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1600&h=900&fit=crop', title: 'PUSH THE LIMIT', subtitle: 'Every match. Every round.', tag: 'NEW SEASON' },
            { id: 6, image: 'https://images.unsplash.com/photo-1560253023-3ec5d502959f?w=1600&h=900&fit=crop', title: 'UNSTOPPABLE', subtitle: 'The grind never stops', tag: 'BOOTCAMP' },
            { id: 7, image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1600&h=900&fit=crop', title: 'NEXT LEVEL', subtitle: 'Redefining competitive play', tag: 'PRO SERIES' },
            { id: 8, image: 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=1600&h=900&fit=crop', title: 'CHAMPIONS RISE', subtitle: 'Legacy in the making', tag: 'GRAND FINAL' },
        ],
    },

    about: {
        heading: 'Professional Esports Organization',
        paragraphs: [
            'Dedicated to competitive gaming excellence. Founded with a passion for gaming and a vision to dominate the competitive scene.',
            'Our team consists of highly skilled players who train rigorously to compete at the highest level.',
            'From grassroots tournaments to international arenas, we have built a legacy of discipline, teamwork and relentless pursuit of victory.',
            'Our coaching staff, analysts and support crew work around the clock to ensure every player performs at their absolute peak.',
        ],
        stats: [
            { label: 'Founded', value: '2019' },
            { label: 'Tournaments', value: '50+' },
            { label: 'Win Rate', value: '87%' },
            { label: 'Trophies', value: '12' },
            { label: 'Active Players', value: '24' },
            { label: 'Fan Base', value: '1.2M' },
            { label: 'Countries', value: '8' },
            { label: 'Coaching Staff', value: '6' },
        ],
        mission: 'To dominate the competitive gaming scene while building a community of passionate gamers who share our vision.',
        vision: 'To become a global esports powerhouse, inspiring the next generation of competitive gamers worldwide.',
    },

    sponsors: [
        { id: 1, name: 'adidas',       logo: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/20/Adidas_Logo.svg/3840px-Adidas_Logo.svg.png' },
        { id: 2, name: 'Nike',         logo: 'https://images.seeklogo.com/logo-png/9/2/nike-logo-png_seeklogo-99478.png' },
        { id: 3, name: 'Red Bull',     logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/f/f5/RedBullEnergyDrink.svg/512px-RedBullEnergyDrink.svg.png' },
        { id: 4, name: 'Logitech G',   logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Logitech_logo.svg/512px-Logitech_logo.svg.png' },
        { id: 5, name: 'Razer',        logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/4/40/Razer_snake_logo.svg/512px-Razer_snake_logo.svg.png' },
        { id: 6, name: 'HyperX',       logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/HyperX_logo.svg/512px-HyperX_logo.svg.png' },
        { id: 7, name: 'Intel',        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Intel_logo_%282006-2020%29.svg/512px-Intel_logo_%282006-2020%29.svg.png' },
        { id: 8, name: 'Monster',      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Monster_Energy_logo.svg/512px-Monster_Energy_logo.svg.png' },
        { id: 9, name: 'Secretlab',    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Secretlab_logo.svg/512px-Secretlab_logo.svg.png' },
    ],

    gallery: [
        { id: 1, title: 'Team Victory',      category: 'matches',   image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=600&fit=crop', description: 'Our team celebrating championship victory',       aspect_ratio: '1/1' },
        { id: 2, title: 'Training Session',  category: 'training',  image: 'https://images.unsplash.com/photo-1511882150382-421056c89033?w=600&h=800&fit=crop', description: 'Intense training session at the bootcamp',        aspect_ratio: '3/4' },
        { id: 3, title: 'Grand Final Stage', category: 'matches',   image: 'https://images.unsplash.com/photo-1560253023-3ec5d502959f?w=1000&h=600&fit=crop', description: 'The stage is set for the grand final',             aspect_ratio: '16/9' },
        { id: 4, title: 'Squad Lineup',      category: 'team',      image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=800&fit=crop', description: 'Full squad ready for the season opener',           aspect_ratio: '1/1' },
        { id: 5, title: 'Fan Meet 2025',     category: 'events',    image: 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=800&h=1000&fit=crop', description: 'Meeting our amazing fans in person',               aspect_ratio: '4/5' },
        { id: 6, title: 'Strategy Talk',     category: 'training',  image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=900&h=600&fit=crop', description: 'Coach breaking down the next opponent',            aspect_ratio: '3/2' },
        { id: 7, title: 'Trophy Lift',       category: 'matches',   image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=1200&fit=crop', description: 'Lifting the trophy after a nail-biting final',     aspect_ratio: '2/3' },
        { id: 8, title: 'Bootcamp Vibes',    category: 'team',      image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&h=600&fit=crop', description: 'Late-night scrims and team bonding',               aspect_ratio: '4/3' },
        { id: 9, title: 'Meet & Greet',      category: 'events',    image: 'https://images.unsplash.com/photo-1511882150382-421056c89033?w=800&h=600&fit=crop', description: 'Autographs and photos with the community',         aspect_ratio: '4/3' },
        { id: 10, title: 'Practice Arena',   category: 'training',  image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1000&h=600&fit=crop', description: 'Where champions are forged, one scrim at a time',  aspect_ratio: '16/9' },
    ],

    team: [
        { id: 1, name: 'Apex',   realName: 'John Doe',      role: 'IGL (In-Game Leader)', image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=400&fit=crop', instagram: 'https://instagram.com/apex',   tiktok: 'https://tiktok.com/@apex',   youtube: 'https://youtube.com/@apex',   country: '🇺🇸' },
        { id: 2, name: 'Nova',   realName: 'Sarah Kim',     role: 'Entry Fragger',         image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop', instagram: 'https://instagram.com/nova',   tiktok: 'https://tiktok.com/@nova',   youtube: 'https://youtube.com/@nova',   country: '🇰🇷' },
        { id: 3, name: 'Blaze',  realName: 'Marco Silva',   role: 'Support',               image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop', instagram: 'https://instagram.com/blaze',  tiktok: 'https://tiktok.com/@blaze',  youtube: 'https://youtube.com/@blaze',  country: '🇧🇷' },
        { id: 4, name: 'Ghost',  realName: 'Ravi Patel',    role: 'Sniper',                image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop', instagram: 'https://instagram.com/ghost',  tiktok: 'https://tiktok.com/@ghost',  youtube: 'https://youtube.com/@ghost',  country: '🇮🇳' },
        { id: 5, name: 'Viper',  realName: 'Lena Novak',    role: 'Anchor',                image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop', instagram: 'https://instagram.com/viper',  tiktok: 'https://tiktok.com/@viper',  youtube: 'https://youtube.com/@viper',  country: '🇨🇿' },
        { id: 6, name: 'Storm',  realName: 'Kenji Tanaka',  role: 'Fragger',               image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop', instagram: 'https://instagram.com/storm',  tiktok: 'https://tiktok.com/@storm',  youtube: 'https://youtube.com/@storm',  country: '🇯🇵' },
        { id: 7, name: 'Echo',   realName: 'Amina Yusuf',   role: 'Support',               image: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&h=400&fit=crop', instagram: 'https://instagram.com/echo',   tiktok: 'https://tiktok.com/@echo',   youtube: 'https://youtube.com/@echo',   country: '🇳🇬' },
        { id: 8, name: 'Reaper', realName: 'Lucas Müller',  role: 'Entry Fragger',         image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop', instagram: 'https://instagram.com/reaper', tiktok: 'https://tiktok.com/@reaper', youtube: 'https://youtube.com/@reaper', country: '🇩🇪' },
        { id: 9, name: 'Frost',  realName: 'Elena Petrova', role: 'Sniper',                image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop', instagram: 'https://instagram.com/frost',  tiktok: 'https://tiktok.com/@frost',  youtube: 'https://youtube.com/@frost',  country: '🇷🇺' },
    ],

    events: [
        { id: 1, title: 'World Championship 2026', description: 'The biggest esports tournament of the year.',                  image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=500&fit=crop', date: 'Mar 22, 2026', location: 'Seoul, South Korea',  prizePool: '$2,000,000',  category: 'tournament' },
        { id: 2, title: 'Regional Qualifier',      description: 'Battle for a spot at the world stage.',                        image: 'https://images.unsplash.com/photo-1560253023-3ec5d502959f?w=800&h=500&fit=crop', date: 'Feb 28, 2026', location: 'Berlin, Germany',      prizePool: '$150,000',  category: 'qualifier' },
        { id: 3, title: 'Fan Meet & Greet',        description: 'Meet the squad, get autographs, and grab exclusive merch.',    image: 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=800&h=500&fit=crop', date: 'Jan 15-17, 2026',    location: 'Kathmandu, Nepal',     prizePool: 'Free Entry',  category: 'fan_meet' },
        { id: 4, title: 'Community Cup',           description: 'Open tournament for aspiring players from our community.',     image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&h=500&fit=crop', date: 'Apr 10-12, 2026', location: 'Online',               prizePool: '$5,000',   category: 'community' },
        { id: 5, title: 'Charity Showmatch',       description: 'A friendly showmatch with all proceeds going to charity.',     image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=500&fit=crop', date: 'Jun 20-22, 2026',    location: 'London, UK',           prizePool: '$25,000',   category: 'showmatch' },
        { id: 6, title: 'Esports Expo 2026',       description: 'Industry expo — meet teams, sponsors, and creators.',          image: 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=800&h=500&fit=crop', date: 'Jul 12, 2026', location: 'Los Angeles, USA',     prizePool: 'N/A',   category: 'expo' },
        { id: 7, title: 'Spring Invitational',     description: 'Invite-only tournament featuring the top regional teams.',     image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&h=500&fit=crop', date: 'Aug 22-24, 2026', location: 'Dubai, UAE',           prizePool: '$500,000', category: 'tournament' },
        { id: 8, title: 'Winter Qualifier',        description: 'First qualifier of the season — a proving ground.',            image: 'https://images.unsplash.com/photo-1511882150382-421056c89033?w=800&h=500&fit=crop', date: 'sep 20-25, 2026', location: 'Helsinki, Finland',    prizePool: '$100,000', category: 'qualifier' },
        { id: 9, title: 'Fan Appreciation Night', description: 'A night dedicated to the fans who make it all possible.',      image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=500&fit=crop', date: 'Nov 02, 2026',    location: 'São Paulo, Brazil',    prizePool: 'Free Entry', category: 'fan_meet' },
        { id: 10, title: 'Summer Showdown',        description: 'Mid-season showmatch against long-time rivals.',               image: 'https://images.unsplash.com/photo-1560253023-3ec5d502959f?w=800&h=500&fit=crop', date: 'Dec 15-20, 2026',    location: 'Tokyo, Japan',         prizePool: '$75,000', category: 'showmatch' },
    ],

    videos: [
        { id: 1,  youtube_url: 'https://youtu.be/sHtBOMbBLZM?si=nAkLX1rnXfX3XI7y', category: 'highlights' },
        { id: 2,  youtube_url: 'https://youtu.be/9bZkp7q19f0',                     category: 'highlights' },
        { id: 3,  youtube_url: 'https://youtu.be/kJQP7kiw5Fk',                     category: 'highlights' },
        { id: 4,  youtube_url: 'https://youtu.be/RgKAFK5djSk',                     category: 'training'   },
        { id: 5,  youtube_url: 'https://youtu.be/OPf0YbXqDm0',                     category: 'interviews' },
        { id: 6,  youtube_url: 'https://youtu.be/hTWKbfoikeg',                     category: 'analysis'   },
        { id: 7,  youtube_url: 'https://youtu.be/YQHsXMglC9A',                     category: 'analysis'   },
        { id: 8, youtube_url: 'https://youtu.be/60ItHLz5WEA',                      category: 'events'     },
        { id: 9, youtube_url: 'https://youtu.be/CevxZvSJLk8',                      category: 'events'     },
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
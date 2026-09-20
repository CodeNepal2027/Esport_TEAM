// src/home/Home_API_Fetch

// ============================================
// HOME API FETCH — network layer with smart caching
// ============================================

// ============================================
// DEMO DATA (used when VITE_USE_DEMO=true)
// In production, this is replaced by real API calls
// ============================================
const DEMO_DATA = {
    hero: {
        slides: [
            {
                id: 1,
                image: 'https://english.onlinekhabar.com/wp-content/uploads/2022/11/T2K-PMGC.jpg',
                title: '#RISE AS ONE',
                subtitle: 'Welcome to the battlefield',
                tag: 'SEASON 2026'
            },
            {
                id: 2,
                image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKPCIiafmgxRuw56exgZH5mm5UGoLx827IVUUMICRzWg&s=10',
                title: 'DOMINATE',
                subtitle: 'Train. Kill. Repeat.',
                tag: 'TEAM ESPORTS'
            },
            {
                id: 3,
                image: 'https://www.sportspro.com/wp-content/uploads/2023/03/Copy-of-Copy-of-WP-News-story-template-2023-03-08T113813.566.jpg?x70900',
                title: 'VICTORY AWAITS',
                subtitle: 'Join the elite squad',
                tag: 'ESPORT PRO'
            }
        ],
    },

    about: {
        heading: 'Professional Esports Organizations',
        paragraphs: [
            'Dedicated to competitive gaming excellence. Founded with a passion for gaming and a vision to dominate the competitive scene.',
            'Our team consists of highly skilled players who train rigorously to compete at the highest level. We believe in teamwork, dedication, and the relentless pursuit of victory.'
        ],
        stats: [
            { label: 'Founded', value: '2019' },
            { label: 'Tournaments', value: '50+' },
            { label: 'Win Rate', value: '87%' },
            { label: 'Trophies', value: '12' }
        ],
        mission: 'To dominate the competitive gaming scene while building a community of passionate gamers who share our vision.',
        vision: 'To become a global esports powerhouse, inspiring the next generation of competitive gamers worldwide.'
    },

    sponsors: [
        { id: 1, name: 'adidas', logo: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/20/Adidas_Logo.svg/3840px-Adidas_Logo.svg.png' },
        { id: 2, name: 'Nike', logo: 'https://images.seeklogo.com/logo-png/9/2/nike-logo-png_seeklogo-99478.png' },
        { id: 3, name: 'Puma', logo: 'https://static.vecteezy.com/system/resources/previews/020/336/032/non_2x/puma-logo-puma-icon-free-free-vector.jpg' },
        { id: 4, name: 'Red Bull', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Red_Bull_Energy_Drink_logo.svg/200px-Red_Bull_Energy_Drink_logo.svg.png' },
        { id: 5, name: 'Razer', logo: 'https://logos-world.net/wp-content/uploads/2020/11/Razer-Logo.png' },
        { id: 6, name: 'GUESS', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Guess_logo.svg/200px-Guess_logo.svg.png' },
        { id: 7, name: 'Monster', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Monster_Energy_logo.svg/200px-Monster_Energy_logo.svg.png' },
        { id: 8, name: 'amex', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/American_Express_logo.svg/200px-American_Express_logo.svg.png' },
    ],

    gallery: [
        { id: 1, title: 'Team Victory', category: 'matches', image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=600&fit=crop', description: 'Our team celebrating championship victory', aspect_ratio: '1/1' },
        { id: 2, title: 'Training Session', category: 'training', image: 'https://images.unsplash.com/photo-1511882150382-421056c89033?w=600&h=800&fit=crop', description: 'Intense training session at the bootcamp', aspect_ratio: '3/4' },
        { id: 3, title: 'Tournament Finals', category: 'matches', image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=600&fit=crop', description: 'Grand finals at the esports arena', aspect_ratio: '16/9' },
        { id: 4, title: 'Team Photo', category: 'team', image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&h=800&fit=crop', description: 'Official team photo 2026', aspect_ratio: '3/4' },
        { id: 5, title: 'Practice Room', category: 'training', image: 'https://images.unsplash.com/photo-1517594422361-5eeb8ae275a9?w=800&h=400&fit=crop', description: 'State-of-the-art practice facility', aspect_ratio: '21/9' },
        { id: 6, title: 'Fan Meetup', category: 'events', image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&h=600&fit=crop', description: 'Meeting our amazing fans', aspect_ratio: '4/3' },
        { id: 7, title: 'Team Dinner', category: 'team', image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=800&fit=crop', description: 'Team bonding dinner', aspect_ratio: '3/4' },
        { id: 8, title: 'Tournament Arena', category: 'events', image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&h=400&fit=crop', description: 'The esports arena during finals', aspect_ratio: '21/9' },
        { id: 9, title: 'Gear Setup', category: 'training', image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&h=800&fit=crop', description: 'Professional gaming gear setup', aspect_ratio: '3/4' },
        { id: 10, title: 'Championship Trophy', category: 'matches', image: 'https://images.unsplash.com/photo-1511882150382-421056c89033?w=800&h=600&fit=crop', description: 'Lifting the championship trophy', aspect_ratio: '1/1' },
        { id: 11, title: 'Bootcamp Day', category: 'training', image: 'https://images.unsplash.com/photo-1517594422361-5eeb8ae275a9?w=800&h=400&fit=crop', description: 'Day at the bootcamp facility', aspect_ratio: '21/9' },
        { id: 12, title: 'Victory Celebration', category: 'matches', image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&h=600&fit=crop', description: 'Celebrating victory with fans', aspect_ratio: '16/9' },
        { id: 13, title: 'Team Strategy', category: 'team', image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&h=800&fit=crop', description: 'Planning strategies together', aspect_ratio: '3/4' },
        { id: 14, title: 'Esports Arena', category: 'events', image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&h=400&fit=crop', description: 'The massive esports arena', aspect_ratio: '21/9' },
        { id: 15, title: 'Player Focus', category: 'training', image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&h=800&fit=crop', description: 'Player in deep focus', aspect_ratio: '3/4' },
        { id: 16, title: 'New Champion', category: 'matches', image: 'https://images.unsplash.com/photo-1511882150382-421056c89033?w=800&h=800&fit=crop', description: 'New champion crowned', aspect_ratio: '1/1' },
        { id: 17, title: 'Team Celebration', category: 'team', image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=500&fit=crop', description: 'Team celebration after victory', aspect_ratio: '16/10' },
        { id: 18, title: 'Gaming Setup', category: 'training', image: 'https://images.unsplash.com/photo-1517594422361-5eeb8ae275a9?w=600&h=600&fit=crop', description: 'Professional gaming setup', aspect_ratio: '1/1' },
        { id: 19, title: 'Fan Celebration', category: 'events', image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&h=600&fit=crop', description: 'Fans celebrating with the team', aspect_ratio: '4/3' },
        { id: 20, title: 'Team Meeting', category: 'team', image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=450&fit=crop', description: 'Strategic team meeting', aspect_ratio: '16/9' },
    ],

    team: [
        { id: 1, name: 'Apex', realName: 'John Doe', role: 'IGL (In-Game Leader)', image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=400&fit=crop', instagram: 'https://instagram.com/apex', tiktok: 'https://tiktok.com/@apex', youtube: 'https://youtube.com/@apex', country: '🇺🇸' },
        { id: 2, name: 'Fury', realName: 'Mike Johnson', role: 'Entry Fragger', image: 'https://images.unsplash.com/photo-1511882150382-421056c89033?w=400&h=400&fit=crop', instagram: 'https://instagram.com/fury', tiktok: 'https://tiktok.com/@fury', youtube: 'https://youtube.com/@fury', country: '🇬🇧' },
        { id: 3, name: 'Viper', realName: 'Sarah Chen', role: 'Support', image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&h=400&fit=crop', instagram: 'https://instagram.com/viper', tiktok: 'https://tiktok.com/@viper', youtube: 'https://youtube.com/@viper', country: '🇨🇳' },
        { id: 4, name: 'Shadow', realName: 'Alex Rivera', role: 'Anchor', image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400&h=400&fit=crop', instagram: 'https://instagram.com/shadow', tiktok: 'https://tiktok.com/@shadow', youtube: 'https://youtube.com/@shadow', country: '🇲🇽' },
        { id: 5, name: 'Blaze', realName: 'Emma Wilson', role: 'Fragger', image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=400&fit=crop', instagram: 'https://instagram.com/blaze', tiktok: 'https://tiktok.com/@blaze', youtube: 'https://youtube.com/@blaze', country: '🇦🇺' },
        { id: 6, name: 'Storm', realName: 'David Kim', role: 'Sniper', image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=400&fit=crop', instagram: 'https://instagram.com/storm', tiktok: 'https://tiktok.com/@storm', youtube: 'https://youtube.com/@storm', country: '🇰🇷' },
    ],

    events: [
        { id: 1, title: 'World Championship 2026', description: 'The biggest esports tournament of the year featuring top teams from around the world competing for the championship title.', image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=500&fit=crop', date: 'Dec 15-20, 2026', location: 'Seoul, South Korea', prizePool: '$2,000,000', status: 'upcoming', category: 'tournament' },
        { id: 2, title: 'Regional Qualifiers', description: 'Regional qualifiers to determine which teams will advance to the World Championship.', image: 'https://images.unsplash.com/photo-1511882150382-421056c89033?w=800&h=500&fit=crop', date: 'Nov 10-25, 2026', location: 'Multiple Regions', prizePool: '$500,000', status: 'ongoing', category: 'qualifier' },
        { id: 3, title: 'Fan Fest 2026', description: 'A massive fan gathering with meet & greet sessions, merchandise stalls, and live matches.', image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=500&fit=crop', date: 'Dec 18, 2026', location: 'Seoul, South Korea', prizePool: 'Free Entry', status: 'upcoming', category: 'fan_meet' },
        { id: 4, title: 'Winter Showdown', description: 'Annual winter tournament featuring the top 8 teams battling it out in a double-elimination format.', image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=500&fit=crop', date: 'Jan 5-10, 2027', location: 'London, UK', prizePool: '$1,000,000', status: 'upcoming', category: 'tournament' },
        { id: 5, title: 'Spring Championship', description: 'The spring championship marks the beginning of the competitive season with intense matches and rising talents.', image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&h=500&fit=crop', date: 'Mar 1-10, 2026', location: 'Los Angeles, USA', prizePool: '$750,000', status: 'completed', category: 'tournament' },
        { id: 6, title: 'Community Cup', description: 'Community-driven tournament where amateur teams get a chance to compete against professional players.', image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=500&fit=crop', date: 'Oct 5-8, 2026', location: 'Berlin, Germany', prizePool: '$100,000', status: 'completed', category: 'community' },
        { id: 7, title: 'Showmatch All-Stars', description: 'Celebrity showmatch featuring popular streamers and content creators competing for charity.', image: 'https://images.unsplash.com/photo-1517594422361-5eeb8ae275a9?w=800&h=500&fit=crop', date: 'Nov 28, 2026', location: 'Online', prizePool: 'Charity', status: 'ongoing', category: 'showmatch' },
        { id: 8, title: 'Summer Clash', description: 'Summer tournament with the biggest prize pool of the year, featuring the top 16 teams worldwide.', image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&h=500&fit=crop', date: 'Jul 15-25, 2026', location: 'Tokyo, Japan', prizePool: '$3,000,000', status: 'completed', category: 'tournament' },
        { id: 9, title: 'Gaming Expo 2026', description: 'Annual gaming expo where teams showcase their skills, new products are unveiled, and fans connect.', image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=500&fit=crop', date: 'Sep 20-22, 2026', location: 'New York, USA', prizePool: 'Free Entry', status: 'upcoming', category: 'expo' },
    ],

    videos: [
        { id: 1, youtube_url: 'https://youtu.be/sHtBOMbBLZM?si=nAkLX1rnXfX3XI7z', category: 'highlights' },
        { id: 2, youtube_url: 'https://youtu.be/9bZkp7q19f0', category: 'training' },
        { id: 3, youtube_url: 'https://youtu.be/kJQP7kiw5Fk', category: 'interviews' },
        { id: 4, youtube_url: 'https://youtu.be/XqZsoesa55w', category: 'events' },
    ],
};

// ============================================
// SMART CACHE
// ============================================
const cache = new Map();         // key → { data, timestamp }
const inflight = new Map();      // key → Promise (deduplicate concurrent requests)

const DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

const getCacheKey = (endpoint, params) => {
    return params ? `${endpoint}?${JSON.stringify(params)}` : endpoint;
};

const getFromCache = (key) => {
    const entry = cache.get(key);
    if (!entry) return null;

    const age = Date.now() - entry.timestamp;
    if (age > entry.ttl) {
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

// ============================================
// SIMULATE NETWORK LATENCY (for demo mode)
// ============================================
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// ============================================
// CORE FETCH FUNCTION
// ============================================
const USE_DEMO = import.meta.env.VITE_USE_DEMO === 'true';
const BACKEND_URL = import.meta.env.MODE === 'production'
    ? import.meta.env.VITE_BACKEND_URL_PRODUCTION
    : import.meta.env.VITE_BACKEND_URL_DEVELOPMENT;

/**
 * Fetch with smart caching.
 * 
 * @param {string} endpoint - e.g., "hero", "gallery", "team"
 * @param {object} options
 * @param {object} options.params - query params
 * @param {number} options.ttl - cache duration in ms
 * @param {boolean} options.force - bypass cache
 */
const fetchWithCache = async (endpoint, options = {}) => {
    const { params, ttl = DEFAULT_TTL, force = false } = options;
    const key = getCacheKey(endpoint, params);

    // 1. Cache hit
    if (!force) {
        const cached = getFromCache(key);
        if (cached) {
            console.debug(`[FETCH] cache hit: ${key}`);
            return cached;
        }
    }

    // 2. Deduplicate concurrent requests
    if (inflight.has(key)) {
        console.debug(`[FETCH] dedupe: ${key}`);
        return inflight.get(key);
    }

    // 3. Perform fetch
    const promise = (async () => {
        try {
            let data;

            if (USE_DEMO) {
                // Demo mode — simulate latency
                await delay(300);
                if (!(endpoint in DEMO_DATA)) {
                    throw new Error(`No demo data for endpoint: ${endpoint}`);
                }
                data = DEMO_DATA[endpoint];
            } else {
                // Real backend
                const url = new URL(`${BACKEND_URL}/${endpoint}`);
                if (params) {
                    Object.entries(params).forEach(([k, v]) =>
                        url.searchParams.append(k, v)
                    );
                }

                const res = await fetch(url.toString(), {
                    headers: { 'Accept': 'application/json' },
                });

                if (!res.ok) {
                    throw new Error(`HTTP ${res.status} on ${endpoint}`);
                }

                data = await res.json();
            }

            // Cache the result
            setCache(key, data, ttl);
            console.debug(`[FETCH] fetched: ${key}`);
            return data;
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
    /**
     * Hero slides
     */
    getHero: (options) => fetchWithCache('hero', options),

    /**
     * About section
     */
    getAbout: (options) => fetchWithCache('about', options),

    /**
     * Sponsors
     */
    getSponsors: (options) => fetchWithCache('sponsors', options),

    /**
     * Gallery (optionally filter by category)
     */
    getGallery: (params, options) =>
        fetchWithCache('gallery', { ...options, params }),

    /**
     * Team roster
     */
    getTeam: (options) => fetchWithCache('team', options),

    /**
     * Events (optionally filter by status/category)
     */
    getEvents: (params, options) =>
        fetchWithCache('events', { ...options, params }),

    /**
     * Videos (optionally filter by category)
     */
    getVideos: (params, options) =>
        fetchWithCache('videos', { ...options, params }),

    /**
     * Invalidate cache
     */
    invalidate: (endpoint) => clearCache(endpoint),
    invalidateAll: () => clearCache(),

    /**
     * Prefetch (warms cache without blocking)
     */
    prefetch: (endpoint, options) => {
        fetchWithCache(endpoint, options).catch(() => {});
    },
};

export default Home_API_Fetch;
// src/config/org_config.jsx
// ============================================
// ORG CONFIG — fetches organization data
// Master DB → tenant API → fallback
// ============================================
import {
    MASTER_API_URL,
    DEFAULT_TENANT_SLUG,
    FALLBACK_ORG,
    injectThemeColors,
} from './env_export';

// ============================================
// DEMO API OBJECT (used when no backend exists)
// ============================================
const DEMO_API = {
    // Master DB response (Optech platform)
    master: {
        org_slug: 'demo',
        org_domain: 'demo.optech.com.np',
        tenant_api_url: 'https://demo.optech.com.np/api',
        subscription_tier: 'pro',
        subscription_status: 'active',
        feature_flags: {
            custom_domain: true,
            advanced_analytics: true,
        },
    },

    // Tenant API response (org-owned)
    tenant: {
        team_tag: 'ABCD',
        team_name: 'ABCD Esports',
        team_logo_url: 'https://static.gosugamers.net/7b/b6/e1/2bbeef7d498f5f10d3b99fcadd39f6191099f22f2727aeb7615c5ee024.webp?w=256',
        color_code_1: '#FF0000',
        color_code_2: '#000000',

        org_shop: 'https://codevoraui.vercel.app',
        org_achievements: 'https://sujan140.com.np',

        org_youtube_link: 'https://sujan140.com.np',
        org_tiktok_link: 'https://sujan140.com.np',
        org_instagram_link: 'https://sujan140.com.np',
        org_discord_link: 'https://sujan140.com.np',
        org_twitter_link: 'https://sujan140.com.np',

        org_country: 'NEPAL',
        org_address: 'Belbari-10, Morang',
        // org_working_day: 'Tuesday - Sunday',
        // org_working_hour: '7am - 7pm',
        org_email: 'rsujan140.in@gmail.com',
        org_whatsapp: '+977 980-5376861',
        org_phone_1: '123456789',
        org_phone_2: '987654321',
    },
};

// ============================================
// USE DEMO MODE?
// Set VITE_USE_DEMO=true in .env to force demo
// Or it auto-falls back if API fails
// ============================================
const USE_DEMO = import.meta.env.VITE_USE_DEMO === 'true';

// ============================================
// Get current tenant slug from subdomain
// ============================================
const getTenantSlug = () => {
    if (typeof window === 'undefined') return DEFAULT_TENANT_SLUG;

    const host = window.location.hostname;

    // localhost / 127.0.0.1 → default slug
    if (host === 'localhost' || host === '127.0.0.1') {
        return DEFAULT_TENANT_SLUG;
    }

    const parts = host.split('.');

    // abc.optech.com.np → "abc"
    // optech.com.np     → default slug
    if (parts.length >= 3) return parts[0];

    return DEFAULT_TENANT_SLUG;
};

// ============================================
// CACHE
// ============================================
let cachedOrg = null;
let loadPromise = null;

// ============================================
// Fetch org data
// ============================================
const fetchOrgData = async () => {
    // Demo mode (or no real backend)
    if (USE_DEMO) {
        console.info('[org_config] Demo mode — using DEMO_API');
        return {
            ...DEMO_API.master,
            ...DEMO_API.tenant,
        };
    }

    const slug = getTenantSlug();

    // 1. Get tenant info from master DB
    const masterRes = await fetch(`${MASTER_API_URL}/tenants/${slug}`);
    if (!masterRes.ok) throw new Error(`Master DB error: ${masterRes.status}`);
    const master = await masterRes.json();

    // 2. Get org data from tenant's own API
    const tenantRes = await fetch(`${master.tenant_api_url}/config`);
    if (!tenantRes.ok) throw new Error(`Tenant API error: ${tenantRes.status}`);
    const tenant = await tenantRes.json();

    // 3. Merge master + tenant
    return {
        // Master layer
        slug: master.org_slug,
        org_domain: master.org_domain,
        subscription_tier: master.subscription_tier,
        subscription_status: master.subscription_status,
        feature_flags: master.feature_flags || {},

        // Tenant layer
        ...tenant,
    };
};

// ============================================
// Load org (with caching + fallback)
// ============================================
export const loadOrgConfig = async () => {
    if (cachedOrg) return cachedOrg;
    if (loadPromise) return loadPromise;

    loadPromise = (async () => {
        try {
            const org = await fetchOrgData();
            cachedOrg = org;
            injectThemeColors(org);
            console.info(`[org_config] Loaded org: ${org.slug}`);
            return org;
        } catch (err) {
            console.warn('[org_config] API failed, using fallback:', err.message);
            cachedOrg = { ...FALLBACK_ORG };
            injectThemeColors(cachedOrg);
            return cachedOrg;
        } finally {
            loadPromise = null;
        }
    })();

    return loadPromise;
};

// ============================================
// Get org (sync — only after loadOrgConfig)
// ============================================
export const getOrgConfig = () => cachedOrg || { ...FALLBACK_ORG };

// ============================================
// Clear cache (useful for testing)
// ============================================
export const clearOrgCache = () => {
    cachedOrg = null;
    loadPromise = null;
};

// ============================================
// DEFAULT EXPORT
// ============================================
const org_config = {
    loadOrgConfig,
    getOrgConfig,
    clearOrgCache,
    getTenantSlug,
    DEMO_API,
};

export default org_config;
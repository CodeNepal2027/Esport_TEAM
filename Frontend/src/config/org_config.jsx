// src/config/org_config.jsx
// ============================================
// ORG CONFIG — fetches organization data
// Master DB → tenant API → fallback
// Supports: full domains, subdomains, demo switching
// ============================================
import {
    MASTER_API_URL,
    DEFAULT_TENANT_SLUG,
    FALLBACK_ORG,
    injectThemeColors,
} from './env_export';

// ============================================
// DEMO MASTER — Test T2K, DRS, ABC instantly
// Toggle in browser: ?tenant=drs | ?tenant=t2k | ?tenant=abc
// Or set VITE_DEMO_TENANT=drs in .env
// ============================================
const DEMO_MASTER = {
    abc: {
        // Master layer
        slug: 'optech',
        org_domain: 'optechesports.com',
        subscription_tier: 'pro',
        subscription_status: 'active',
        feature_flags: {
            custom_domain: true,
            advanced_analytics: true,
        },

        // Tenant layer
        team_tag: 'OPTECH',
        team_name: 'OPTECH Esports',
        team_logo_url: 'https://media.licdn.com/dms/image/v2/D560BAQGP_oFzusu7yA/company-logo_400_400/B56aCwrwWGGoAU-/0/1789670655637?e=1791417600&v=beta&t=KTm_5JIyOVQ9E1UcKTTOphe3re-IBe_7KbXlf46ekjc',
        color_code_1: '#1271ff',
        color_code_2: '#003c67',

        org_shop: 'https://codevoraui.vercel.app',
        org_achievements: 'https://sujan140.com.np',

        org_youtube_link: 'https://sujan140.com.np',
        org_tiktok_link: 'https://sujan140.com.np',
        org_instagram_link: 'https://sujan140.com.np',
        org_discord_link: 'https://sujan140.com.np',
        org_twitter_link: 'https://sujan140.com.np',

        org_country: 'NEPAL',
        org_address: 'Belbari-10, Morang',
        org_working_day: 'Tuesday - Sunday',
        org_working_hour: '7am - 7pm',
        org_email: 'rsujan140.in@gmail.com',
        org_whatsapp: '+977 980-5376861',
        org_phone_1: '123456789',
        org_phone_2: '987654321',
    },

    drs: {
        slug: 'drs',
        org_domain: 'drsesports.com',
        subscription_tier: 'pro',
        subscription_status: 'active',
        feature_flags: {
            custom_domain: true,
        },

        team_tag: 'DRS',
        team_name: 'DRS Gaming',
        team_logo_url: 'https://gadgetsinnepal.b-cdn.net/wp-content/uploads/2023/01/New-Project-2023-01-09T150742.741.jpg',
        color_code_1: '#1577ef',
        color_code_2: '#FFFFFF',

        org_shop: 'https://codevoraui.vercel.app',
        org_achievements: 'https://sujan140.com.np',

        org_youtube_link: 'https://sujan140.com.np',
        org_tiktok_link: 'https://sujan140.com.np',
        org_instagram_link: 'https://sujan140.com.np',
        org_discord_link: 'https://sujan140.com.np',
        org_twitter_link: 'https://sujan140.com.np',

        org_country: 'NEPAL',
        org_address: 'Belbari-10, Morang',
        org_working_day: 'Tuesday - Sunday',
        org_working_hour: '7am - 7pm',
        org_email: 'drs@example.com',
        org_whatsapp: '+977 980-5376861',
        org_phone_1: '123456789',
        org_phone_2: '987654321',
    },

    t2k: {
        slug: 't2k',
        org_domain: 't2kesports.com',
        subscription_tier: 'pro',
        subscription_status: 'active',
        feature_flags: {
            custom_domain: true,
        },

        team_tag: 'T2K',
        team_name: 'Trained to Kill',
        team_logo_url: 'https://yt3.googleusercontent.com/qCuiIRuWEnJcVL9M0u2Ip-GLuFPhkwZg65syFd7eA_YOJSo8lgqWitNU4dCygoIlC5zO-jHT=s900-c-k-c0x00ffffff-no-rj',
        color_code_1: '#E60000',
        color_code_2: '#111111',

        org_shop: 'https://codevoraui.vercel.app',
        org_achievements: 'https://sujan140.com.np',

        org_youtube_link: 'https://sujan140.com.np',
        org_tiktok_link: 'https://sujan140.com.np',
        org_instagram_link: 'https://sujan140.com.np',
        org_discord_link: 'https://sujan140.com.np',
        org_twitter_link: 'https://sujan140.com.np',

        org_country: 'NEPAL',
        org_address: 'Belbari-10, Morang',
        org_working_day: 'Tuesday - Sunday',
        org_working_hour: '7am - 7pm',
        org_email: 't2k@example.com',
        org_whatsapp: '+977 980-5376861',
        org_phone_1: '123456789',
        org_phone_2: '987654321',
    },
};

// ============================================
// MODE FLAGS
// ============================================
const USE_DEMO = import.meta.env.VITE_USE_DEMO === 'true';

// Optional: force a specific demo tenant via .env
// VITE_DEMO_TENANT=drs
const ENV_DEMO_TENANT = import.meta.env.VITE_DEMO_TENANT || '';

const normalizeOrgDomain = (value) => {
    if (!value) return '';
    const raw = String(value).trim().toLowerCase();
    if (!raw) return '';

    const withoutProtocol = raw.replace(/^https?:\/\//i, '');
    const withoutTrailingSlash = withoutProtocol.replace(/\/+$/, '');
    const withoutPath = withoutTrailingSlash.split('/')[0];
    return withoutPath.replace(/^www\./, '');
};

const normalizeApiBase = (apiUrl) => {
    if (!apiUrl) return MASTER_API_URL.replace(/\/+$/, '');

    const raw = String(apiUrl).trim();
    const withoutQuery = raw.split('?')[0].replace(/\/+$/, '');
    const apiMatch = withoutQuery.match(/^(https?:\/\/[^/]+\/api)/i);

    if (apiMatch) {
        return apiMatch[1];
    }

    return withoutQuery;
};

const findMatchingOrgByCurrentHost = (items) => {
    if (!Array.isArray(items) || items.length === 0 || typeof window === 'undefined') {
        return null;
    }

    const currentHost = window.location.host.toLowerCase();
    const currentHostname = window.location.hostname.toLowerCase();

    return items.find((item) => {
        const orgDomain = normalizeOrgDomain(item?.org_domain);
        const slug = String(item?.slug || '').toLowerCase();

        return (
            orgDomain === currentHost ||
            orgDomain === currentHostname ||
            (orgDomain && (currentHost.includes(orgDomain) || currentHostname.includes(orgDomain))) ||
            slug === currentHostname ||
            slug === currentHost.split(':')[0]
        );
    }) || null;
};

// ============================================
// Detect tenant identifier (domain, subdomain, or override)
// Priority:
//   1. ?tenant=drs  → query param (dev/testing)
//   2. VITE_DEMO_TENANT → .env override (dev/testing)
//   3. current host matches a master org in the registry
//   4. exact hostname match in DEMO_MASTER (dev/testing)
//   5. localhost → default slug
//   6. full domain (drsesports.com)
//   7. subdomain (drs.optech.com.np → "drs")
// ============================================
const getTenantIdentifier = () => {
    if (typeof window === 'undefined') return DEFAULT_TENANT_SLUG;

    const urlParams = new URLSearchParams(window.location.search);
    const queryTenant = urlParams.get('tenant');
    if (queryTenant) {
        console.info(`[org_config] Tenant override via query param: ${queryTenant}`);
        return queryTenant.toLowerCase();
    }

    if (ENV_DEMO_TENANT) {
        console.info(`[org_config] Tenant override via .env: ${ENV_DEMO_TENANT}`);
        return ENV_DEMO_TENANT.toLowerCase();
    }

    const host = window.location.hostname.toLowerCase().replace(/^www\./, '');

    for (const [slug, tenant] of Object.entries(DEMO_MASTER)) {
        if (tenant.org_domain === host) {
            console.info(`[org_config] Tenant matched by domain: ${slug}`);
            return slug;
        }
    }

    if (host === 'localhost' || host === '127.0.0.1') {
        return 'localhost';
    }

    if (!host.includes('.optech.')) {
        return host;
    }

    const parts = host.split('.');
    if (parts.length >= 3) return parts[0];

    return DEFAULT_TENANT_SLUG;
};

// ============================================
// Fetch org data from backend
// ============================================
const fetchOrgData = async () => {
    const identifier = getTenantIdentifier();

    // Demo mode → return from DEMO_MASTER
    if (USE_DEMO) {
        console.info(`[org_config] Demo mode — loading tenant: ${identifier}`);

        if (DEMO_MASTER[identifier]) {
            return { ...DEMO_MASTER[identifier] };
        }

        for (const tenant of Object.values(DEMO_MASTER)) {
            if (tenant.org_domain === identifier) return { ...tenant };
        }

        console.warn(`[org_config] Unknown demo tenant "${identifier}", using abc`);
        return { ...DEMO_MASTER.abc };
    }

    // ============================================
    // Real backend mode
    // ============================================
    let master = null;

    try {
        const listRes = await fetch(`${MASTER_API_URL}/master/organizations/`);
        if (listRes.ok) {
            const payload = await listRes.json();
            const items = Array.isArray(payload) ? payload : (payload.results || []);
            master = findMatchingOrgByCurrentHost(items) || items.find((item) =>
                item.slug === identifier ||
                normalizeOrgDomain(item.org_domain) === normalizeOrgDomain(identifier) ||
                normalizeOrgDomain(item.org_domain) === normalizeOrgDomain(window.location.href)
            ) || null;
        }
    } catch (err) {
        console.warn('[org_config] Master registry list lookup failed:', err.message);
    }

    if (!master) {
        const masterRes = await fetch(
            `${MASTER_API_URL}/resolve-host?host=${encodeURIComponent(identifier)}`
        );

        if (!masterRes.ok) {
            throw new Error(`Master DB error: ${masterRes.status}`);
        }

        master = await masterRes.json();
    }

    const tenantApiBase = normalizeApiBase(master.api_url || MASTER_API_URL);
    const tenantRes = await fetch(`${tenantApiBase}/config`);
    if (!tenantRes.ok) {
        throw new Error(`Tenant API error: ${tenantRes.status}`);
    }

    const tenant = await tenantRes.json();

    return {
        slug: master.slug,
        org_domain: master.domain || master.org_domain,
        subscription_tier: master.tier || master.subscription_tier,
        subscription_status: master.status || master.subscription_status,
        feature_flags: master.feature_flags || {},
        ...tenant,
    };
};

// ============================================
// CACHE
// ============================================
let cachedOrg = null;
let loadPromise = null;

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
            console.info(`[org_config] ✓ Loaded org: ${org.slug} (${org.team_name})`);
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
// List demo tenants (for a switcher UI)
// ============================================
export const getDemoTenants = () => {
    return Object.entries(DEMO_MASTER).map(([slug, tenant]) => ({
        slug,
        name: tenant.team_name,
        domain: tenant.org_domain,
        color: tenant.color_code_1,
    }));
};

// ============================================
// Switch demo tenant (reloads page with ?tenant=xxx)
// ============================================
export const switchDemoTenant = (slug) => {
    if (typeof window === 'undefined') return;

    const url = new URL(window.location.href);
    url.searchParams.set('tenant', slug);
    window.location.href = url.toString();
};

// ============================================
// DEFAULT EXPORT
// ============================================
const org_config = {
    loadOrgConfig,
    getOrgConfig,
    clearOrgCache,
    getTenantIdentifier,
    getDemoTenants,
    switchDemoTenant,
    DEMO_MASTER,
};

export default org_config;
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
// DEMO TENANTS — Test T2K, DRS, ABC instantly
// Toggle in browser: ?tenant=drs | ?tenant=t2k | ?tenant=abc
// Or set VITE_DEMO_TENANT=drs in .env
// ============================================
const DEMO_TENANTS = {
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
        team_logo_url: 'https://static.gosugamers.net/7b/b6/e1/2bbeef7d498f5f10d3b99fcadd39f6191099f22f2727aeb7615c5ee024.webp?w=256',
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

// ============================================
// Detect tenant identifier (domain, subdomain, or override)
// Priority:
//   1. ?tenant=drs  → query param (dev/testing)
//   2. VITE_DEMO_TENANT → .env override (dev/testing)
//   3. exact hostname match in DEMO_TENANTS (dev/testing)
//   4. localhost → default slug
//   5. full domain (drsesports.com)
//   6. subdomain (drs.optech.com.np → "drs")
// ============================================
const getTenantIdentifier = () => {
    if (typeof window === 'undefined') return DEFAULT_TENANT_SLUG;

    // 1. Query param override: ?tenant=drs
    const urlParams = new URLSearchParams(window.location.search);
    const queryTenant = urlParams.get('tenant');
    if (queryTenant) {
        console.info(`[org_config] Tenant override via query param: ${queryTenant}`);
        return queryTenant.toLowerCase();
    }

    // 2. .env override: VITE_DEMO_TENANT=drs
    if (ENV_DEMO_TENANT) {
        console.info(`[org_config] Tenant override via .env: ${ENV_DEMO_TENANT}`);
        return ENV_DEMO_TENANT.toLowerCase();
    }

    // 3. Exact hostname match with demo tenants
    const host = window.location.hostname
        .toLowerCase()
        .replace(/^www\./, '');

    for (const [slug, tenant] of Object.entries(DEMO_TENANTS)) {
        if (tenant.org_domain === host) {
            console.info(`[org_config] Tenant matched by domain: ${slug}`);
            return slug;
        }
    }

    // 4. localhost / 127.0.0.1
    if (host === 'localhost' || host === '127.0.0.1') {
        return DEFAULT_TENANT_SLUG;
    }

    // 5. Full domain lookup (backend will resolve)
    //    e.g., drsesports.com → backend finds tenant
    //    We return the full hostname here so backend can match
    if (!host.includes('.optech.')) {
        // Not a subdomain of optech → send full domain
        return host;
    }

    // 6. Subdomain fallback: drs.optech.com.np → "drs"
    const parts = host.split('.');
    if (parts.length >= 3) return parts[0];

    return DEFAULT_TENANT_SLUG;
};

// ============================================
// Fetch org data from backend
// ============================================
const fetchOrgData = async () => {
    const identifier = getTenantIdentifier();

    // Demo mode → return from DEMO_TENANTS
    if (USE_DEMO) {
        console.info(`[org_config] Demo mode — loading tenant: ${identifier}`);

        // Try exact match first
        if (DEMO_TENANTS[identifier]) {
            return { ...DEMO_TENANTS[identifier] };
        }

        // Try to match by domain
        for (const tenant of Object.values(DEMO_TENANTS)) {
            if (tenant.org_domain === identifier) return { ...tenant };
        }

        // Fallback to abc
        console.warn(`[org_config] Unknown demo tenant "${identifier}", using abc`);
        return { ...DEMO_TENANTS.abc };
    }

    // ============================================
    // Real backend mode
    // ============================================

    // 1. Ask master DB: "who is this domain/subdomain?"
    const masterRes = await fetch(
        `${MASTER_API_URL}/resolve-host?host=${encodeURIComponent(identifier)}`
    );

    if (!masterRes.ok) {
        throw new Error(`Master DB error: ${masterRes.status}`);
    }

    const master = await masterRes.json();

    // 2. Fetch tenant-specific config
    const tenantRes = await fetch(`${master.api_url}/config`);
    if (!tenantRes.ok) {
        throw new Error(`Tenant API error: ${tenantRes.status}`);
    }

    const tenant = await tenantRes.json();

    // 3. Merge master + tenant
    return {
        // Master layer
        slug: master.slug,
        org_domain: master.domain,
        subscription_tier: master.tier,
        subscription_status: master.status,
        feature_flags: master.feature_flags || {},

        // Tenant layer
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
    return Object.entries(DEMO_TENANTS).map(([slug, tenant]) => ({
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
    DEMO_TENANTS,
};

export default org_config;
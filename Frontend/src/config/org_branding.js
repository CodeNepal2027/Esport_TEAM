// src/config/org_branding.js
// ============================================
// ORG BRANDING — syncs <title> and favicon
// with the resolved org config.
// Call after loadOrgConfig() resolves.
// ============================================

const FAVICON_SELECTOR = "link[rel~='icon']";
const APPLE_ICON_SELECTOR = "link[rel='apple-touch-icon']";

const setFavicon = (href, type = 'image/png') => {
    if (!href) return;

    // Standard favicon
    let link = document.querySelector(FAVICON_SELECTOR);
    if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
    }
    link.type = type;
    link.href = href;

    // Apple touch icon (iOS home screen) — nice to have
    let apple = document.querySelector(APPLE_ICON_SELECTOR);
    if (!apple) {
        apple = document.createElement('link');
        apple.rel = 'apple-touch-icon';
        document.head.appendChild(apple);
    }
    apple.href = href;
};

const setTitle = (title) => {
    if (title) document.title = title;
};

// Optional: swap meta description too
const setMetaDescription = (content) => {
    if (!content) return;
    let meta = document.querySelector("meta[name='description']");
    if (!meta) {
        meta = document.createElement('meta');
        meta.name = 'description';
        document.head.appendChild(meta);
    }
    meta.content = content;
};

/**
 * Apply org branding to <head>.
 * @param {object} org — resolved org config (from getOrgConfig())
 */
export const applyOrgBranding = (org) => {
    if (!org) return;

    const title = org.team_name
        ? `${org.team_name}${org.team_tag ? ` (${org.team_tag})` : ''}`
        : 'Esports Team';

    setTitle(title);
    setFavicon(org.team_logo_url);

    const desc = org.team_name
        ? `Official website of ${org.team_name}. Latest news, roster, events and more.`
        : '';
    setMetaDescription(desc);
};

export default applyOrgBranding;
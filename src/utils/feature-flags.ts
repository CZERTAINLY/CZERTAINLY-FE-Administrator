/**
 * Centralized feature-flag helpers.
 *
 * Flags are sourced from `window.__ENV__` which is injected at runtime before the application boots,
 * so reading them once at module-load time is safe and avoids scattering the raw `window?.__ENV__?.ENABLE_*`
 * expression across the codebase.
 */

const env = typeof window !== 'undefined' ? window?.__ENV__ : undefined;

export const featureFlags = {
    /** When `false`, all proxy-related UI (routes, sidebar, columns, forms) is hidden. */
    isProxiesEnabled: env?.ENABLE_PROXIES === true,

    /** When `false`, all trusted-certificate-related UI is hidden. */
    isTrustedCertificatesEnabled: env?.ENABLE_TRUSTED_CERTIFICATES === true,
} as const;

export const loginRedirect = (loginUrl: string, redirect: string | null) => {
    const fullUrl = loginUrl.startsWith('http') ? loginUrl : `${globalThis.location.origin}${loginUrl}`;
    if (redirect) {
        const separator = fullUrl.includes('?') ? '&' : '?';
        const finalUrl = `${fullUrl}${separator}redirect=${encodeURIComponent(redirect)}`;
        globalThis.location.assign(finalUrl);
    } else {
        globalThis.location.assign(fullUrl);
    }
};

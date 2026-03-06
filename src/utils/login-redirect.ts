export const loginRedirect = (loginUrl: string, redirect: string | null) => {
    const fullUrl = loginUrl.startsWith('http') ? loginUrl : `${window.location.origin}${loginUrl}`;
    if (redirect) {
        const separator = fullUrl.includes('?') ? '&' : '?';
        const finalUrl = `${fullUrl}${separator}redirect=${encodeURIComponent(redirect)}`;
        window.location.assign(finalUrl);
    } else {
        window.location.assign(fullUrl);
    }
};

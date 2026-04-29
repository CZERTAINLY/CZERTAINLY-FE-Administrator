export const CBOM_REPOSITORY_HEALTH_WARNING_MESSAGE = 'Ensure that entered CBOM Repository URL is reachable. Health check failed.';

export const validateUrl = (url?: string): string | undefined => {
    if (!url || /^https?:\/\/[a-zA-Z0-9\-.]+(:\d+?)?(\/[a-zA-Z0-9\-.]*)*/.test(url)) {
        return undefined;
    }
    return 'Please enter valid URL.';
};

const normalizeUrl = (url: string): string => {
    let endIndex = url.length;
    while (endIndex > 0 && (url.codePointAt(endIndex - 1) ?? -1) === 47) {
        endIndex -= 1;
    }
    return endIndex === url.length ? url : url.slice(0, endIndex);
};

export const buildCbomHealthPath = (url: string): string => {
    const baseUrl = normalizeUrl(url);
    return baseUrl.endsWith('/api') ? '/v1/health' : '/api/v1/health';
};

export const validateHealthUrl = async (url: string | undefined, path: string, error: string): Promise<string | undefined> => {
    if (!url) {
        return undefined;
    }
    try {
        const healthUrl = `${normalizeUrl(url)}${path}`;
        const result = await fetch(healthUrl);
        const json = await result.json();
        return result.status === 200 && json.status === 'UP' ? undefined : error;
    } catch {
        return error;
    }
};

export const validateCbomRepositoryUrl = (url?: string): string | undefined => validateUrl(url);

export const getCbomRepositoryHealthWarning = async (url?: string): Promise<string | undefined> => {
    if (!url || validateCbomRepositoryUrl(url)) {
        return undefined;
    }

    return validateHealthUrl(url, buildCbomHealthPath(url), CBOM_REPOSITORY_HEALTH_WARNING_MESSAGE);
};

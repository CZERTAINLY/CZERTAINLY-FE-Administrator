import { describe, expect, test, vi, beforeEach, afterEach } from 'vitest';
import { loginRedirect } from './login-redirect';

describe('loginRedirect', () => {
    const originalLocation = window.location;
    const mockAssign = vi.fn();

    beforeEach(() => {
        // Mock window.location.assign
        delete (window as any).location;
        window.location = { ...originalLocation, assign: mockAssign };
    });

    afterEach(() => {
        window.location = originalLocation;
        vi.clearAllMocks();
    });

    describe('URL construction with absolute URLs', () => {
        test('should redirect to absolute HTTP URL without redirect parameter', () => {
            const loginUrl = 'https://example.com/login';
            loginRedirect(loginUrl, null);

            expect(mockAssign).toHaveBeenCalledWith('https://example.com/login');
            expect(mockAssign).toHaveBeenCalledTimes(1);
        });

        test('should redirect to absolute HTTPS URL without redirect parameter', () => {
            const loginUrl = 'https://example.com/login';
            loginRedirect(loginUrl, null);

            expect(mockAssign).toHaveBeenCalledWith('https://example.com/login');
            expect(mockAssign).toHaveBeenCalledTimes(1);
        });

        test('should append redirect parameter to absolute URL without query string', () => {
            const loginUrl = 'https://example.com/login';
            const redirect = '/dashboard';
            loginRedirect(loginUrl, redirect);

            expect(mockAssign).toHaveBeenCalledWith('https://example.com/login?redirect=%2Fdashboard');
            expect(mockAssign).toHaveBeenCalledTimes(1);
        });

        test('should append redirect parameter to absolute URL with existing query string', () => {
            const loginUrl = 'https://example.com/login?foo=bar';
            const redirect = '/dashboard';
            loginRedirect(loginUrl, redirect);

            expect(mockAssign).toHaveBeenCalledWith('https://example.com/login?foo=bar&redirect=%2Fdashboard');
            expect(mockAssign).toHaveBeenCalledTimes(1);
        });
    });

    describe('URL construction with relative URLs', () => {
        test('should convert relative URL to absolute using window.location.origin', () => {
            // Mock window.location.origin
            Object.defineProperty(window.location, 'origin', {
                writable: true,
                value: 'http://localhost:3000',
            });

            const loginUrl = '/auth/login';
            loginRedirect(loginUrl, null);

            expect(mockAssign).toHaveBeenCalledWith('http://localhost:3000/auth/login');
            expect(mockAssign).toHaveBeenCalledTimes(1);
        });

        test('should append redirect parameter to relative URL without query string', () => {
            Object.defineProperty(window.location, 'origin', {
                writable: true,
                value: 'http://localhost:3000',
            });

            const loginUrl = '/auth/login';
            const redirect = '/dashboard';
            loginRedirect(loginUrl, redirect);

            expect(mockAssign).toHaveBeenCalledWith('http://localhost:3000/auth/login?redirect=%2Fdashboard');
            expect(mockAssign).toHaveBeenCalledTimes(1);
        });

        test('should append redirect parameter to relative URL with existing query string', () => {
            Object.defineProperty(window.location, 'origin', {
                writable: true,
                value: 'http://localhost:3000',
            });

            const loginUrl = '/auth/login?session=abc123';
            const redirect = '/dashboard';
            loginRedirect(loginUrl, redirect);

            expect(mockAssign).toHaveBeenCalledWith('http://localhost:3000/auth/login?session=abc123&redirect=%2Fdashboard');
            expect(mockAssign).toHaveBeenCalledTimes(1);
        });
    });

    describe('redirect parameter encoding', () => {
        test('should properly encode redirect parameter with special characters', () => {
            const loginUrl = 'https://example.com/login';
            const redirect = '/dashboard?tab=overview&id=123';
            loginRedirect(loginUrl, redirect);

            expect(mockAssign).toHaveBeenCalledWith('https://example.com/login?redirect=%2Fdashboard%3Ftab%3Doverview%26id%3D123');
        });

        test('should properly encode redirect parameter with spaces', () => {
            const loginUrl = 'https://example.com/login';
            const redirect = '/path with spaces';
            loginRedirect(loginUrl, redirect);

            expect(mockAssign).toHaveBeenCalledWith('https://example.com/login?redirect=%2Fpath%20with%20spaces');
        });

        test('should properly encode redirect parameter with hash', () => {
            const loginUrl = 'https://example.com/login';
            const redirect = '/dashboard#section';
            loginRedirect(loginUrl, redirect);

            expect(mockAssign).toHaveBeenCalledWith('https://example.com/login?redirect=%2Fdashboard%23section');
        });

        test('should handle empty string redirect', () => {
            const loginUrl = 'https://example.com/login';
            const redirect = '';
            loginRedirect(loginUrl, redirect);

            expect(mockAssign).toHaveBeenCalledWith('https://example.com/login');
        });
    });

    describe('edge cases', () => {
        test('should handle URL with multiple query parameters', () => {
            const loginUrl = 'https://example.com/login?foo=bar&baz=qux';
            const redirect = '/home';
            loginRedirect(loginUrl, redirect);

            expect(mockAssign).toHaveBeenCalledWith('https://example.com/login?foo=bar&baz=qux&redirect=%2Fhome');
        });

        test('should handle URL with trailing slash', () => {
            const loginUrl = 'https://example.com/login/';
            const redirect = '/dashboard';
            loginRedirect(loginUrl, redirect);

            expect(mockAssign).toHaveBeenCalledWith('https://example.com/login/?redirect=%2Fdashboard');
        });

        test('should handle redirect with absolute URL', () => {
            const loginUrl = 'https://example.com/login';
            const redirect = 'https://other-domain.com/page';
            loginRedirect(loginUrl, redirect);

            expect(mockAssign).toHaveBeenCalledWith('https://example.com/login?redirect=https%3A%2F%2Fother-domain.com%2Fpage');
        });

        test('should handle null redirect parameter', () => {
            const loginUrl = 'https://example.com/login';
            loginRedirect(loginUrl, null);

            expect(mockAssign).toHaveBeenCalledWith('https://example.com/login');
            expect(mockAssign).toHaveBeenCalledTimes(1);
        });
    });
});

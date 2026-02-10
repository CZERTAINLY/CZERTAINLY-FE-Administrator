import { test, expect } from '../../playwright/ct-test';
import { formatPEM } from './download';

test.describe('formatPEM', () => {
    test('should format short PEM string', () => {
        const result = formatPEM('short');
        expect(result).toContain('-----BEGIN CERTIFICATE-----');
        expect(result).toContain('-----END CERTIFICATE-----');
        expect(result).toContain('short');
    });

    test('should wrap long PEM string at 64 chars', () => {
        const longString = 'a'.repeat(100);
        const result = formatPEM(longString);
        expect(result).toContain('-----BEGIN CERTIFICATE-----');
        expect(result).toContain('\r\n');
        expect(result).toContain('-----END CERTIFICATE-----');
    });
});

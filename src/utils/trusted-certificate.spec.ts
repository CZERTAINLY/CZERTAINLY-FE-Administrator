import { describe, expect, test } from 'vitest';
import {
    formatTrustedCertificateDate,
    formatTrustedCertificateValue,
    MISSING_TRUSTED_CERTIFICATE_FIELD_CLICKABLE,
    MISSING_TRUSTED_CERTIFICATE_FIELD_NORMAL,
} from './trusted-certificate';

describe('trusted-certificate helpers', () => {
    describe('formatTrustedCertificateValue', () => {
        test('returns the placeholder for missing values', () => {
            expect(formatTrustedCertificateValue()).toBe(MISSING_TRUSTED_CERTIFICATE_FIELD_NORMAL);
            expect(formatTrustedCertificateValue(null)).toBe(MISSING_TRUSTED_CERTIFICATE_FIELD_NORMAL);
            expect(formatTrustedCertificateValue('')).toBe(MISSING_TRUSTED_CERTIFICATE_FIELD_NORMAL);
            expect(formatTrustedCertificateValue('   ')).toBe(MISSING_TRUSTED_CERTIFICATE_FIELD_NORMAL);
        });

        test('returns the placeholder for missing values (clickable)', () => {
            expect(formatTrustedCertificateValue(undefined, true)).toBe(MISSING_TRUSTED_CERTIFICATE_FIELD_CLICKABLE);
            expect(formatTrustedCertificateValue(null, true)).toBe(MISSING_TRUSTED_CERTIFICATE_FIELD_CLICKABLE);
            expect(formatTrustedCertificateValue('', true)).toBe(MISSING_TRUSTED_CERTIFICATE_FIELD_CLICKABLE);
            expect(formatTrustedCertificateValue('   ', true)).toBe(MISSING_TRUSTED_CERTIFICATE_FIELD_CLICKABLE);
        });

        test('returns the original value when present', () => {
            expect(formatTrustedCertificateValue('CN=example')).toBe('CN=example');
        });
    });

    describe('formatTrustedCertificateDate', () => {
        test('returns the placeholder for missing dates', () => {
            expect(formatTrustedCertificateDate()).toBe(MISSING_TRUSTED_CERTIFICATE_FIELD_NORMAL);
            expect(formatTrustedCertificateDate('')).toBe(MISSING_TRUSTED_CERTIFICATE_FIELD_NORMAL);
        });

        test('formats valid dates using the shared date formatter', () => {
            expect(formatTrustedCertificateDate('2026-03-16T12:34:56')).toBe('2026-03-16 12:34:56');
        });
    });
});

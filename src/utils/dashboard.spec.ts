import { describe, expect, test } from 'vitest';
import { SecretState } from 'types/openapi';
import {
    getDefaultColors,
    getValues,
    getCertificateDonutChartColorsByDaysOfExpiration,
    getDonutChartColorsByRandomNumberOfOptions,
    getSecretDonutChartColors,
} from './dashboard';

describe('dashboard utils', () => {
    describe('getDefaultColors', () => {
        test('should return array of 5 hex colors', () => {
            const colors = getDefaultColors();
            expect(colors).toHaveLength(5);
            expect(colors.every((c) => /^#[0-9a-fA-F]{6}$/.test(c))).toBe(true);
        });
    });

    describe('getValues', () => {
        test('should extract values from DashboardDict', () => {
            const data = { Active: 10, Expired: 5, Pending: 3 };
            expect(getValues(data)).toEqual([10, 5, 3]);
        });

        test('should return empty array for empty object', () => {
            expect(getValues({})).toEqual([]);
        });
    });

    describe('getCertificateDonutChartColorsByDaysOfExpiration', () => {
        test('should return undefined for undefined input', () => {
            expect(getCertificateDonutChartColorsByDaysOfExpiration(undefined)).toBeUndefined();
        });

        test('should map keys to colors', () => {
            const data = { '10': 5, '30': 10, Expired: 2 };
            const result = getCertificateDonutChartColorsByDaysOfExpiration(data);
            expect(result?.colors).toHaveLength(3);
            expect(result?.colors).toContain('#6B7280'); // 10
            expect(result?.colors).toContain('#EAB308'); // 30
            expect(result?.colors).toContain('#EF4444'); // Expired
        });
    });

    describe('getSecretDonutChartColors', () => {
        test('returns empty colors for undefined input', () => {
            expect(getSecretDonutChartColors(undefined)).toEqual({ colors: [] });
        });

        test('returns empty colors for empty object', () => {
            expect(getSecretDonutChartColors({})).toEqual({ colors: [] });
        });

        test('maps SecretState keys to correct hex colors', () => {
            const data = {
                [SecretState.Active]: 3,
                [SecretState.Expired]: 1,
                [SecretState.Failed]: 2,
            };
            const result = getSecretDonutChartColors(data);
            expect(result.colors).toHaveLength(3);
            expect(result.colors).toContain('#14B8A6'); // Active
            expect(result.colors).toContain('#9CA3AF'); // Expired
            expect(result.colors).toContain('#EF4444'); // Failed
        });

        test('preserves key order in the colors array', () => {
            const data = {
                [SecretState.Active]: 5,
                [SecretState.Inactive]: 2,
                [SecretState.Revoked]: 1,
            };
            const result = getSecretDonutChartColors(data);
            expect(result.colors).toEqual(['#14B8A6', '#1F2937', '#6B7280']);
        });

        test('falls back to default gray for unknown status', () => {
            const result = getSecretDonutChartColors({ unknown: 1 });
            expect(result.colors).toEqual(['#6B7280']);
        });
    });

    describe('getDonutChartColorsByRandomNumberOfOptions', () => {
        test('should return n colors when n <= base colors length', () => {
            const result = getDonutChartColorsByRandomNumberOfOptions(3);
            expect(result.colors).toHaveLength(3);
        });

        test('should return exact number of requested colors', () => {
            const result = getDonutChartColorsByRandomNumberOfOptions(15);
            expect(result.colors).toHaveLength(15);
        });

        test('should return valid hex colors', () => {
            const result = getDonutChartColorsByRandomNumberOfOptions(5);
            expect(result.colors.every((c) => /^#[0-9a-fA-F]{6}$/.test(c))).toBe(true);
        });
    });
});

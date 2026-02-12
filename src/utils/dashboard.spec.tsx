import { test, expect } from '../../playwright/ct-test';
import {
    getDefaultColors,
    getValues,
    getCertificateDonutChartColorsByDaysOfExpiration,
    getDonutChartColorsByRandomNumberOfOptions,
} from './dashboard';

test.describe('dashboard utils', () => {
    test.describe('getDefaultColors', () => {
        test('should return array of 5 hex colors', () => {
            const colors = getDefaultColors();
            expect(colors).toHaveLength(5);
            expect(colors.every((c) => /^#[0-9a-fA-F]{6}$/.test(c))).toBe(true);
        });
    });

    test.describe('getValues', () => {
        test('should extract values from DashboardDict', () => {
            const data = { Active: 10, Expired: 5, Pending: 3 };
            expect(getValues(data)).toEqual([10, 5, 3]);
        });

        test('should return empty array for empty object', () => {
            expect(getValues({})).toEqual([]);
        });
    });

    test.describe('getCertificateDonutChartColorsByDaysOfExpiration', () => {
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

    test.describe('getDonutChartColorsByRandomNumberOfOptions', () => {
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

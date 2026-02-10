import { test, expect } from '../../playwright/ct-test';
import { dateFormatter, timeFormatter, durationFormatter } from './dateUtil';

test.describe('dateUtil', () => {
    test.describe('dateFormatter', () => {
        test('should format date string', () => {
            const result = dateFormatter('2024-01-15T10:30:45');
            expect(result).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);
        });

        test('should format Date object', () => {
            const date = new Date('2024-06-15T14:25:30');
            const result = dateFormatter(date);
            expect(result).toContain('2024');
            expect(result).toContain('06');
            expect(result).toContain('15');
        });

        test('should pad single digit months and days', () => {
            const result = dateFormatter('2024-01-05T09:05:03');
            expect(result).toMatch(/2024-01-05/);
        });
    });

    test.describe('timeFormatter', () => {
        test('should format milliseconds as time', () => {
            const oneHour = 60 * 60 * 1000;
            const result = timeFormatter(oneHour);
            expect(result).toMatch(/\d{2}:\d{2}:\d{2}/);
        });

        test('should format time with days when duration > 24h', () => {
            const twoDays = 2 * 24 * 60 * 60 * 1000;
            const result = timeFormatter(twoDays);
            expect(result).toMatch(/\d{2}\.\d{2}:\d{2}:\d{2}/);
        });
    });

    test.describe('durationFormatter', () => {
        test('should return empty string for null/undefined startDate', () => {
            expect(durationFormatter(null, null)).toBe('');
            expect(durationFormatter(undefined, undefined)).toBe('');
        });

        test('should format duration between two dates', () => {
            const start = '2024-01-01T00:00:00';
            const end = '2024-01-01T01:30:00';
            const result = durationFormatter(start, end);
            expect(result).toBeTruthy();
        });
    });
});

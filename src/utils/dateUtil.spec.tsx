import { test, expect } from '../../playwright/ct-test';
import {
    dateFormatter,
    timeFormatter,
    durationFormatter,
    getFormattedDate,
    getFormattedDateTime,
    getDateInString,
    checkIfFieldAttributeTypeIsDate,
    checkIfFieldTypeIsDate,
    checkIfFieldOperatorIsInterval,
} from './dateUtil';
import { AttributeContentType, FilterFieldType, FilterConditionOperator } from 'types/openapi';

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

    test.describe('getFormattedDate', () => {
        test('should format date string as YYYY-MM-DD', () => {
            expect(getFormattedDate('2024-03-15T12:00:00')).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        });

        test('should return original string for invalid date', () => {
            expect(getFormattedDate('invalid')).toBe('invalid');
        });
    });

    test.describe('getFormattedDateTime', () => {
        test('should format date string with time', () => {
            const result = getFormattedDateTime('2024-03-15T14:30:45');
            expect(result).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);
        });

        test('should return original string for invalid date', () => {
            expect(getFormattedDateTime('invalid')).toBe('invalid');
        });
    });

    test.describe('getDateInString', () => {
        test('should return date with offset in ISO string', () => {
            const result = getDateInString(0);
            expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T/);
        });
    });

    test.describe('checkIfFieldAttributeTypeIsDate', () => {
        test('should return true for Date type', () => {
            expect(checkIfFieldAttributeTypeIsDate({ attributeContentType: AttributeContentType.Date } as any)).toBe(true);
        });

        test('should return true for Datetime type', () => {
            expect(checkIfFieldAttributeTypeIsDate({ attributeContentType: AttributeContentType.Datetime } as any)).toBe(true);
        });

        test('should return false for String type', () => {
            expect(checkIfFieldAttributeTypeIsDate({ attributeContentType: AttributeContentType.String } as any)).toBe(false);
        });
    });

    test.describe('checkIfFieldTypeIsDate', () => {
        test('should return true for Date', () => {
            expect(checkIfFieldTypeIsDate(FilterFieldType.Date)).toBe(true);
        });

        test('should return true for Datetime', () => {
            expect(checkIfFieldTypeIsDate(FilterFieldType.Datetime)).toBe(true);
        });

        test('should return undefined for Boolean', () => {
            expect(checkIfFieldTypeIsDate(FilterFieldType.Boolean)).toBeUndefined();
        });
    });

    test.describe('checkIfFieldOperatorIsInterval', () => {
        test('should return true for InNext', () => {
            expect(checkIfFieldOperatorIsInterval(FilterConditionOperator.InNext)).toBe(true);
        });

        test('should return true for InPast', () => {
            expect(checkIfFieldOperatorIsInterval(FilterConditionOperator.InPast)).toBe(true);
        });

        test('should return undefined for Equals', () => {
            expect(checkIfFieldOperatorIsInterval(FilterConditionOperator.Equals)).toBeUndefined();
        });
    });
});

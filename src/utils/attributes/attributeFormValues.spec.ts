import { test, expect } from '../../../playwright/ct-test';
import { getDatetimeFormValue, getDateFormValue } from './attributeFormValues';

test.describe('attributeFormValues', () => {
    test.describe('getDatetimeFormValue', () => {
        test('uses item.value.data when present', () => {
            const result = getDatetimeFormValue({ value: { data: '2024-06-15T12:00:00Z' } });
            expect(result.data).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
        });

        test('accepts string and returns ISO datetime', () => {
            const result = getDatetimeFormValue('2024-01-01T00:00:00');
            expect(result.data).toMatch(/^\d{4}-\d{2}-\d{2}T/);
        });

        test('accepts Date-like and returns ISO string', () => {
            const d = new Date('2024-03-10T10:00:00Z');
            const result = getDatetimeFormValue(d);
            expect(result.data).toBe(d.toISOString());
        });
    });

    test.describe('getDateFormValue', () => {
        test('uses item.value.data when present and returns YYYY-MM-DD', () => {
            const result = getDateFormValue({ value: { data: '2024-06-15T12:00:00Z' } });
            expect(result.data).toMatch(/^\d{4}-\d{2}-\d{2}$/);
            expect(result.data).toBe('2024-06-15');
        });

        test('accepts string and returns date part only', () => {
            const result = getDateFormValue('2024-01-01');
            expect(result.data).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        });
    });
});

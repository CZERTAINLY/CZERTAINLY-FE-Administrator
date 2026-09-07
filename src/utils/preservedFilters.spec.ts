import { describe, expect, test } from 'vitest';
import { preservedFilterRestore } from './preservedFilters';

const decide = (overrides: Partial<Parameters<typeof preservedFilterRestore>[0]> = {}) =>
    preservedFilterRestore({ withPreservedFilters: true, preservedCount: 1, currentCount: 0, ...overrides });

describe('preservedFilterRestore', () => {
    test('restores a deep link that left only a snapshot behind', () => {
        expect(decide()).toBe('restore');
    });

    test('reports a deep link whose filters are already in place as settled, not pending', () => {
        expect(decide({ currentCount: 2 })).toBe('settled');
    });

    test('does nothing on a page that does not honour deep-link filters', () => {
        expect(decide({ withPreservedFilters: false })).toBe('inapplicable');
    });

    test('stays armed when there is no snapshot to restore', () => {
        expect(decide({ preservedCount: 0 })).toBe('inapplicable');
    });

    test('stays armed when there is no snapshot even though filters are set', () => {
        expect(decide({ preservedCount: 0, currentCount: 3 })).toBe('inapplicable');
    });

    test.each([
        ['restore', { currentCount: 0 }],
        ['settled', { currentCount: 1 }],
    ] as const)('treats %s as the restore having happened', (expected, overrides) => {
        expect(decide(overrides)).toBe(expected);
        expect(decide(overrides)).not.toBe('inapplicable');
    });
});

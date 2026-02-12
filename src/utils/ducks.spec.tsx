import { test, expect } from '../../playwright/ct-test';
import { createFeatureSelector } from './ducks';

test.describe('ducks utils', () => {
    test.describe('createFeatureSelector', () => {
        test('should return feature state for given state', () => {
            const selector = createFeatureSelector<{ count: number }>('counter');
            const state = { counter: { count: 42 }, other: { data: 'x' } };
            expect(selector(state)).toEqual({ count: 42 });
        });

        test('should return undefined when feature does not exist', () => {
            const selector = createFeatureSelector('missing');
            const state = { counter: { count: 1 } };
            expect(selector(state)).toBeUndefined();
        });

        test('should memoize selector result', () => {
            const selector = createFeatureSelector<number>('value');
            const state = { value: 10 };
            const result1 = selector(state);
            const result2 = selector(state);
            expect(result1).toBe(10);
            expect(result2).toBe(10);
        });
    });
});
